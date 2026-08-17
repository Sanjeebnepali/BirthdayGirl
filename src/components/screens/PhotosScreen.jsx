import React from 'react';
import { motion } from 'framer-motion';
import PhotoGallery from '../PhotoGallery';

export default function PhotosScreen({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center min-h-[460px]"
    >
      <PhotoGallery onNext={onNext} />
    </motion.div>
  );
}
