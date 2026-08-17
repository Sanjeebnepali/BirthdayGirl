import React from 'react';
import { motion } from 'framer-motion';

export default function GradientButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-['Itim',_cursive] font-bold text-base rounded-full shadow-md shadow-pink-300/40 transition-all flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      {children}
    </motion.button>
  );
}
