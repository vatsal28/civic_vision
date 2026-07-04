import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidationWarningBannerProps {
  issues: string[];
  confidence: number;
  explanation?: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export const ValidationWarningBanner: React.FC<ValidationWarningBannerProps> = ({
  issues,
  confidence,
  explanation,
  onRetry,
  onDismiss
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg shadow-md mb-4"
      >
        <div className="flex items-start gap-3">
          {/* Warning Icon */}
          <svg
            className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <div className="flex-1">
            {/* Title */}
            <h3 className="text-sm font-semibold text-amber-800 mb-1">
              ⚠️ AI May Have Changed Room Structure
            </h3>

            {/* Issues List */}
            {issues && issues.length > 0 && (
              <div className="text-xs text-amber-700 mb-2">
                <p className="font-medium mb-1">Detected changes:</p>
                <ul className="list-disc list-inside pl-2 space-y-0.5">
                  {issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Explanation */}
            {explanation && (
              <p className="text-xs text-amber-700 mb-2 italic">
                {explanation}
              </p>
            )}

            {/* Confidence Score */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-amber-600 font-medium">
                Validation Confidence:
              </span>
              <div className="flex-1 max-w-[200px] h-2 bg-amber-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`h-full ${
                    confidence >= 80
                      ? 'bg-green-500'
                      : confidence >= 60
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                />
              </div>
              <span className="text-xs text-amber-600 font-bold">
                {confidence}%
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again (Free)
              </button>

              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-white text-amber-700 text-xs font-medium rounded-lg border border-amber-300 hover:bg-amber-50 transition-colors shadow-sm"
              >
                Keep This Result
              </button>
            </div>

            {/* Info Note */}
            <p className="text-xs text-amber-600 mt-2">
              💡 Tip: Try selecting fewer filters or use different combinations for better results.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
