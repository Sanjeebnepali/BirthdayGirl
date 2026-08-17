import React, { useState } from 'react';

const GIFS = {
  standing: 'https://media1.tenor.com/m/mu5bMm7ZddAAAAAd/hello-kitty.gif',
  airplane: 'https://media1.tenor.com/m/MbSnTQ2GzUIAAAAd/hello-kitty-airplane.gif',
};

const FALLBACKS = {
  standing: '/kitty_standing.png',
  airplane: '/kitty_airplane.png',
};

export default function HelloKitty({ variant = 'standing', className = '', size = 160, card = true }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const gifSrc = GIFS[variant] || GIFS.standing;
  const fallbackSrc = FALLBACKS[variant] || FALLBACKS.standing;
  const src = useFallback ? fallbackSrc : gifSrc;
  const alt = variant === 'airplane' ? 'Hello Kitty Airplane GIF' : 'Hello Kitty Standing GIF';

  const imgSize = size ? { width: size, height: 'auto', maxWidth: '100%' } : {};

  // Card-style display: white rounded card with pink border (matches reference video)
  if (card) {
    return (
      <div
        className={`relative inline-flex items-center justify-center animate-bounce-slow ${className}`}
        style={{
          padding: '12px',
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '2.5px solid #F9A8D4',
          boxShadow: '0 4px 20px rgba(244, 114, 182, 0.15), 0 1px 6px rgba(0,0,0,0.04)',
        }}
      >
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            if (!useFallback) {
              setUseFallback(true);
            }
          }}
          style={{
            ...imgSize,
            display: 'block',
            objectFit: 'contain',
          }}
          className="select-none pointer-events-none"
        />
      </div>
    );
  }

  // No-card style: raw image with blend mode (legacy)
  return (
    <div className={`relative inline-block animate-bounce-slow ${className}`}>
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          if (!useFallback) {
            setUseFallback(true);
          }
        }}
        style={{ mixBlendMode: 'multiply', ...imgSize }}
        className="w-28 md:w-36 h-auto object-contain select-none pointer-events-none"
      />
    </div>
  );
}
