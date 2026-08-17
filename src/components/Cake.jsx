import React, { useState, useRef } from 'react';

export default function Cake({ onCut, isCut = false }) {
  const [sliceProgress, setSliceProgress] = useState(0);
  const [cutLine, setCutLine] = useState(null);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const handlePointerDown = (e) => {
    if (isCut) return;
    isDragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    setCutLine({ x1: x, y1: y, x2: x, y2: y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || isCut) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    setCutLine((prev) => (prev ? { ...prev, x2: x, y2: y } : null));

    // Calculate distance swiped
    if (cutLine) {
      const dx = x - cutLine.x1;
      const dy = y - cutLine.y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 80 && !isCut) {
        isDragging.current = false;
        triggerCut();
      }
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setTimeout(() => {
      if (!isCut) setCutLine(null);
    }, 400);
  };

  const triggerCut = () => {
    setSliceProgress(1);
    if (onCut) onCut();
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className="relative select-none cursor-crosshair inline-block p-4 touch-none"
    >
      {/* Knife Slice Line Overlay */}
      {cutLine && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
          <line
            x1={cutLine.x1}
            y1={cutLine.y1}
            x2={cutLine.x2}
            y2={cutLine.y2}
            stroke="#EC4899"
            strokeWidth="5"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          <circle cx={cutLine.x2} cy={cutLine.y2} r="8" fill="#F43F5E" />
        </svg>
      )}

      {/* Main Cake SVG */}
      <div className={`relative transition-all duration-700 ${isCut ? 'scale-105' : ''}`}>
        <svg
          width="260"
          height="240"
          viewBox="0 0 260 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Cake Stand Plate */}
          <ellipse cx="130" cy="210" rx="110" ry="20" fill="#E2E8F0" />
          <ellipse cx="130" cy="206" rx="100" ry="16" fill="#FFF" />

          {/* LEFT HALF OF CAKE */}
          <g
            style={{
              transform: isCut ? 'translateX(-12px) rotate(-3deg)' : 'none',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Bottom Layer Left */}
            <path d="M30 140 C30 140 30 190 130 190 V140 Z" fill="#F472B6" />
            <path d="M30 165 C30 165 30 190 130 190 V165 Z" fill="#DB2777" opacity="0.4" />
            {/* Middle Frosting Cream */}
            <path d="M30 140 Q80 150 130 140 V130 Q80 140 30 130 Z" fill="#FFF" />
            {/* Top Layer Left */}
            <path d="M40 90 C40 90 40 130 130 130 V90 Z" fill="#FB7185" />

            {/* Frosting Drips Left */}
            <path
              d="M40 90 Q50 108 60 90 Q70 110 80 90 Q90 105 100 90 Q110 112 120 90 Q125 100 130 90 V80 Q85 80 40 80 Z"
              fill="#FFF"
            />
            {/* Strawberries Left */}
            <circle cx="65" cy="75" r="10" fill="#E11D48" />
            <circle cx="105" cy="75" r="10" fill="#E11D48" />
          </g>

          {/* RIGHT HALF OF CAKE */}
          <g
            style={{
              transform: isCut ? 'translateX(12px) rotate(3deg)' : 'none',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Bottom Layer Right */}
            <path d="M130 140 V190 C230 190 230 140 230 140 Z" fill="#F472B6" />
            <path d="M130 165 V190 C230 190 230 165 230 165 Z" fill="#DB2777" opacity="0.4" />
            {/* Middle Frosting Cream */}
            <path d="M130 140 V130 Q180 140 230 130 V140 Q180 150 130 140 Z" fill="#FFF" />
            {/* Top Layer Right */}
            <path d="M130 90 V130 C220 130 220 90 220 90 Z" fill="#FB7185" />

            {/* Frosting Drips Right */}
            <path
              d="M130 90 Q140 108 150 90 Q160 110 170 90 Q180 105 190 90 Q200 112 210 90 Q215 100 220 90 V80 Q175 80 130 80 Z"
              fill="#FFF"
            />
            {/* Strawberries Right */}
            <circle cx="155" cy="75" r="10" fill="#E11D48" />
            <circle cx="195" cy="75" r="10" fill="#E11D48" />
          </g>

          {/* CANDLE & FLAME (Center) */}
          <g className="z-20">
            {/* Candle Stick */}
            <rect x="124" y="35" width="12" height="45" rx="3" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
            {/* Candle Stripes */}
            <line x1="124" y1="45" x2="136" y2="48" stroke="#F43F5E" strokeWidth="3" />
            <line x1="124" y1="58" x2="136" y2="61" stroke="#F43F5E" strokeWidth="3" />

            {/* Wick */}
            <line x1="130" y1="35" x2="130" y2="28" stroke="#475569" strokeWidth="2" />

            {/* FLAME */}
            {!isCut ? (
              <g className="animate-pulse">
                {/* Flame Outer Glow */}
                <circle cx="130" cy="20" r="14" fill="#FDE047" opacity="0.4" />
                {/* Flame Body */}
                <path
                  d="M130 8 C124 16 122 22 130 27 C138 22 136 16 130 8 Z"
                  fill="#F97316"
                />
                <path
                  d="M130 12 C126 18 125 22 130 25 C135 22 134 18 130 12 Z"
                  fill="#FEF08A"
                />
              </g>
            ) : (
              /* Smoke trail after candle blown/cut */
              <path
                d="M130 25 Q125 15 132 5 Q128 -5 130 -15"
                stroke="#94A3B8"
                strokeWidth="2"
                fill="none"
                className="animate-fade-out"
              />
            )}
          </g>
        </svg>

        {/* Slice Flash Light effect when cut */}
        {isCut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1 h-48 bg-white shadow-[0_0_25px_10px_rgba(244,114,182,0.8)] animate-ping" />
          </div>
        )}
      </div>
    </div>
  );
}
