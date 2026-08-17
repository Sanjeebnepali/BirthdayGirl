import React from 'react';

export default function Mascot({ mood = 'happy', size = 160 }) {
  return (
    <div className="relative inline-block animate-bounce-slow hover:scale-105 transition-transform duration-300">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Soft Shadow */}
        <ellipse cx="100" cy="185" rx="55" ry="10" fill="#FBCFE8" opacity="0.6" />

        {/* Bunny Left Ear */}
        <path
          d="M70 75C60 20 40 25 55 75"
          fill="#FFF"
          stroke="#F472B6"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="M66 65C60 30 48 33 58 65" fill="#FCE7F3" />

        {/* Bunny Right Ear */}
        <path
          d="M130 75C140 20 160 25 145 75"
          fill="#FFF"
          stroke="#F472B6"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="M134 65C140 30 152 33 142 65" fill="#FCE7F3" />

        {/* Main Head */}
        <circle cx="100" cy="115" r="55" fill="#FFF" stroke="#F472B6" strokeWidth="6" />

        {/* Cheeks */}
        <ellipse cx="68" cy="125" rx="10" ry="6" fill="#F472B6" opacity="0.6" />
        <ellipse cx="132" cy="125" rx="10" ry="6" fill="#F472B6" opacity="0.6" />

        {/* Eyes */}
        {mood === 'happy' ? (
          <>
            <path
              d="M78 112C82 106 88 106 90 112"
              stroke="#4B5563"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M110 112C112 106 118 106 122 112"
              stroke="#4B5563"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="82" cy="110" r="5" fill="#4B5563" />
            <circle cx="118" cy="110" r="5" fill="#4B5563" />
          </>
        )}

        {/* Nose & Mouth */}
        <polygon points="97,118 103,118 100,122" fill="#F472B6" />
        <path
          d="M94 125C97 128 100 128 100 125C100 128 103 128 106 125"
          stroke="#4B5563"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Red Bow/Heart on Ear */}
        <path
          d="M50 72C45 68 38 72 44 80L50 85L56 80C62 72 55 68 50 72Z"
          fill="#EC4899"
        />

        {/* Sparkles */}
        <path
          d="M150 60L153 66L159 69L153 72L150 78L147 72L141 69L147 66Z"
          fill="#F59E0B"
          className="animate-pulse"
        />
        <path
          d="M40 100L42 104L46 106L42 108L40 112L38 108L34 106L38 104Z"
          fill="#F59E0B"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}
