import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import BunnyCake from '../BunnyCake';
import GradientButton from '../GradientButton';
import { sound } from '../../utils/sound';
import { Sparkles, Heart } from 'lucide-react';

export default function CakeScreen({ name = 'My Oni', onNext }) {
  const [isCut, setIsCut] = useState(false);
  const [cutLine, setCutLine] = useState(null);
  const isDragging = useRef(false);

  const triggerCut = () => {
    if (isCut) return;
    setIsCut(true);
    sound.playCakeCut();

    // Trigger full screen celebratory confetti burst
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#EC4899', '#F472B6', '#FDE047', '#A855F7', '#60A5FA', '#F59E0B'],
    });
  };

  const handlePointerDown = (e) => {
    if (isCut) return;
    isDragging.current = true;
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;
    setCutLine({ x1: x, y1: y, x2: x, y2: y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || isCut) return;
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;
    setCutLine((prev) => (prev ? { ...prev, x2: x, y2: y } : null));

    if (cutLine) {
      const dx = x - cutLine.x1;
      const dy = y - cutLine.y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 70) {
        isDragging.current = false;
        triggerCut();
      }
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setTimeout(() => setCutLine(null), 300);
  };

  return (
    <div
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className="relative flex flex-col items-center justify-center min-h-[440px] w-full select-none cursor-crosshair touch-none p-4"
    >
      {/* Cut Trail Overlay */}
      {cutLine && (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-30">
          <line
            x1={cutLine.x1}
            y1={cutLine.y1}
            x2={cutLine.x2}
            y2={cutLine.y2}
            stroke="#EC4899"
            strokeWidth="6"
            strokeLinecap="round"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Header Text */}
      <div className="text-center mb-6 z-10 space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-pink-600 font-['Itim',_cursive] tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span>{isCut ? `Happy Birthday, ${name} ! 💕` : 'Swipe anywhere to cut the cake! 🎂'}</span>
          <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-bounce" />
        </h2>
        <p className="text-xs text-pink-500/80 font-['Itim',_cursive]">
          {isCut ? 'Wish granted! Now explore your photo gallery 🌸' : 'Make a wish and slice the cake ✨'}
        </p>
      </div>

      {/* Bunny Mascot with Cake */}
      <div className="relative flex items-center justify-center z-10 cursor-pointer">
        <div onClick={triggerCut}>
          <BunnyCake size={230} mood={isCut ? 'happy' : 'normal'} />
        </div>
      </div>

      {/* Next Button (Shown after cake is cut) */}
      {isCut && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-6 z-20"
        >
          <GradientButton
            onClick={() => {
              sound.playPop();
              if (onNext) onNext();
            }}
            className="px-8 py-3 text-base shadow-lg shadow-pink-500/25"
          >
            <span className="flex items-center gap-2">
              <span>View Photos ➔</span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
            </span>
          </GradientButton>
        </motion.div>
      )}
    </div>
  );
}
