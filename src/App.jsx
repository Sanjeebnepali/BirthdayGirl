import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Settings, Sparkles, Heart } from 'lucide-react';

import LoaderScreen from './components/screens/LoaderScreen';
import IntroScreen from './components/screens/IntroScreen';
import CakeScreen from './components/screens/CakeScreen';
import PhotosScreen from './components/screens/PhotosScreen';
import MessageScreen from './components/screens/MessageScreen';
import CustomizerModal from './components/CustomizerModal';

import { sound } from './utils/sound';

export default function App() {
  const [screen, setScreen] = useState('loader'); // 'loader' | 'intro' | 'cake' | 'photos' | 'message'
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const [config, setConfig] = useState({
    name: 'My Oni',
    age: '20',
    message: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get('name');
    const urlAge = params.get('age');
    const urlMsg = params.get('msg');

    if (urlName || urlAge || urlMsg) {
      setConfig({
        name: urlName || 'My Oni',
        age: urlAge || '20',
        message: urlMsg || '',
      });
    }
  }, []);

  const handleToggleMusic = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.startBgMusic();
    }
  };

  const navSteps = [
    { id: 'intro', label: 'Surprise' },
    { id: 'cake', label: 'Cake' },
    { id: 'photos', label: 'Timeline' },
    { id: 'message', label: 'Wish Video' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F9] via-[#FCE7F3] to-[#FBCFE8] text-gray-800 flex flex-col justify-between p-3 md:p-5 relative overflow-hidden select-none font-['Itim',_'Mali',_cursive]">
      {/* Background Decorative Hearts */}
      <div className="absolute top-10 left-10 text-pink-300/30 animate-pulse pointer-events-none">
        <Heart className="w-16 h-16 fill-pink-200" />
      </div>
      <div className="absolute bottom-12 right-10 text-rose-300/20 animate-bounce pointer-events-none">
        <Heart className="w-20 h-20 fill-rose-300" />
      </div>

      {/* Header Bar */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between p-2 z-30">
        {/* Navigation Step Pills (Visible after Loader) */}
        {screen !== 'loader' ? (
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md p-1 rounded-full shadow-sm border border-pink-200/60 text-xs font-bold font-['Itim',_cursive]">
            {navSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  sound.playPop();
                  setScreen(step.id);
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  screen === step.id
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-pink-600 hover:bg-pink-100/60'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-pink-500 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
            <span>Loading Experience...</span>
          </div>
        )}

        {/* Music & Customizer Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMusic}
            className="w-9 h-9 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
            title="Toggle Music"
          >
            <Music className={`w-4 h-4 ${!isMuted ? 'animate-bounce' : 'opacity-70'}`} />
          </button>

          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="w-9 h-9 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
            title="Customize & Share"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Screen Viewport */}
      <main className="w-full max-w-xl mx-auto my-auto z-20 flex flex-col items-center justify-center py-2">
        <AnimatePresence mode="wait">
          {screen === 'loader' && (
            <LoaderScreen key="loader" onDone={() => setScreen('intro')} />
          )}

          {screen === 'intro' && (
            <IntroScreen
              key="intro"
              name={config.name}
              age={config.age}
              onStart={() => setScreen('cake')}
            />
          )}

          {screen === 'cake' && (
            <CakeScreen
              key="cake"
              name={config.name}
              onNext={() => setScreen('photos')}
            />
          )}

          {screen === 'photos' && (
            <PhotosScreen key="photos" onNext={() => setScreen('message')} />
          )}

          {screen === 'message' && (
            <MessageScreen
              key="message"
              name={config.name}
              message={config.message}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="w-full text-center py-2 text-[11px] md:text-xs text-pink-400 font-sans z-10 font-medium">
        Made with ❤️ for {config.name}’s Birthday
      </footer>

      {/* Personalizer Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSave={(newCfg) => setConfig({ ...config, ...newCfg })}
      />
    </div>
  );
}
