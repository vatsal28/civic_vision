
import React from 'react';

interface PricingModalProps {
  onClose: () => void;
  onPurchase: (amount: number, cost: number) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onPurchase }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-1">Unlock Transformations</h2>
          <p className="text-blue-100 text-sm">Visualize a cleaner, better India.</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <span className="text-4xl font-bold text-white">₹49</span>
            <span className="text-slate-400 text-sm ml-2">/ pack</span>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-slate-300 text-sm">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              10 AI Transformations
            </li>
            <li className="flex items-center text-slate-300 text-sm">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              High Quality (2K Resolution)
            </li>
            <li className="flex items-center text-slate-300 text-sm">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Supports Indian Infrastructure
            </li>
            <li className="flex items-center text-slate-300 text-sm">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No Expiry Date
            </li>
          </ul>

          <button
            onClick={() => onPurchase(10, 49)}
            className="w-full py-3 px-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-cyan-50 transition-colors shadow-lg flex justify-center items-center gap-2"
          >
            <span>Buy 10 Credits</span>
            <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          
          <div className="mt-4 text-center">
            <button 
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
