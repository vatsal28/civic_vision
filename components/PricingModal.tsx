import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../contexts/AuthContext';
import * as analytics from '../services/analyticsService';
import { loadRazorpay, RazorpayResponse } from '../utils/razorpay';
import {
  getStripe,
  detectUserCountry,
  formatPrice,
  convertINRtoUSD
} from '../services/stripeService';

interface PricingModalProps {
  onClose: () => void;
  onPurchase: (amount: number, cost: number) => void;
  isDemoMode?: boolean;
}

const PACKAGES = [
  {
    id: 'starter',
    credits: 10,
    price: 49,
    popular: false,
  },
  {
    id: 'popular',
    credits: 50,
    price: 199,
    popular: true,
  },
  {
    id: 'pro',
    credits: 100,
    price: 349,
    popular: false,
  },
];

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onPurchase, isDemoMode = false }) => {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const [purchasedCredits, setPurchasedCredits] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Country detection for payment routing
  // Demo mode always uses India/Razorpay for testing
  const [userCountry, setUserCountry] = useState<string>(isDemoMode ? 'IN' : 'IN'); // Default to India

  // Waitlist state
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistCountry, setWaitlistCountry] = useState('');
  const [waitlistCustomCountry, setWaitlistCustomCountry] = useState('');
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [isWaitlistSuccess, setIsWaitlistSuccess] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  // Detect user country on mount (skip if demo mode - always use India)
  useEffect(() => {
    if (isDemoMode) {
      setUserCountry('IN'); // Force India for demo/Razorpay testing
    } else {
      const country = detectUserCountry();
      setUserCountry(country);
    }
  }, [isDemoMode]);

  const handlePurchase = async () => {
    if (!selectedPackage || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Route payment based on country
      if (userCountry === 'IN') {
        await handleRazorpayPayment();
      } else {
        await handleStripePayment();
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!selectedPackage || !user) return;

    try {
      const functions = getFunctions();
      const createOrder = httpsCallable(functions, 'createRazorpayOrder');
      
      // Create Razorpay order via Cloud Function
      const result = await createOrder({ packageId: selectedPackage });
      const orderData = result.data as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        packageName: string;
        credits: number;
      };

      analytics.trackPurchaseInitiated(selectedPackage, PACKAGES.find(p => p.id === selectedPackage)?.price || 0);

      // Load Razorpay SDK and open checkout
      const Razorpay = await loadRazorpay();
      
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Redo AI',
        description: `${orderData.credits} Credits - ${orderData.packageName}`,
        prefill: {
          email: user.email || '',
          name: user.displayName || '',
        },
        theme: {
          color: '#4f7eff',
        },
        handler: async (response: RazorpayResponse) => {
          // Payment successful - verify with backend
          try {
            const verifyPayment = httpsCallable(functions, 'verifyPayment');
            await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            // Show success state
            setPurchasedCredits(orderData.credits);
            setIsPurchaseComplete(true);
            
            // Notify parent component
            onPurchase(orderData.credits, orderData.amount / 100);
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            // Even if verification fails, webhook will handle it
            setPurchasedCredits(orderData.credits);
            setIsPurchaseComplete(true);
            onPurchase(orderData.credits, orderData.amount / 100);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
          escape: true,
          confirm_close: true,
        },
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        setError(response.error.description || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      });
      rzp.open();

    } catch (err: any) {
      console.error('Failed to initiate Razorpay payment:', err);
      setError(err.message || 'Failed to start payment. Please try again.');
      setIsSubmitting(false);
      throw err;
    }
  };

  const handleStripePayment = async () => {
    if (!selectedPackage || !user) return;

    try {
      const selectedPkg = PACKAGES.find(p => p.id === selectedPackage);
      if (!selectedPkg) {
        throw new Error('Invalid package selected');
      }

      // Convert INR to USD
      const usdAmount = convertINRtoUSD(selectedPkg.price);

      analytics.trackPurchaseInitiated(selectedPackage, selectedPkg.price);

      // Create Stripe Checkout session via Cloud Function
      const functions = getFunctions();
      const createCheckoutSession = httpsCallable(functions, 'createStripeCheckout');

      const result = await createCheckoutSession({
        packageId: selectedPackage,
        credits: selectedPkg.credits,
        amount: usdAmount,
        currency: 'usd',
        successUrl: `${window.location.origin}?payment=success&credits=${selectedPkg.credits}`,
        cancelUrl: `${window.location.origin}?payment=cancelled`,
      });

      const data = result.data as { sessionId: string; url?: string };

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        throw new Error(error.message || 'Failed to redirect to payment');
      }

      // User will be redirected to Stripe, then back to our success/cancel URLs
    } catch (err: any) {
      console.error('Failed to initiate Stripe payment:', err);
      setError(err.message || 'Failed to start payment. Please try again.');
      setIsSubmitting(false);
      throw err;
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!waitlistEmail || !waitlistCountry) {
      setWaitlistError('Please fill in all fields');
      return;
    }

    if (waitlistCountry === 'Other' && !waitlistCustomCountry.trim()) {
      setWaitlistError('Please enter your country name');
      return;
    }

    setIsSubmittingWaitlist(true);
    setWaitlistError(null);

    try {
      const finalCountry = waitlistCountry === 'Other' ? waitlistCustomCountry : waitlistCountry;

      const payload = {
        data: {
          Email: waitlistEmail,
          Country: finalCountry,
          Timestamp: new Date().toISOString(),
        }
      };

      console.log('Sending to SheetDB:', payload);

      const response = await fetch('https://sheetdb.io/api/v1/52pld98y7re25', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('SheetDB response:', responseData);

      if (!response.ok) {
        console.error('SheetDB error:', responseData);
        throw new Error(responseData.message || 'Failed to join waitlist');
      }

      setIsWaitlistSuccess(true);
      analytics.trackShareClicked(); // Track waitlist signup
    } catch (err: any) {
      console.error('Waitlist submission error:', err);
      setWaitlistError(err.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  // Waitlist success screen
  if (isWaitlistSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[#0a0f1a]/90 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md bg-[#151c2c] rounded-2xl shadow-2xl border border-[#252f3f] overflow-hidden p-6 md:p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#4f7eff] to-[#6366f1] rounded-2xl flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">You're on the list! 🎉</h2>
          <p className="text-gray-400 text-sm mb-6">
            We'll notify you at <span className="text-[#4f7eff] font-medium">{waitlistEmail}</span> when international payments are available.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#4f7eff] to-[#6366f1] text-white font-bold rounded-xl hover:opacity-90 transition-all"
          >
            Got it!
          </button>
        </motion.div>
      </div>
    );
  }

  // Success confirmation screen
  if (isPurchaseComplete) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[#0a0f1a]/90 backdrop-blur-sm" 
          onClick={onClose}
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md bg-[#151c2c] rounded-2xl shadow-2xl border border-[#252f3f] overflow-hidden p-6 md:p-8 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h2>
          <p className="text-gray-400 text-sm mb-6">
            <span className="text-[#4f7eff] font-medium">{purchasedCredits} credits</span> have been added to your account.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#4f7eff] to-[#6366f1] text-white font-bold rounded-xl hover:opacity-90 transition-all"
          >
            Start Creating!
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-white/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full md:max-w-4xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] md:m-4"
      >
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-[#4f7eff] to-[#6366f1] p-4 md:p-6 text-center flex-shrink-0">
          <div className="flex items-center justify-between md:justify-center">
            <button
              onClick={onClose}
              className="md:hidden p-1 -ml-1 text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>Get More Credits</h2>
              <p className="text-blue-100 text-xs md:text-sm">Select a pack and complete your purchase</p>
            </div>
            <div className="w-6 md:hidden" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Info Banner */}
          <div className="bg-amber-500/10 px-4 md:px-6 py-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-700 text-xs md:text-sm">
                <strong>Tip:</strong> Use "Your Own Key" mode for free unlimited transformations!
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {PACKAGES.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative bg-[#FFF9F5] rounded-xl p-4 md:p-5 border-2 cursor-pointer transition-all shadow-sm ${
                    selectedPackage === pkg.id
                      ? 'border-[#4f7eff] bg-[#4f7eff]/5 shadow-lg shadow-[#4f7eff]/20'
                      : 'border-black/10'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#4f7eff] to-[#6366f1] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                        POPULAR
                      </span>
                    </div>
                  )}

                  {/* Selection indicator */}
                  <div className={`absolute top-3 right-3 md:top-4 md:right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPackage === pkg.id ? 'bg-[#4f7eff] border-[#4f7eff]' : 'border-[#6B6574]'
                  }`}>
                    {selectedPackage === pkg.id && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className="text-center mb-3 md:mb-4">
                    <div className="text-2xl md:text-3xl font-bold text-[#2D2A32] mb-1">
                      {formatPrice(pkg.price, userCountry)}
                    </div>
                    <div className="text-[#4f7eff] font-semibold text-sm md:text-base">
                      {pkg.credits} Credits
                    </div>
                    <div className="text-[#6B6574] text-xs mt-1">
                      {userCountry === 'IN'
                        ? `₹${(pkg.price / pkg.credits).toFixed(2)}`
                        : `$${(convertINRtoUSD(pkg.price) / pkg.credits).toFixed(2)}`
                      } per credit
                    </div>
                  </div>

                  <ul className="space-y-1.5 md:space-y-2">
                    {[`${pkg.credits} AI Transformations`, 'High Quality (2K)', 'No Expiry'].map((feature) => (
                      <li key={feature} className="flex items-center text-[#6B6574] text-xs md:text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Payment Method Info */}
            {userCountry !== 'IN' && (
              <div className="mt-4 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-2 justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-xs md:text-sm text-green-700 font-medium">
                    International payments powered by Stripe
                  </p>
                </div>
              </div>
            )}

            {/* International Payments Waitlist - Only show for India users as example */}
            {userCountry === 'IN' && !showWaitlistForm ? (
              <div className="mt-4 p-4 bg-gradient-to-br from-[#4f7eff]/10 to-[#6366f1]/10 border border-[#4f7eff]/30 rounded-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 text-center md:text-left">
                    <svg className="w-5 h-5 text-[#4f7eff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs md:text-sm text-[#4f7eff] font-medium">
                      Payments powered by Razorpay for India
                    </p>
                  </div>
                </div>
              </div>
            ) : userCountry === 'IN' && showWaitlistForm ? (
              <form onSubmit={handleWaitlistSubmit} className="mt-4 p-4 bg-[#1e2638] border border-[#252f3f] rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">Join International Waitlist</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWaitlistForm(false);
                      setWaitlistError(null);
                      setWaitlistEmail('');
                      setWaitlistCountry('');
                      setWaitlistCustomCountry('');
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="waitlist-email" className="block text-xs text-gray-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="waitlist-email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2.5 bg-[#0f1520] border border-[#252f3f] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#4f7eff] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="waitlist-country" className="block text-xs text-gray-400 mb-1.5">
                      Country
                    </label>
                    <select
                      id="waitlist-country"
                      value={waitlistCountry}
                      onChange={(e) => setWaitlistCountry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0f1520] border border-[#252f3f] rounded-lg text-white text-sm focus:outline-none focus:border-[#4f7eff] transition-colors"
                      required
                    >
                      <option value="">Select your country</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albania">Albania</option>
                      <option value="Algeria">Algeria</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Australia">Australia</option>
                      <option value="Austria">Austria</option>
                      <option value="Bahrain">Bahrain</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Bulgaria">Bulgaria</option>
                      <option value="Canada">Canada</option>
                      <option value="Chile">Chile</option>
                      <option value="China">China</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Croatia">Croatia</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Czech Republic">Czech Republic</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Finland">Finland</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Greece">Greece</option>
                      <option value="Hong Kong">Hong Kong</option>
                      <option value="Hungary">Hungary</option>
                      <option value="Iceland">Iceland</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Israel">Israel</option>
                      <option value="Italy">Italy</option>
                      <option value="Japan">Japan</option>
                      <option value="Jordan">Jordan</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Latvia">Latvia</option>
                      <option value="Lebanon">Lebanon</option>
                      <option value="Lithuania">Lithuania</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Malta">Malta</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Morocco">Morocco</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Norway">Norway</option>
                      <option value="Oman">Oman</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Peru">Peru</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Poland">Poland</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Romania">Romania</option>
                      <option value="Russia">Russia</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Serbia">Serbia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Slovakia">Slovakia</option>
                      <option value="Slovenia">Slovenia</option>
                      <option value="South Africa">South Africa</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Spain">Spain</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Taiwan">Taiwan</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {waitlistCountry === 'Other' && (
                    <div>
                      <label htmlFor="waitlist-custom-country" className="block text-xs text-gray-400 mb-1.5">
                        Enter Country Name
                      </label>
                      <input
                        type="text"
                        id="waitlist-custom-country"
                        value={waitlistCustomCountry}
                        onChange={(e) => setWaitlistCustomCountry(e.target.value)}
                        placeholder="e.g., Iceland"
                        className="w-full px-3 py-2.5 bg-[#0f1520] border border-[#252f3f] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#4f7eff] transition-colors"
                      />
                    </div>
                  )}

                  {waitlistError && (
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-xs text-center">{waitlistError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingWaitlist}
                    className={`w-full py-2.5 px-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm ${
                      isSubmittingWaitlist
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#4f7eff] to-[#6366f1] text-white hover:opacity-90 shadow-lg shadow-[#4f7eff]/20'
                    }`}
                  >
                    {isSubmittingWaitlist ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Joining...</span>
                      </>
                    ) : (
                      'Join Waitlist'
                    )}
                  </button>
                </div>
              </form>
            ) : null}

            {/* Custom Pricing Section */}
            <div className="mt-6 p-4 bg-[#1e2638] rounded-xl border border-[#252f3f]">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#4f7eff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm mb-1">Need Custom Pricing?</h3>
                  <p className="text-gray-400 text-xs mb-3">
                    For bulk orders or custom pricing plans, contact us directly.
                  </p>
                  <a
                    href="mailto:vatsalmishra28@gmail.com?subject=Custom Pricing Inquiry - Redo AI"
                    onClick={(e) => {
                      // Analytics tracking
                      analytics.trackShareClicked(); // Reusing this for now, or we could add a new event
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f1520] hover:bg-[#151c2c] border border-[#252f3f] hover:border-[#4f7eff] rounded-lg text-[#4f7eff] hover:text-[#6366f1] text-sm font-medium transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Button */}
        <div className="flex-shrink-0 p-4 md:p-6 pt-3 md:pt-4 border-t border-black/10 bg-[#FFF9F5]">
          {error && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={!selectedPackage || isSubmitting}
            className={`w-full py-3.5 px-4 font-bold rounded-full transition-all flex items-center justify-center gap-2 ${
              selectedPackage && !isSubmitting
                ? 'bg-gradient-to-r from-[#4f7eff] to-[#6366f1] text-white hover:opacity-90 shadow-lg shadow-[#4f7eff]/30'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>
                  {selectedPackage
                    ? `Buy Pack - ${formatPrice(PACKAGES.find(p => p.id === selectedPackage)?.price || 0, userCountry)}`
                    : 'Select a Pack'
                  }
                </span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="hidden md:block w-full mt-3 text-sm text-[#6B6574] hover:text-[#2D2A32] transition-colors font-medium text-center"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
