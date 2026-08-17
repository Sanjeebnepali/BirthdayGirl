import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Sparkles, Maximize2, X, Calendar, Layers, Clock, Award, Video } from 'lucide-react';
import { sound } from '../utils/sound';
import { CHRONOLOGICAL_PHOTOS } from '../utils/photosData';

export default function PhotoGallery({ photos = CHRONOLOGICAL_PHOTOS, onNext }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'stack' | 'grid'
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentPhoto = photos[currentIndex] || photos[0];
  const isLastPhoto = currentIndex === photos.length - 1;

  const handlePrev = () => {
    sound.playPop();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    sound.playPop();
    if (isLastPhoto) {
      // Reached the end of photo scroll -> Auto-start video screen!
      if (onNext) onNext();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 35) {
      // Swiped Left -> Next Photo / Auto Start Video if last
      handleNext();
    } else if (diff < -35) {
      // Swiped Right -> Prev Photo
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-2 sm:p-4 space-y-4">
      {/* Title & Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-pink-600 font-extrabold text-2xl font-['Itim',_cursive] tracking-wide">
          <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span>Sweet Moments & Memories</span>
          <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-bounce" />
        </div>
        <p className="text-xs text-pink-500/80 font-['Itim',_cursive]">
          Swipe or tap photos to view each memory ✨ 🌸
        </p>
      </div>

      {/* View Mode Selector Tabs */}
      <div className="flex items-center justify-center p-1 bg-pink-100/70 backdrop-blur-md rounded-full shadow-inner border border-pink-200 gap-1 text-xs font-bold font-['Itim',_cursive]">
        <button
          onClick={() => {
            sound.playPop();
            setViewMode('timeline');
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
            viewMode === 'timeline'
              ? 'bg-pink-500 text-white shadow-md'
              : 'text-pink-600 hover:bg-pink-200/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Memory View</span>
        </button>

        <button
          onClick={() => {
            sound.playPop();
            setViewMode('stack');
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
            viewMode === 'stack'
              ? 'bg-pink-500 text-white shadow-md'
              : 'text-pink-600 hover:bg-pink-200/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Polaroid Stack</span>
        </button>

        <button
          onClick={() => {
            sound.playPop();
            setViewMode('grid');
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all cursor-pointer ${
            viewMode === 'grid'
              ? 'bg-pink-500 text-white shadow-md'
              : 'text-pink-600 hover:bg-pink-200/50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Grid Gallery</span>
        </button>
      </div>

      {/* VIEW 1: MAIN SWIPEABLE PHOTO CARD */}
      {viewMode === 'timeline' && (
        <div className="w-full flex flex-col items-center space-y-3">
          {/* Horizontal Memory Tags Bar */}
          <div className="w-full overflow-x-auto pb-1 scrollbar-none flex items-center justify-start md:justify-center gap-1.5 px-1">
            {photos.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  sound.playPop();
                  setCurrentIndex(idx);
                }}
                className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  idx === currentIndex
                    ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-105'
                    : 'bg-white/80 text-pink-600 border-pink-200 hover:bg-pink-50'
                }`}
              >
                <Award className="w-3 h-3" />
                <span>{item.ageTag}</span>
              </button>
            ))}
          </div>

          {/* Main Polaroid Frame Card with Click & Mobile Touch Swipe to Change */}
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.25 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleNext}
            className="relative w-full max-w-sm bg-white rounded-3xl p-3 shadow-xl border-3 border-pink-200/80 flex flex-col items-center justify-between overflow-hidden group cursor-pointer"
          >
            {/* Tag Top Left */}
            <div className="absolute top-5 left-5 z-20 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-md text-xs font-bold flex items-center gap-1 font-['Itim',_cursive]">
              <Clock className="w-3 h-3" />
              <span>{currentPhoto.ageTag}</span>
            </div>

            {/* Expand / Lightbox Button Top Right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxPhoto(currentPhoto);
              }}
              className="absolute top-5 right-5 z-20 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md text-pink-600 hover:bg-pink-50 transition-all cursor-pointer"
              title="View Full High Quality Photo"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Photo Container */}
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative shadow-inner mt-7 bg-pink-50">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />

              {/* Swipe instruction or End of scroll indicator */}
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                {isLastPhoto ? (
                  <>
                    <span>Tap/Swipe for Wish Video 🎬</span>
                    <Video className="w-3 h-3 text-yellow-300 animate-pulse" />
                  </>
                ) : (
                  <span>👈 Tap or Swipe for next photo 👉</span>
                )}
              </div>
            </div>

            {/* Polaroid Captions & Story */}
            <div className="w-full text-center pt-2 pb-0.5 flex flex-col items-center">
              <h3 className="text-lg font-extrabold text-pink-600 font-['Itim',_cursive] tracking-wide">
                {currentPhoto.title}
              </h3>
              <p className="text-xs font-semibold text-rose-500 mt-0.5 font-['Itim',_cursive]">
                {currentPhoto.subtitle}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 max-w-xs font-sans italic">
                "{currentPhoto.description}"
              </p>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full max-w-sm px-2 pt-0.5">
            <button
              onClick={handlePrev}
              className="p-2.5 bg-white text-pink-600 rounded-full shadow-md hover:bg-pink-50 active:scale-95 transition-all border border-pink-200 cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playPop();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'w-5 bg-pink-500' : 'w-2 bg-pink-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 active:scale-95 transition-all border border-pink-500 cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: 3D POLAROID CARD STACK */}
      {viewMode === 'stack' && (
        <div className="w-full flex flex-col items-center py-2">
          <p className="text-xs text-pink-500 font-bold mb-3 font-['Itim',_cursive]">
            👇 Tap or swipe card to cycle through memories!
          </p>

          <div
            onClick={handleNext}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-60 h-80 cursor-pointer select-none flex items-center justify-center"
          >
            <AnimatePresence>
              {photos.map((photo, index) => {
                const relativeIndex = (index - currentIndex + photos.length) % photos.length;
                if (relativeIndex > 3) return null;

                return (
                  <motion.div
                    key={photo.id}
                    initial={{ scale: 0.8, y: 20, opacity: 0 }}
                    animate={{
                      scale: 1 - relativeIndex * 0.05,
                      y: relativeIndex * 8,
                      rotate: relativeIndex === 0 ? 0 : relativeIndex % 2 === 0 ? 4 : -4,
                      opacity: 1 - relativeIndex * 0.18,
                      zIndex: photos.length - relativeIndex,
                    }}
                    exit={{ scale: 0.5, x: 200, opacity: 0, rotate: 15 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute inset-0 bg-white rounded-3xl p-3 shadow-xl border-3 border-pink-100 flex flex-col items-center justify-between"
                  >
                    <div className="w-full h-[78%] rounded-2xl overflow-hidden relative shadow-inner bg-pink-50">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        {photo.ageTag}
                      </div>
                    </div>
                    <div className="w-full text-center py-1">
                      <h4 className="text-xs font-extrabold text-pink-600 font-['Itim',_cursive] truncate">
                        {photo.title}
                      </h4>
                      <p className="text-[10px] text-pink-400 font-['Itim',_cursive] truncate">
                        {photo.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* VIEW 3: GRID GALLERY */}
      {viewMode === 'grid' && (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-1 max-w-sm">
          {photos.map((item, idx) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setLightboxPhoto(item)}
              className="bg-white rounded-2xl p-1.5 shadow-sm border border-pink-200 flex flex-col items-center cursor-pointer group"
            >
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-pink-50 relative">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1 left-1 bg-pink-500/90 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                  {item.ageTag}
                </div>
              </div>
              <p className="text-[11px] font-bold text-pink-600 font-['Itim',_cursive] mt-1 truncate w-full text-center">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-white rounded-3xl p-4 shadow-2xl flex flex-col items-center"
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 bg-pink-100 hover:bg-pink-200 text-pink-600 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full aspect-[3/4] max-h-[55vh] rounded-2xl overflow-hidden bg-pink-50 shadow-inner relative mt-2">
                <img
                  src={lightboxPhoto.url}
                  alt={lightboxPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full text-center mt-3 space-y-1">
                <span className="inline-block px-2.5 py-0.5 bg-pink-100 text-pink-600 font-bold text-xs rounded-full font-['Itim',_cursive]">
                  {lightboxPhoto.ageTag}
                </span>
                <h3 className="text-xl font-extrabold text-gray-800 font-['Itim',_cursive]">
                  {lightboxPhoto.title}
                </h3>
                <p className="text-xs font-semibold text-pink-500 font-['Itim',_cursive]">
                  {lightboxPhoto.subtitle}
                </p>
                <p className="text-xs text-gray-600 italic font-sans max-w-xs mx-auto">
                  "{lightboxPhoto.description}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Action Button */}
      {onNext && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sound.playPop();
            onNext();
          }}
          className="mt-3 px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white rounded-full font-extrabold text-sm shadow-lg shadow-pink-500/30 flex items-center gap-2 hover:brightness-105 transition-all cursor-pointer font-['Itim',_cursive]"
        >
          <span>✉️ Open Special Message Video</span>
          <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
        </motion.button>
      )}
    </div>
  );
}
