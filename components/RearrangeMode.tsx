import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FurnitureItem } from '../types';

// A palette of distinct colors for each detected item
const ITEM_COLORS = [
  '#0071E3', // Blue
  '#FF9500', // Orange
  '#FF3B30', // Red
  '#34C759', // Green
  '#AF52DE', // Purple
  '#FF2D55', // Pink
  '#5AC8FA', // Cyan
  '#FFCC00', // Yellow
];

interface DraggableItemProps {
  item: FurnitureItem;
  originalItem: FurnitureItem;
  isActive: boolean;
  colorIndex: number;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  originalItem,
  isActive,
  colorIndex,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });

  const color = ITEM_COLORS[colorIndex % ITEM_COLORS.length];
  const hasMoved =
    Math.abs(item.x - originalItem.x) > 1 || Math.abs(item.y - originalItem.y) > 1;

  return (
    <>
      {/* Ghost outline at original position */}
      {hasMoved && (
        <div
          style={{
            position: 'absolute',
            left: `${originalItem.x}%`,
            top: `${originalItem.y}%`,
            width: `${originalItem.width}%`,
            height: `${originalItem.height}%`,
            border: `2px dashed ${color}70`,
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      {/* Draggable item */}
      <div
        ref={setNodeRef}
        style={{
          position: 'absolute',
          left: `${item.x}%`,
          top: `${item.y}%`,
          width: `${item.width}%`,
          height: `${item.height}%`,
          transform: CSS.Translate.toString(transform),
          cursor: isActive ? 'grabbing' : 'grab',
          zIndex: isActive ? 50 : 10,
          touchAction: 'none',
        }}
        {...listeners}
        {...attributes}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            border: `2px solid ${isActive ? color : color + 'CC'}`,
            background: isActive ? `${color}35` : `${color}18`,
            boxShadow: isActive
              ? `0 8px 24px ${color}50, 0 0 0 3px ${color}25`
              : `0 2px 8px rgba(0,0,0,0.15)`,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isActive ? 'scale(1.04)' : 'scale(1)',
            transition: isActive ? 'none' : 'transform 0.15s ease, box-shadow 0.15s ease',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(10px, 2vw, 22px)',
              lineHeight: 1,
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
            }}
          >
            {item.emoji}
          </span>
          <span
            style={{
              fontSize: 'clamp(7px, 1.2vw, 11px)',
              color: 'white',
              fontWeight: 600,
              marginTop: '2px',
              padding: '1px 5px',
              background: `${color}CC`,
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '95%',
              letterSpacing: '0.01em',
            }}
          >
            {item.label}
          </span>
        </div>
      </div>
    </>
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
  const [originalItemsSnapshot, setOriginalItemsSnapshot] = useState<FurnitureItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Refs for the outer canvas container and the image element
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // The actual rendered bounds of the image inside the canvas (accounts for object-contain letterboxing)
  const [imageRect, setImageRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // Sync items when detectedItems prop changes (from parent after Gemini detection)
  useEffect(() => {
    if (detectedItems.length > 0) {
      setItems([...detectedItems]);
      setOriginalItemsSnapshot([...detectedItems]);
    }
  }, [detectedItems]);

  /**
   * Compute where the <img object-contain> is actually rendered within its container.
   * With object-contain there will be letterboxing (empty space) around the image.
   * Furniture bounding boxes from Gemini are relative to the IMAGE, so we must
   * position the overlay div to exactly match the rendered image area.
   */
  const updateImageRect = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return;
    const img = imageRef.current;
    if (!img.naturalWidth || !img.naturalHeight) return;

    const containerRect = canvasRef.current.getBoundingClientRect();
    const cw = containerRect.width;
    const ch = containerRect.height;
    const naturalAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = cw / ch;

    let renderedW: number, renderedH: number, offsetX: number, offsetY: number;

    if (naturalAspect > containerAspect) {
      // Image is wider than the container → letterboxed top and bottom
      renderedW = cw;
      renderedH = cw / naturalAspect;
      offsetX = 0;
      offsetY = (ch - renderedH) / 2;
    } else {
      // Image is taller than the container → pillarboxed left and right
      renderedH = ch;
      renderedW = ch * naturalAspect;
      offsetX = (cw - renderedW) / 2;
      offsetY = 0;
    }

    setImageRect({ left: offsetX, top: offsetY, width: renderedW, height: renderedH });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateImageRect);
    return () => window.removeEventListener('resize', updateImageRect);
  }, [updateImageRect]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, delta } = event;

      if (!imageRect) return;

      // delta is in pixels. Convert to % relative to the rendered image area.
      const dx = (delta.x / imageRect.width) * 100;
      const dy = (delta.y / imageRect.height) * 100;

      setItems(prev =>
        prev.map(item => {
          if (item.id !== active.id) return item;
          const newX = Math.max(0, Math.min(100 - item.width, item.x + dx));
          const newY = Math.max(0, Math.min(100 - item.height, item.y + dy));
          return { ...item, x: newX, y: newY };
        })
      );
    },
    [imageRect]
  );

  const handleReset = () => {
    if (originalItemsSnapshot.length > 0) {
      setItems([...originalItemsSnapshot]);
    }
  };

  const hasBeenMoved = items.some(item => {
    const orig = originalItemsSnapshot.find(o => o.id === item.id);
    return orig && (Math.abs(item.x - orig.x) > 1 || Math.abs(item.y - orig.y) > 1);
  });

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: '#F5F5F7', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 border-b border-black/[0.06] flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
          paddingBottom: '12px',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-black/[0.06] transition-colors"
          >
            <svg
              className="w-4 h-4 text-[#1D1D1F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
              Rearrange Room
            </h2>
            <p className="text-[10px] text-[#6E6E73]">
              {items.length > 0
                ? `${items.length} items detected · drag to rearrange`
                : 'AI will detect moveable items'}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleReset}
            className="text-[11px] text-[#0071E3] font-medium transition-colors hover:text-[#0077ED]"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Canvas ─────────────────────────────────────────────── */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden min-h-0"
        style={{ touchAction: 'none', background: '#1C1C1E' }}
      >
        {/* Room image — object-contain so full image is always visible */}
        <img
          ref={imageRef}
          src={originalImage}
          alt="Room"
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
          onLoad={updateImageRect}
        />

        {/* Pre-detection / detecting overlay */}
        <AnimatePresence>
          {items.length === 0 && (
            <motion.div
              key="detection-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
            >
              <div
                className="flex flex-col items-center gap-4 px-6 py-6 mx-4 max-w-xs w-full rounded-2xl"
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {isDetecting ? (
                  <>
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">Detecting furniture…</p>
                      <p className="text-xs text-white/60 mt-1">AI is analyzing your room</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    >
                      🔍
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">Detect Items</p>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">
                        AI will identify furniture, appliances, and decor you can drag and rearrange
                      </p>
                    </div>
                    <button
                      onClick={onDetectFurniture}
                      className="w-full py-2.5 rounded-full text-sm font-semibold text-[#1D1D1F] transition-all active:scale-[0.98]"
                      style={{ background: '#FFFFFF' }}
                    >
                      Detect Items
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Furniture drag overlay — sized to match the actual rendered image area */}
        {items.length > 0 && imageRect && (
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div
              style={{
                position: 'absolute',
                left: imageRect.left,
                top: imageRect.top,
                width: imageRect.width,
                height: imageRect.height,
              }}
            >
              {items.map((item, index) => {
                const orig = originalItemsSnapshot.find(o => o.id === item.id) || item;
                return (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    originalItem={orig}
                    isActive={activeId === item.id}
                    colorIndex={index}
                  />
                );
              })}

              {/* Drag hint pill */}
              {!activeId && (
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ zIndex: 20 }}
                >
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white"
                    style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <svg
                      className="w-3 h-3 opacity-70 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                      />
                    </svg>
                    Drag items to rearrange
                  </div>
                </div>
              )}
            </div>
          </DndContext>
        )}
      </div>

      {/* ── Footer — Generate button ────────────────────────────── */}
      {items.length > 0 && (
        <div
          className="flex-shrink-0 border-t border-black/[0.06]"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '12px 16px',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-[#6E6E73]">{items.length} items detected</span>
            <AnimatePresence>
              {hasBeenMoved && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="text-[11px] text-[#34C759] font-medium flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] inline-block" />
                  Positions updated
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => onGenerateRearranged(items)}
            disabled={isGenerating}
            className={`w-full py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isGenerating
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
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
