import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../contexts/AuthContext';

interface PricingModalProps {
  onClose: () => void;
  onPurchase: (amount: number, cost: number) => void;
}

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
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

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onPurchase }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuyCredits = async (packageId: string, credits: number, price: number) => {
    if (!user) {
      alert('Please sign in to purchase credits');
      return;
    }

    setLoading(packageId);

    try {
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        console.error('Razorpay SDK not loaded');
        alert('Payment gateway is still loading. Please try again in a moment.');
        setLoading(null);
        return;
      }

      // Create Razorpay order via Cloud Function
      const functions = getFunctions();
      const createOrder = httpsCallable(functions, 'createRazorpayOrder');

      const result = await createOrder({
        packageId,
        amount: price,
        credits,
      });

      const data = result.data as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      console.log('Order created:', data);

      // Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'CivicVision',
        description: `${credits} Credits`,
        order_id: data.orderId,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          alert(`Payment successful! ${credits} credits will be added to your account.`);
          onClose();
        },
        prefill: {
          email: user.email || '',
          name: user.displayName || '',
        },
        theme: {
          color: '#06b6d4', // Cyan color
        },
        modal: {
          ondismiss: function () {
            setLoading(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Error creating order:', error);

      // More detailed error message
      const errorMessage = error.message || error.code || 'Unknown error';
      alert(`Failed to initiate payment: ${errorMessage}\n\nPlease use your own Gemini API key (BYOK mode) in the meantime.`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-1">Unlock Transformations</h2>
          <p className="text-blue-100">Visualize a cleaner, better India with AI.</p>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-amber-200 text-sm font-medium mb-1">
                Payment Integration In Progress
              </p>
              <p className="text-amber-300/80 text-xs leading-relaxed">
                We're currently setting up secure payment processing. In the meantime, you can use <strong>BYOK (Bring Your Own Key)</strong> mode with your own Gemini API key for unlimited transformations at no cost.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-slate-700/50 rounded-xl p-6 border ${pkg.popular ? 'border-cyan-500 ring-2 ring-cyan-500/50' : 'border-slate-600'
                  } transition-all hover:border-cyan-400`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-2">₹{pkg.price}</div>
                  <div className="text-slate-400 text-sm">
                    {pkg.credits} Credits
                  </div>
                  <div className="text-slate-500 text-xs mt-1">
                    ₹{(pkg.price / pkg.credits).toFixed(2)} per credit
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {pkg.credits} AI Transformations
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High Quality (2K)
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No Expiry
                  </li>
                </ul>

                <button
                  onClick={() => handleBuyCredits(pkg.id, pkg.credits, pkg.price)}
                  disabled={loading !== null}
                  className={`w-full py-3 px-4 ${pkg.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-slate-600 text-white'
                    } font-bold rounded-xl hover:opacity-90 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === pkg.id ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Buy {pkg.credits} Credits</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Payment
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Instant Credit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
