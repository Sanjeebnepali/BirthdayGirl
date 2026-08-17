import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Volume2, VolumeX, RotateCcw, Send } from 'lucide-react';
import { sound } from '../utils/sound';

export default function SpecialMessage({
  name = 'My Oni',
  message = '',
  onRestart,
  onOpenCustomizer,
}) {
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  const defaultMsg =
    `Happy Birthday, My Friend! 🎉 You deserve all the happiness, love, and smiles in the world today and always. You have this special way of making everything around you brighter — your energy, your kindness, and your warm heart. You've already worked so hard and done so much toward your dreams, and I hope your day is filled with joy, surprises, and moments that make your heart sing. You're truly one of a kind, and today we celebrate YOU! 👑💕 I want you to never look back — always keep moving straight toward your dream until you reach it. I truly believe in you, and I know you have what it takes to reach the top of the mountain. Wishing you endless laughter, success, and all the sweet things life has to offer! 🎂✨ I'll always be right here, cheering you on. With Love, Your Friend 💕`;

  const finalMessage = message || defaultMsg;

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.startBgMusic();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-lg mx-auto p-4 flex flex-col items-center"
    >
      {/* Card Header */}
      <div className="flex items-center gap-2 mb-4 text-rose-600 font-bold text-2xl tracking-wide">
        <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce" />
        <span>A Special Message</span>
        <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
      </div>

      {/* Main Letter Card */}
      <div className="relative w-full bg-gradient-to-b from-pink-50 via-rose-50 to-white rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-pink-200 backdrop-blur-md overflow-hidden">
        {/* Soft Background Glowing Circles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-rose-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Decorative Hearts Watermark */}
        <div className="absolute top-4 right-4 text-pink-200 pointer-events-none">
          <Heart className="w-12 h-12 fill-pink-100" />
        </div>

        {/* Message Content */}
        <div className="relative z-10 text-gray-800 leading-relaxed font-medium text-base whitespace-pre-line tracking-wide">
          {finalMessage}
        </div>

        {/* Signature */}
        <div className="mt-6 pt-4 border-t border-pink-200/80 flex items-center justify-between text-pink-600 font-semibold text-sm">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>With Lots of Love</span>
          </div>

          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-100/80 hover:bg-pink-200 text-pink-700 rounded-full transition-colors"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Music Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Music On</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sound.playPop();
            if (onRestart) onRestart();
          }}
          className="px-6 py-3 bg-white text-pink-600 border border-pink-200 rounded-full font-bold shadow-md hover:bg-pink-50 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay Surprise</span>
        </motion.button>

        {onOpenCustomizer && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              sound.playPop();
              onOpenCustomizer();
            }}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-600 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send to a Friend</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
