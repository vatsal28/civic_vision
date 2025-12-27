import React, { useState } from 'react';
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
      // Save to Firestore
      await addDoc(collection(db, 'waitlist'), {
        userId: user.uid,
        email: user.email || '',
        selectedPackage,
        timestamp: serverTimestamp(),
        notified: false,
      });

      // Track analytics
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="relative w-full max-w-md bg-slate-800 rounded-xl md:rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all p-6 md:p-8 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">You're on the List! 🎉</h2>
          <p className="text-slate-400 text-sm md:text-base mb-6">
            Thanks! We'll notify you at <span className="text-cyan-400 font-medium">{user?.email}</span> when payments go live.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-slate-800 rounded-xl md:rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 md:p-6 text-center">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-1">Join the Waitlist</h2>
          <p className="text-blue-100 text-sm md:text-base">Select your preferred pack & we'll notify you when payments go live.</p>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 md:px-6 py-3 border-b border-amber-500/30">
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-200 text-xs md:text-sm">
              <strong>Tip:</strong> Use "Your Own Key" mode for free unlimited transformations while we set up payments!
            </p>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative bg-slate-700/30 rounded-xl p-4 md:p-6 border-2 cursor-pointer transition-all hover:bg-slate-700/50 ${selectedPackage === pkg.id
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                    : pkg.popular
                      ? 'border-slate-600'
                      : 'border-slate-700'
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                {/* Selection indicator */}
                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPackage === pkg.id ? 'bg-cyan-500 border-cyan-500' : 'border-slate-500'
                  }`}>
                  {selectedPackage === pkg.id && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div className="text-center mb-4 md:mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">₹{pkg.price}</div>
                  <div className="text-cyan-400 text-sm md:text-base font-semibold">
                    {pkg.credits} Credits
                  </div>
                  <div className="text-slate-500 text-[10px] md:text-xs mt-1">
                    ₹{(pkg.price / pkg.credits).toFixed(2)} per credit
                  </div>
                </div>

                <ul className="space-y-2 md:space-y-3">
                  <li className="flex items-center text-slate-300 text-xs md:text-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {pkg.credits} AI Transformations
                  </li>
                  <li className="flex items-center text-slate-300 text-xs md:text-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High Quality (2K)
                  </li>
                  <li className="flex items-center text-slate-300 text-xs md:text-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No Expiry
                  </li>
                </ul>
              </div>
            ))}
          </div>

          {/* Join Waitlist Button */}
          <div className="mt-6 md:mt-8">
            <button
              onClick={handleJoinWaitlist}
              disabled={!selectedPackage || isSubmitting}
              className={`w-full py-3 md:py-4 px-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base ${selectedPackage && !isSubmitting
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/30'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
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
          </div>

          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={onClose}
              className="text-xs md:text-sm text-slate-400 hover:text-white transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
