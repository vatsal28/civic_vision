import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FurnitureItem } from '../types';

interface DraggableFurnitureProps {
  item: FurnitureItem;
  containerWidth: number;
  containerHeight: number;
  isActive: boolean;
}

const DraggableFurniture: React.FC<DraggableFurnitureProps> = ({
  item,
  containerWidth,
  containerHeight,
  isActive,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
    transform: CSS.Translate.toString(transform),
    cursor: isActive ? 'grabbing' : 'grab',
    zIndex: isActive ? 50 : 10,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {/* Furniture overlay */}
      <div
        className={`w-full h-full rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-150 select-none
          ${isActive
            ? 'border-blue-400 bg-blue-500/25 shadow-lg shadow-blue-400/30'
            : 'border-white/60 bg-black/20 hover:border-white/90 hover:bg-black/30'
          }`}
        style={{
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      >
        <span className="text-xl md:text-2xl drop-shadow-md leading-none">{item.emoji}</span>
        <span className="text-[10px] md:text-xs text-white font-semibold mt-0.5 px-1.5 py-0.5 bg-black/50 rounded-full backdrop-blur-sm leading-tight text-center drop-shadow">
          {item.label}
        </span>
      </div>
    </div>
  );
};

interface RearrangeModeProps {
  originalImage: string;
  onGenerateRearranged: (items: FurnitureItem[]) => void;
  onBack: () => void;
  isDetecting: boolean;
  isGenerating: boolean;
  detectedItems: FurnitureItem[];
  onDetectFurniture: () => void;
}

export const RearrangeMode: React.FC<RearrangeModeProps> = ({
  originalImage,
  onGenerateRearranged,
  onBack,
  isDetecting,
  isGenerating,
  detectedItems,
  onDetectFurniture,
}) => {
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Sync items with detectedItems prop
  useEffect(() => {
    if (detectedItems.length > 0) {
      setItems([...detectedItems]);
    }
  }, [detectedItems]);

  // Track container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, delta } = event;

    if (!containerSize.width || !containerSize.height) return;

    setItems(prev => prev.map(item => {
      if (item.id !== active.id) return item;

      // Convert pixel delta to percentage
      const dx = (delta.x / containerSize.width) * 100;
      const dy = (delta.y / containerSize.height) * 100;

      const newX = Math.max(0, Math.min(100 - item.width, item.x + dx));
      const newY = Math.max(0, Math.min(100 - item.height, item.y + dy));

      return { ...item, x: newX, y: newY };
    }));
  }, [containerSize]);

  const handleReset = () => {
    if (detectedItems.length > 0) {
      setItems([...detectedItems]);
    }
  };

  const hasBeenMoved = items.some((item, i) => {
    const orig = detectedItems[i];
    return orig && (Math.abs(item.x - orig.x) > 1 || Math.abs(item.y - orig.y) > 1);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-black/[0.06] transition-colors"
          >
            <svg className="w-4 h-4 text-[#1D1D1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">Rearrange Mode</h2>
            <p className="text-[10px] text-[#6E6E73]">Drag furniture to new positions</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleReset}
            className="text-[11px] text-[#0071E3] hover:text-[#0077ED] font-medium transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-[#F5F5F7] min-h-0">
        {items.length === 0 ? (
          /* Detect Furniture CTA */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-full max-w-xs aspect-video rounded-2xl overflow-hidden mb-6 shadow-lg">
              <img src={originalImage} alt="Room" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <AnimatePresence mode="wait">
              {isDetecting ? (
                <motion.div
                  key="detecting"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-[#0071E3]/20 border-t-[#0071E3] animate-spin" />
                  <p className="text-sm font-medium text-[#1D1D1F]">Detecting furniture…</p>
                  <p className="text-xs text-[#6E6E73]">AI is analyzing your room</p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col items-center gap-3"
                >
                  <p className="text-sm font-medium text-[#1D1D1F]">Detect furniture in your room</p>
                  <p className="text-xs text-[#6E6E73] max-w-xs">
                    AI will identify moveable furniture and let you drag them to new positions
                  </p>
                  <button
                    onClick={onDetectFurniture}
                    className="mt-2 px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-medium rounded-full transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                  >
                    Detect Furniture
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Drag Canvas */
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div
              ref={containerRef}
              className="relative w-full h-full"
              style={{ touchAction: 'none' }}
            >
              {/* Room image */}
              <img
                src={originalImage}
                alt="Room"
                className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />

              {/* Furniture overlays */}
              {items.map(item => (
                <DraggableFurniture
                  key={item.id}
                  item={item}
                  containerWidth={containerSize.width}
                  containerHeight={containerSize.height}
                  isActive={activeId === item.id}
                />
              ))}

              {/* Hint */}
              {!activeId && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                    Drag furniture to rearrange
                  </div>
                </div>
              )}
            </div>
          </DndContext>
        )}
      </div>

      {/* Footer — Generate button */}
      {items.length > 0 && (
        <div className="p-4 border-t border-black/[0.06] bg-white/80 backdrop-blur-xl flex-shrink-0">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] text-[#6E6E73]">{items.length} items detected</span>
            {hasBeenMoved && (
              <span className="text-[11px] text-[#34C759] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] inline-block" />
                Positions updated
              </span>
            )}
          </div>
          <button
            onClick={() => onGenerateRearranged(items)}
            disabled={isGenerating}
            className={`w-full py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${isGenerating
                ? 'bg-[#F5F5F7] text-[#6E6E73] cursor-not-allowed'
                : 'bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white shadow-sm hover:shadow-md active:scale-[0.98]'
              }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-[#6E6E73]/30 border-t-[#6E6E73] animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Generate Rearrangement
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
