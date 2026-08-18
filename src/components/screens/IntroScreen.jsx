import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Crown, Stars } from 'lucide-react';
import HelloKitty from '../HelloKitty';
import GradientButton from '../GradientButton';
import { sound } from '../../utils/sound';
import { TRANSPARENT_CUTOUTS } from '../../utils/photosData';

export default function IntroScreen({ name = 'My Oni', age = '19', onStart }) {
  const handleClick = () => {
    sound.playPop();
    sound.startBgMusic();
    if (onStart) onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center text-center space-y-6 max-w-lg mx-auto p-4 relative w-full"
    >
      {/* Top Floating Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/20 to-purple-500/10 border border-pink-300/50 backdrop-blur-md text-pink-600 font-bold text-xs md:text-sm shadow-sm font-['Itim',_cursive]"
      >
        <Crown className="w-4 h-4 text-amber-500 animate-bounce" />
        <span>Birthday Celebration Special ✨</span>
        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
      </motion.div>

      {/* Hero Showcase Frame with Transparent Cutout & Hello Kitty */}
      <div className="relative w-full max-w-sm flex items-center justify-center py-4">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-300/40 via-purple-300/30 to-amber-300/40 rounded-full blur-2xl opacity-70 animate-pulse" />

        {/* Combined Transparent Portrait & Mascot Stage */}
        <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4">
          {/* Transparent BG Cutout 1 - Birthday Girl with Sunglasses */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="relative group cursor-pointer"
          >
            <div className="w-36 h-48 md:w-44 md:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-gradient-to-b from-pink-100/60 to-purple-100/60 backdrop-blur-sm relative">
              <img
                src={TRANSPARENT_CUTOUTS.sunglasses}
                alt="Birthday Girl Cutout"
                className="w-full h-full object-cover object-top drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md rounded-xl py-1 px-2 text-[11px] font-bold text-pink-600 shadow-md border border-pink-100 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 fill-pink-500 text-pink-500 animate-pulse" />
                <span>The Birthday Queen 💖</span>
              </div>
            </div>

            {/* Sparkle sticker overlay */}
            <div className="absolute -top-3 -left-3 bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md rotate-[-12deg] flex items-center gap-0.5">
              <Stars className="w-3 h-3" />
              <span>STAR</span>
            </div>
          </motion.div>

          {/* Hello Kitty Mascot alongside */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            <HelloKitty variant="standing" size={140} card={true} />
          </motion.div>
        </div>
      </div>

      {/* Main Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="space-y-3 px-2"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 font-['Itim',_cursive] leading-tight drop-shadow-sm">
          Happy Birthday, <span className="text-rose-500 underline decoration-pink-300 decoration-wavy">{name}</span>! 🎉 🎂
        </h1>

        {/* "My Oni turns 19" Age Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: 'spring', stiffness: 180 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white font-extrabold text-base md:text-lg shadow-lg shadow-pink-500/30 font-['Itim',_cursive] border-2 border-white/40"
        >
          <Stars className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span>From today, {name} turns {age}!</span>
          <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
          <span>🎀</span>
        </motion.div>

        <p className="text-sm md:text-base font-semibold text-pink-600/90 font-['Itim',_cursive] max-w-md mx-auto leading-relaxed">
          Welcome to your personalized birthday magical experience! Handcrafted with sweet memories, interactive surprises, and endless love 💕 🎀
        </p>
      </motion.div>

      {/* Primary Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="pt-2"
      >
        <GradientButton onClick={handleClick} className="px-8 py-3.5 text-lg shadow-xl shadow-pink-500/25">
          <span className="flex items-center gap-2">
            <span>🎁 Start the Surprise</span>
            <Sparkles className="w-5 h-5 animate-spin-slow text-yellow-300" />
          </span>
        </GradientButton>
      </motion.div>
    </motion.div>
  );
}
