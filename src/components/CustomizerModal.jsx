import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/sound';

export default function CustomizerModal({
  isOpen,
  onClose,
  config,
  onSave,
}) {
  const [name, setName] = useState(config.name || 'My Oni');
  const [age, setAge] = useState(config.age || '20');
  const [message, setMessage] = useState(config.message || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playPop();
    onSave({ name, age, message });
    onClose();
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (age) params.set('age', age);
    if (message) params.set('msg', message);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const handleCopyLink = () => {
    sound.playPop();
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-pink-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2 mb-4 text-pink-600 font-bold text-xl">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span>Personalize Surprise</span>
          </div>

          <div className="space-y-4">
            {/* Friend's Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Friend's Name / Nickname
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Oni, Anjali, Bestie"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 20"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium"
              />
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Heartfelt Birthday Message
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your custom birthday wish here..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleSave}
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Save Changes</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Copied Shareable Link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-500" />
                    <span>Copy Shareable Link for Friend</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
