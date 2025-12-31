import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import * as analytics from '../services/analyticsService';

interface PricingModalProps {
  onClose: () => void;
  onPurchase: (amount: number, cost: number) => void;
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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleJoinWaitlist = async () => {
    if (!selectedPackage || !user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'waitlist'), {
        userId: user.uid,
        email: user.email || '',
        selectedPackage,
        timestamp: serverTimestamp(),
        notified: false,
      });

      analytics.trackPurchaseInitiated(selectedPackage, PACKAGES.find(p => p.id === selectedPackage)?.price || 0);

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to join waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success confirmation screen
  if (isSubmitted) {
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

          <h2 className="text-2xl font-bold text-white mb-2">You're on the List! 🎉</h2>
          <p className="text-gray-400 text-sm mb-6">
            We'll notify you at <span className="text-[#4f7eff] font-medium">{user?.email}</span> when payments go live.
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

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-[#0a0f1a]/90 backdrop-blur-sm" 
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full md:max-w-4xl bg-[#151c2c] rounded-t-2xl md:rounded-2xl shadow-2xl border border-[#252f3f] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] md:m-4"
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
              <h2 className="text-lg md:text-2xl font-bold text-white">Get More Credits</h2>
              <p className="text-blue-100 text-xs md:text-sm">Select a pack and join the waitlist</p>
            </div>
            <div className="w-6 md:hidden" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Info Banner */}
          <div className="bg-amber-500/10 px-4 md:px-6 py-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-200 text-xs md:text-sm">
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
                  className={`relative bg-[#0f1520] rounded-xl p-4 md:p-5 border-2 cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? 'border-[#4f7eff] bg-[#4f7eff]/5 shadow-lg shadow-[#4f7eff]/20'
                      : 'border-[#252f3f]'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#4f7eff] to-[#6366f1] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}

                  {/* Selection indicator */}
                  <div className={`absolute top-3 right-3 md:top-4 md:right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPackage === pkg.id ? 'bg-[#4f7eff] border-[#4f7eff]' : 'border-gray-600'
                  }`}>
                    {selectedPackage === pkg.id && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className="text-center mb-3 md:mb-4">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">₹{pkg.price}</div>
                    <div className="text-[#4f7eff] font-semibold text-sm md:text-base">
                      {pkg.credits} Credits
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      ₹{(pkg.price / pkg.credits).toFixed(2)} per credit
                    </div>
                  </div>

                  <ul className="space-y-1.5 md:space-y-2">
                    {[`${pkg.credits} AI Transformations`, 'High Quality (2K)', 'No Expiry'].map((feature) => (
                      <li key={feature} className="flex items-center text-gray-400 text-xs md:text-sm">
                        <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Footer with Button */}
        <div className="flex-shrink-0 p-4 md:p-6 pt-3 md:pt-4 border-t border-[#252f3f] bg-[#151c2c]">
          <button
            onClick={handleJoinWaitlist}
            disabled={!selectedPackage || isSubmitting}
            className={`w-full py-3.5 px-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              selectedPackage && !isSubmitting
                ? 'bg-gradient-to-r from-[#4f7eff] to-[#6366f1] text-white hover:opacity-90 shadow-lg shadow-[#4f7eff]/30'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>{selectedPackage ? 'Join Waitlist' : 'Select a Pack'}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="hidden md:block w-full mt-3 text-sm text-gray-400 hover:text-white transition-colors font-medium text-center"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
