import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '../contexts/AuthContext';

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-slate-800 rounded-xl md:rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 md:p-6 text-center">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-1">Unlock Transformations</h2>
          <p className="text-blue-100 text-sm md:text-base">Visualize a cleaner, better India with AI.</p>
        </div>

        {/* Prominent Disclaimer Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 md:px-6 py-3 md:py-4 border-b-4 border-amber-600">
          <div className="flex items-start gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-base md:text-lg font-bold mb-1">
                ⚠️ Payment Integration In Progress
              </p>
              <p className="text-white/95 text-xs md:text-sm leading-relaxed mb-2 md:mb-3">
                We're setting up secure payment processing. Payments are temporarily disabled.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 border-2 border-white/40">
                <p className="text-white text-xs md:text-sm font-bold mb-1">✨ Use BYOK Mode Instead</p>
                <p className="text-white/95 text-[10px] md:text-xs leading-relaxed">
                  Close this modal and select <strong>"Use Your Own Key"</strong> on the home screen for unlimited transformations at no cost.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-slate-700/30 rounded-xl p-4 md:p-6 border ${pkg.popular ? 'border-slate-600' : 'border-slate-700'
                  } opacity-60`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-slate-600 text-slate-300 text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-4 md:mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-slate-300 mb-1 md:mb-2">₹{pkg.price}</div>
                  <div className="text-slate-400 text-xs md:text-sm">
                    {pkg.credits} Credits
                  </div>
                  <div className="text-slate-500 text-[10px] md:text-xs mt-1">
                    ₹{(pkg.price / pkg.credits).toFixed(2)} per credit
                  </div>
                </div>

                <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <li className="flex items-center text-slate-400 text-xs md:text-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {pkg.credits} AI Transformations
                  </li>
                  <li className="flex items-center text-slate-400 text-xs md:text-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High Quality (2K)
                  </li>
                  <li className="flex items-center text-slate-400 text-xs md:text-sm">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No Expiry
                  </li>
                </ul>

                <button
                  disabled={true}
                  className="w-full py-2 md:py-3 px-3 md:px-4 bg-slate-700 text-slate-500 font-bold rounded-xl cursor-not-allowed flex justify-center items-center gap-2 text-xs md:text-base"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Coming Soon</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 md:mt-8 text-center">
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
