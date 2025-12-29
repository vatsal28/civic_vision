import React, { useState, useEffect, useRef } from 'react';
import { CITY_FILTERS, HOME_FILTERS, FILTER_CATEGORY_LABELS } from '../constants';
import { AppMode, FilterCategory, FilterOption } from '../types';

interface FilterControlsProps {
  selectedFilters: string[];
  onToggleFilter: (id: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onReset: () => void;
  originalImage?: string | null;
  mode: AppMode;
}

// Group filters by category
const groupFiltersByCategory = (filters: FilterOption[]): Record<FilterCategory, FilterOption[]> => {
  const grouped: Record<FilterCategory, FilterOption[]> = {
    style: [],
    colors: [],
    furniture: [],
    architectural: []
  };

  filters.forEach(filter => {
    if (filter.category) {
      grouped[filter.category].push(filter);
    }
  });

  return grouped;
};

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedFilters,
  onToggleFilter,
  onGenerate,
  isGenerating,
  onReset,
  originalImage,
  mode
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<FilterCategory>>(
    new Set(['colors', 'furniture']) // Default expanded categories
  );

  const filters = mode === AppMode.CITY ? CITY_FILTERS : HOME_FILTERS;
  const groupedFilters = mode === AppMode.HOME ? groupFiltersByCategory(HOME_FILTERS) : null;

  const toggleCategory = (category: FilterCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 20) {
        setShowScrollHint(false);
      } else {
        setShowScrollHint(true);
      }
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      if (el.scrollHeight <= el.clientHeight) {
        setShowScrollHint(false);
      }
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const renderFilterItem = (filter: FilterOption) => (
    <label
      key={filter.id}
      className={`group flex items-start gap-3 p-2.5 rounded-lg transition-all cursor-pointer border ${selectedFilters.includes(filter.id)
        ? mode === AppMode.HOME
          ? 'bg-slate-800/80 border-purple-500/30'
          : 'bg-slate-800/80 border-cyan-500/30'
        : 'hover:bg-white/5 border-transparent'
        }`}
    >
      <div className="relative flex items-center pt-0.5">
        <input
          type="checkbox"
          checked={selectedFilters.includes(filter.id)}
          onChange={() => onToggleFilter(filter.id)}
          className={`peer appearance-none w-4 h-4 border border-slate-600 rounded bg-slate-800/50 transition-colors ${mode === AppMode.HOME
              ? 'checked:bg-purple-500 checked:border-purple-500'
              : 'checked:bg-cyan-500 checked:border-cyan-500'
            }`}
        />
        <svg className="absolute w-3 h-3 text-slate-900 pointer-events-none opacity-0 peer-checked:opacity-100 left-[2px] top-[2px] transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className={`block text-sm font-medium truncate transition-colors ${selectedFilters.includes(filter.id) ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
            {filter.label}
          </span>
        </div>
        <p className={`text-[11px] leading-tight mt-0.5 transition-colors ${selectedFilters.includes(filter.id)
            ? mode === AppMode.HOME ? 'text-purple-400/90' : 'text-cyan-400/90'
            : 'text-slate-500'
          }`}>
          {selectedFilters.includes(filter.id) ? 'Active' : filter.description}
        </p>
      </div>
    </label>
  );

  const headerConfig = mode === AppMode.HOME
    ? {
      icon: (
        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-600',
      title: 'Home Vision',
      sectionTitle: 'Design Your Space'
    }
    : {
      icon: (
        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: 'from-cyan-500 to-blue-600',
      title: 'City Vision',
      sectionTitle: 'Select Improvements'
    };

  return (
    <div className="flex flex-col h-auto md:h-full w-full md:w-80 bg-slate-900/90 backdrop-blur-xl border-r border-slate-700 shadow-2xl z-20 overflow-hidden">
      {/* Header */}
      <div className="p-3 md:p-5 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3 mb-1">
          <div className={`p-1 md:p-1.5 bg-gradient-to-br ${headerConfig.gradient} rounded-lg shadow-lg ${mode === AppMode.HOME ? 'shadow-purple-900/40' : 'shadow-cyan-900/40'}`}>
            {headerConfig.icon}
          </div>
          <h1 className="text-base md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {headerConfig.title}
          </h1>
        </div>
      </div>

      {/* Filters List Wrapper */}
      <div className="relative flex-1 min-h-[250px] md:min-h-0">
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-y-auto custom-scrollbar p-3 md:p-4 space-y-1 pb-12 md:pb-16"
        >
          <div className="flex justify-between items-center mb-2 md:mb-3 px-1 md:px-2">
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-bold">{headerConfig.sectionTitle}</h2>
            {showScrollHint && (
              <span className={`text-[10px] font-medium animate-pulse ${mode === AppMode.HOME ? 'text-purple-400' : 'text-cyan-400'}`}>
                Scroll for more ↓
              </span>
            )}
          </div>

          {/* City Mode: Flat list */}
          {mode === AppMode.CITY && filters.map(renderFilterItem)}

          {/* Home Mode: Categorized with collapsible sections */}
          {mode === AppMode.HOME && groupedFilters && (
            <div className="space-y-3">
              {(Object.keys(FILTER_CATEGORY_LABELS) as FilterCategory[]).map(category => {
                const categoryFilters = groupedFilters[category];
                if (categoryFilters.length === 0) return null;

                const isExpanded = expandedCategories.has(category);
                const selectedInCategory = categoryFilters.filter(f => selectedFilters.includes(f.id)).length;

                return (
                  <div key={category} className="border border-slate-700/50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800/80 transition-colors"
                    >
                      <span className="font-medium text-sm text-slate-200">
                        {FILTER_CATEGORY_LABELS[category]}
                      </span>
                      <div className="flex items-center gap-2">
                        {selectedInCategory > 0 && (
                          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
                            {selectedInCategory} active
                          </span>
                        )}
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="p-2 space-y-1 bg-slate-900/50">
                        {categoryFilters.map(renderFilterItem)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Strong Bottom Gradient Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pointer-events-none transition-opacity duration-300 flex justify-center items-end pb-4 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}
        >
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-2 md:p-4 border-t border-slate-800 bg-slate-900/95 space-y-1.5 md:space-y-3 flex-shrink-0 relative z-30">
        <button
          onClick={onGenerate}
          disabled={isGenerating || selectedFilters.length === 0}
          className={`w-full py-2 md:py-3 px-3 md:px-4 rounded-xl font-bold text-slate-900 shadow-lg transition-all transform flex items-center justify-center gap-2 group relative overflow-hidden text-sm md:text-base ${isGenerating || selectedFilters.length === 0
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : mode === AppMode.HOME
              ? 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 hover:shadow-purple-500/25'
              : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 hover:shadow-cyan-500/25'
            }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{mode === AppMode.HOME ? 'Reimagine Space' : 'Transform Image'}</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          disabled={isGenerating}
          className="w-full py-1 md:py-2 px-3 md:px-4 rounded-lg font-medium text-slate-500 hover:text-white hover:underline decoration-slate-500 underline-offset-4 transition-all text-xs"
        >
          Reset All
        </button>
      </div>

      {/* Mobile Image Preview - At Bottom */}
      {originalImage && (
        <div className="md:hidden p-2 pb-3 border-t border-slate-800 bg-slate-800/30 flex-shrink-0 flex-grow">
          <div className="relative w-full h-44 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
            <img
              src={originalImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-slate-200 font-medium">
              Your Image
            </div>
          </div>
        </div>
      )}
    </div>
  );
};