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

const groupFiltersByCategory = (filters: FilterOption[]): Record<FilterCategory, FilterOption[]> => {
  const grouped: Record<FilterCategory, FilterOption[]> = { roomType: [], style: [], colors: [], furniture: [], architectural: [] };
  filters.forEach(filter => { if (filter.category) grouped[filter.category].push(filter); });
  return grouped;
};

const getSelectedStyleName = (selectedFilters: string[], styleFilters: FilterOption[]) =>
  styleFilters.find(f => selectedFilters.includes(f.id))?.label || 'Select style';

const getSelectedRoomTypeName = (selectedFilters: string[], roomTypeFilters: FilterOption[]) =>
  roomTypeFilters.find(f => selectedFilters.includes(f.id))?.label || 'Select room type';

// Mode accent colors
const MODE_ACCENT = {
  [AppMode.CITY]: '#0071E3',
  [AppMode.HOME]: '#BF5AF2',
  [AppMode.REARRANGE]: '#34C759',
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
  showResult = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<FilterCategory>>(new Set(['roomType']));
  const [showOriginalPreview, setShowOriginalPreview] = useState(false);

  const handleReuploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please upload an image file.'); return; }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (onReupload) onReupload(result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const filters = mode === AppMode.CITY ? CITY_FILTERS : HOME_FILTERS;
  const groupedFilters = mode === AppMode.HOME ? groupFiltersByCategory(HOME_FILTERS) : null;
  const accentColor = MODE_ACCENT[mode] || '#0071E3';
  const isHomeMode = mode === AppMode.HOME;

  const toggleCategory = (category: FilterCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
      return newSet;
    });
  };

  const getActiveCount = (category: FilterCategory): number => {
    if (!groupedFilters) return 0;
    return groupedFilters[category].filter(f => selectedFilters.includes(f.id)).length;
  };

  const renderFilterItem = (filter: FilterOption, compact = false) => {
    const isSelected = selectedFilters.includes(filter.id);
    const isRoomType = filter.category === 'roomType';

    return (
      <button
        key={filter.id}
        onClick={() => onToggleFilter(filter.id)}
        className={`filter-item w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
          isSelected ? 'bg-white' : 'hover:bg-black/[0.02]'
        } ${compact ? 'py-2' : ''}`}
        style={{
          border: isSelected ? `1px solid ${accentColor}30` : '1px solid transparent',
          boxShadow: isSelected ? `0 1px 4px ${accentColor}10` : 'none',
        }}
      >
        {/* Icon */}
        <span className="text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F5F7]">
          {filter.icon}
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[#1D1D1F] truncate">{filter.label}</div>
          {!compact && <div className="text-[11px] text-[#6E6E73] truncate mt-0.5">{filter.description}</div>}
        </div>

        {/* Indicator */}
        {isRoomType ? (
          <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors`}
            style={{ borderColor: isSelected ? accentColor : '#AEAEB2' }}>
            {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />}
          </div>
        ) : (
          <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors`}
            style={{
              borderColor: isSelected ? accentColor : '#AEAEB2',
              background: isSelected ? accentColor : 'transparent',
            }}>
            {isSelected && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        )}
      </button>
    );
  };

  const renderCategoryAccordion = (category: FilterCategory) => {
    if (!groupedFilters) return null;
    const categoryFilters = groupedFilters[category];
    if (categoryFilters.length === 0) return null;

    const isExpanded = expandedCategories.has(category);
    const activeCount = getActiveCount(category);
    const isStyleCategory = category === 'style';
    const isRoomTypeCategory = category === 'roomType';

    return (
      <div
        key={category}
        className="rounded-xl overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <button
          onClick={() => toggleCategory(category)}
          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#F5F5F7] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{FILTER_CATEGORY_ICONS[category]}</span>
            <span className="text-sm font-medium text-[#1D1D1F]">{FILTER_CATEGORY_LABELS[category]}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isRoomTypeCategory || isStyleCategory ? (
              <span className="text-[10px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-md border border-black/[0.06]">
                {isRoomTypeCategory
                  ? getSelectedRoomTypeName(selectedFilters, categoryFilters)
                  : getSelectedStyleName(selectedFilters, categoryFilters)}
              </span>
            ) : activeCount > 0 ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ color: accentColor, background: `${accentColor}10` }}>
                {activeCount}
              </span>
            ) : null}

            <svg className={`w-3.5 h-3.5 text-[#AEAEB2] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="p-2 pt-0 space-y-0.5 bg-[#F5F5F7]/60">
                {categoryFilters.map(filter => renderFilterItem(filter, true))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-full w-full md:w-72"
      style={{
        background: '#FAFAFA',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button onClick={onBack} className="p-1.5 -ml-1 rounded-full hover:bg-black/[0.05] transition-colors">
              <svg className="w-4 h-4 text-[#1D1D1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-sm font-semibold text-[#1D1D1F]" style={{ letterSpacing: '-0.01em' }}>
            {isHomeMode ? 'Design Options' : 'Enhancements'}
          </h1>
        </div>

        <button
          onClick={onReset}
          className="text-xs font-medium transition-colors"
          style={{ color: accentColor }}
        >
          Reset
        </button>
      </div>

      {/* Image Preview */}
      {originalImage && (
        <div className="px-3 pt-3 pb-1 flex-shrink-0">
          <div
            className="relative rounded-xl overflow-hidden bg-[#E8E8ED]"
            style={{ aspectRatio: '16/9', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            {showResult && generatedImage && !showOriginalPreview ? (
              <>
                <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                <span
                  className="absolute top-2 left-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded text-white tracking-wide"
                  style={{ background: accentColor }}
                >
                  After
                </span>
                <button
                  onClick={() => setShowOriginalPreview(true)}
                  className="absolute bottom-2 right-2 text-[10px] font-medium text-[#1D1D1F] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-black/[0.08] shadow-sm hover:bg-white transition-colors"
                >
                  View Before
                </button>
              </>
            ) : (
              <>
                <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                <span
                  className="absolute top-2 left-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide"
                  style={showResult
                    ? { background: 'rgba(255,255,255,0.9)', color: '#6E6E73', border: '1px solid rgba(0,0,0,0.1)' }
                    : { background: accentColor, color: '#fff' }
                  }
                >
                  {showResult ? 'Before' : 'Original'}
                </span>
                {showResult && generatedImage ? (
                  <button
                    onClick={() => setShowOriginalPreview(false)}
                    className="absolute bottom-2 right-2 text-[10px] font-medium text-[#1D1D1F] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-black/[0.08] shadow-sm hover:bg-white transition-colors"
                  >
                    View After
                  </button>
                ) : (
                  <button
                    onClick={handleReuploadClick}
                    className="absolute bottom-2 right-2 text-[10px] font-medium text-[#1D1D1F] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-black/[0.08] shadow-sm hover:bg-white transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Change
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Section Label */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
        <p className="text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-wider">
          {isHomeMode ? 'Customize' : 'Improvements'}
        </p>
        {!isHomeMode && selectedFilters.length > 0 && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: accentColor, background: `${accentColor}10` }}>
            {selectedFilters.length} selected
          </span>
        )}
      </div>

      {/* Filters */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3 space-y-1.5">
        {mode === AppMode.CITY && (
          <div className="space-y-0.5">
            {filters.map(filter => renderFilterItem(filter))}
          </div>
        )}

        {mode === AppMode.HOME && groupedFilters && (
          <div className="space-y-1.5">
            {(Object.keys(FILTER_CATEGORY_LABELS) as FilterCategory[]).map(category =>
              renderCategoryAccordion(category)
            )}
          </div>
        )}
      </div>

      {/* Generate CTA */}
      <div
        className="p-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: '#FAFAFA' }}
      >
        <button
          onClick={() => { setShowOriginalPreview(false); onGenerate(); }}
          disabled={isGenerating || selectedFilters.length === 0}
          className="cta-button w-full py-3 px-4 rounded-full font-semibold text-white text-sm transition-all flex items-center justify-center gap-2"
          style={{
            background: isGenerating || selectedFilters.length === 0
              ? '#E8E8ED'
              : accentColor,
            color: isGenerating || selectedFilters.length === 0 ? '#AEAEB2' : '#fff',
            cursor: isGenerating || selectedFilters.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: isGenerating || selectedFilters.length === 0 ? 'none' : `0 3px 12px ${accentColor}30`,
          }}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-[#AEAEB2]/30 border-t-[#AEAEB2] animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {showResult ? 'Regenerate' : 'Generate'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
