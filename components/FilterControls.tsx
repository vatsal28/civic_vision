import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CITY_FILTERS, HOME_FILTERS, FILTER_CATEGORY_LABELS, FILTER_CATEGORY_ICONS } from '../constants';
import { AppMode, FilterCategory, FilterOption } from '../types';

interface FilterControlsProps {
  selectedFilters: string[];
  onToggleFilter: (id: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onReset: () => void;
  onBack?: () => void;
  onReupload?: (base64: string) => void;
  originalImage?: string | null;
  generatedImage?: string | null;
  mode: AppMode;
  showResult?: boolean;
}

// Group filters by category
const groupFiltersByCategory = (filters: FilterOption[]): Record<FilterCategory, FilterOption[]> => {
  const grouped: Record<FilterCategory, FilterOption[]> = {
    roomType: [],
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

// Get selected style name for Home mode
const getSelectedStyleName = (selectedFilters: string[], styleFilters: FilterOption[]): string => {
  const selectedStyle = styleFilters.find(f => selectedFilters.includes(f.id));
  return selectedStyle?.label || 'Select style';
};

// Get selected room type name for Home mode
const getSelectedRoomTypeName = (selectedFilters: string[], roomTypeFilters: FilterOption[]): string => {
  const selectedRoom = roomTypeFilters.find(f => selectedFilters.includes(f.id));
  return selectedRoom?.label || 'Select room type';
};

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedFilters,
  onToggleFilter,
  onGenerate,
  isGenerating,
  onReset,
  onBack,
  onReupload,
  originalImage,
  generatedImage,
  mode,
  showResult = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReuploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (onReupload) {
        onReupload(result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<FilterCategory>>(
    new Set(['roomType']) // Default expanded category
  );
  const [showOriginalPreview, setShowOriginalPreview] = useState(false);

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

  const accentColor = mode === AppMode.HOME ? '#ec4899' : '#4f7eff';
  const isHomeMode = mode === AppMode.HOME;

  // Count active filters per category
  const getActiveCount = (category: FilterCategory): number => {
    if (!groupedFilters) return 0;
    return groupedFilters[category].filter(f => selectedFilters.includes(f.id)).length;
  };

  // Render a single filter item
  const renderFilterItem = (filter: FilterOption, compact = false) => {
    const isSelected = selectedFilters.includes(filter.id);
    const isRoomType = filter.category === 'roomType';

    return (
      <button
        key={filter.id}
        onClick={() => onToggleFilter(filter.id)}
        className={`filter-item w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
          isSelected
            ? isHomeMode ? 'selected home-mode' : 'selected'
            : 'border-transparent hover:border-[#252f3f]'
        } ${compact ? 'py-2.5' : ''}`}
      >
        {/* Icon */}
        <span className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e2638]">
          {filter.icon}
        </span>

        {/* Text */}
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium text-white truncate">{filter.label}</div>
          {!compact && (
            <div className="text-xs text-gray-500 truncate">{filter.description}</div>
          )}
        </div>

        {/* Radio button for room types, Checkbox for others */}
        {isRoomType ? (
          // Radio button (circular)
          <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
            isSelected
              ? 'bg-transparent border-[#ec4899]'
              : 'border-gray-600 bg-transparent'
          }`}>
            {isSelected && (
              <div className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
            )}
          </div>
        ) : (
          // Checkbox (square)
          <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
            isSelected
              ? isHomeMode
                ? 'bg-[#ec4899] border-[#ec4899]'
                : 'bg-[#4f7eff] border-[#4f7eff]'
              : 'border-gray-600 bg-transparent'
          }`}>
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        )}
      </button>
    );
  };

  // Render category accordion for Home mode
  const renderCategoryAccordion = (category: FilterCategory) => {
    if (!groupedFilters) return null;

    const categoryFilters = groupedFilters[category];
    if (categoryFilters.length === 0) return null;

    const isExpanded = expandedCategories.has(category);
    const activeCount = getActiveCount(category);
    const isStyleCategory = category === 'style';
    const isRoomTypeCategory = category === 'roomType';

    return (
      <div key={category} className="border border-[#252f3f] rounded-xl overflow-hidden bg-[#151c2c]">
        <button
          onClick={() => toggleCategory(category)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-[#1e2638]/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{FILTER_CATEGORY_ICONS[category]}</span>
            <span className="font-medium text-sm text-white">
              {FILTER_CATEGORY_LABELS[category]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isRoomTypeCategory || isStyleCategory ? (
              <span className="text-xs text-gray-400 bg-[#1e2638] px-2.5 py-1 rounded-lg">
                {isRoomTypeCategory
                  ? getSelectedRoomTypeName(selectedFilters, categoryFilters)
                  : getSelectedStyleName(selectedFilters, categoryFilters)
                }
              </span>
            ) : activeCount > 0 ? (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isHomeMode
                  ? 'bg-[#ec4899]/20 text-[#ec4899]'
                  : 'bg-[#4f7eff]/20 text-[#4f7eff]'
              }`}>
                {activeCount} active
              </span>
            ) : null}

            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-2 pt-0 space-y-1 bg-[#0f1520]">
                {categoryFilters.map(filter => renderFilterItem(filter, true))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full md:w-80 bg-[#0f1520] md:bg-[#151c2c]/95 md:backdrop-blur-xl md:border-r md:border-[#252f3f]">
      {/* Hidden file input for reupload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#252f3f]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-1 -ml-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-base font-semibold text-white">
            {isHomeMode ? 'Edit Space' : 'Customize'}
          </h1>
        </div>
        
        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Image Preview */}
      {originalImage && (
        <div className="p-4 pb-2">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1e2638] border border-[#252f3f]">
            {/* Show generated image when available and not showing original */}
            {showResult && generatedImage && !showOriginalPreview ? (
              <>
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
                
                {/* After badge */}
                <div className="absolute top-2 left-2 z-20">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    isHomeMode 
                      ? 'bg-[#ec4899] text-white'
                      : 'bg-[#4f7eff] text-white'
                  }`}>
                    After
                  </span>
                </div>
                
                {/* Toggle to Original button */}
                <button 
                  onClick={() => setShowOriginalPreview(true)}
                  className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 bg-[#1e2638]/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-[#252f3f] hover:bg-[#252f3f] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Original
                </button>
              </>
            ) : (
              <>
                {/* Green/Pink tint overlay based on mode */}
                <div 
                  className="absolute inset-0 mix-blend-soft-light opacity-30 pointer-events-none z-10"
                  style={{ backgroundColor: isHomeMode ? '#ec4899' : '#84cc16' }}
                />
                
                <img
                  src={originalImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Original/Before badge */}
                <div className="absolute top-2 left-2 z-20">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    showResult
                      ? 'bg-[#1e2638] text-gray-300 border border-[#252f3f]'
                      : isHomeMode 
                        ? 'bg-[#ec4899] text-white'
                        : 'bg-[#84cc16] text-[#0a0f1a]'
                  }`}>
                    {showResult ? 'Before' : 'Original'}
                  </span>
                </div>
                
                {/* View After / Edit Photo button */}
                {showResult && generatedImage ? (
                  <button 
                    onClick={() => setShowOriginalPreview(false)}
                    className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 bg-[#1e2638]/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-[#252f3f] hover:bg-[#252f3f] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View After
                  </button>
                ) : (
                  <button 
                    onClick={handleReuploadClick}
                    className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 bg-[#1e2638]/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-[#252f3f] hover:bg-[#252f3f] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Reupload
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div>
          <h2 className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
            {isHomeMode ? 'Design Your Space' : 'Enhancements'}
          </h2>
          {!isHomeMode && (
            <p className="text-xs text-gray-500 mt-0.5">
              Select the improvements for your city.
            </p>
          )}
        </div>
        <button 
          onClick={onReset}
          className={`text-xs font-medium hover:underline ${
            isHomeMode ? 'text-[#ec4899]' : 'text-[#4f7eff]'
          }`}
        >
          Reset all
        </button>
      </div>

      {/* Filters List */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-2"
      >
        {/* City Mode: Flat list */}
        {mode === AppMode.CITY && (
          <div className="space-y-1.5">
            {filters.map(filter => renderFilterItem(filter))}
          </div>
        )}

        {/* Home Mode: Categorized accordions */}
        {mode === AppMode.HOME && groupedFilters && (
          <div className="space-y-2">
            {(Object.keys(FILTER_CATEGORY_LABELS) as FilterCategory[]).map(category => 
              renderCategoryAccordion(category)
            )}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="p-4 pt-2 border-t border-[#252f3f] bg-[#0f1520] md:bg-transparent">
        <button
          onClick={() => {
            setShowOriginalPreview(false);
            onGenerate();
          }}
          disabled={isGenerating || selectedFilters.length === 0}
          className={`cta-button w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            isGenerating || selectedFilters.length === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed !shadow-none'
              : isHomeMode
                ? 'bg-gradient-to-r from-[#ec4899] to-[#f472b6] hover:from-[#db2777] hover:to-[#ec4899]'
                : 'bg-gradient-to-r from-[#4f7eff] to-[#6366f1] hover:from-[#3b6df0] hover:to-[#4f7eff]'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>{showResult ? 'Reimagine Again' : 'Reimagine'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
