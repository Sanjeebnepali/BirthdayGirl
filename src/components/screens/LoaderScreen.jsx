import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HelloKitty from '../HelloKitty';
import { sound } from '../../utils/sound';

export default function LoaderScreen({ onDone }) {
  const [phase, setPhase] = useState('countdown'); // 'countdown' | 'image'
  const [count, setCount] = useState(3);

  useEffect(() => {
    sound.playCountBeep(count);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase('image');
          setTimeout(() => {
            if (onDone) onDone();
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <AnimatePresence mode="wait">
        {phase === 'countdown' && (
          <motion.div
            key={`count-${count}`}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 4 }}
            transition={{ duration: 0.5 }}
            className="text-[110px] md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 drop-shadow-md font-['Itim',_cursive]"
          >
            {count}
          </motion.div>
        )}

        {phase === 'image' && (
          <motion.div
            key="image"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center text-center space-y-5"
          >
            {/* Hello Kitty GIF inside white card with pink border (matching reference) */}
            <HelloKitty variant="airplane" size={180} card={true} />

            <h2
              className="text-xl md:text-2xl font-bold text-pink-500 font-['Itim',_cursive] tracking-wide"
              style={{
                animation: 'pulse-opacity 2s ease-in-out infinite',
              }}
            >
              Loading your birthday surprise... 💖 🎀 ✈️
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse opacity animation for loading text */}
      <style>{`
        @keyframes pulse-opacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
