import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackButtonsProps {
  mode: string;
  filterCount: number;
  onFeedback: (rating: 'good' | 'bad') => void;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  mode,
  filterCount,
  onFeedback,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [rating, setRating] = useState<'good' | 'bad' | null>(null);

  const handleFeedback = (selectedRating: 'good' | 'bad') => {
    setRating(selectedRating);
    setFeedbackGiven(true);
    onFeedback(selectedRating);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        {!feedbackGiven ? (
          <motion.div
            key="buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-[#6B6574] font-medium">
              How's the result?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleFeedback('good')}
                className="p-2 rounded-full bg-white/80 border border-green-200 hover:bg-green-50 hover:border-green-400 transition-all group"
                title="Good result"
              >
                <svg
                  className="w-4 h-4 text-[#6B6574] group-hover:text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleFeedback('bad')}
                className="p-2 rounded-full bg-white/80 border border-red-200 hover:bg-red-50 hover:border-red-400 transition-all group"
                title="Bad result"
              >
                <svg
                  className="w-4 h-4 text-[#6B6574] group-hover:text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 text-xs text-[#6B6574]"
          >
            <svg
              className={`w-4 h-4 ${rating === 'good' ? 'text-green-500' : 'text-amber-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">
              {rating === 'good'
                ? 'Thanks! Glad you like it!'
                : 'Thanks for the feedback!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
