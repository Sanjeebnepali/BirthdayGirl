import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Volume2, VolumeX, Crown, Stars, MailOpen, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/sound';
const messageVideo = `${import.meta.env.BASE_URL}message-video.mp4`;
import { TRANSPARENT_CUTOUTS } from '../../utils/photosData';

// --- Measured timing for videoplayback (2).mp4 (66s total) ---
// 0s -> ~60.0s   : black background, gold "quote" text intro (nothing to key)
// ~60.0s -> ~64.7s : hard cut to solid GREEN background with "Happy Birthday" text
//                    this is the only real chroma-key segment
// ~64.7s -> 66.0s : green fades to black (too dim/desaturated to key cleanly,
//                    this is what caused the leftover "green flash")
// If the video file is ever replaced, re-measure these with ffprobe / frame
// extraction and update the two constants below.
const GREEN_SEGMENT_START = 60.1; // when the photo backdrop should start fading in behind the keyed text
const GREEN_SEGMENT_SAFE_END = 64.3; // cut to the end scene here, safely before the un-keyable fade begins
const PHOTO_FADE_IN_SECONDS = 0.9; // how long the photo takes to ease in, so it feels natural instead of popping in
const CANVAS_FADE_OUT_MS = 320; // how long the video stage takes to ease out into the letter, so the cut to GREEN_SEGMENT_SAFE_END reads as a smooth ending instead of a jump-cut
const MIN_REAL_SECONDS_BEFORE_NATURAL_END = GREEN_SEGMENT_SAFE_END - 3; // some mobile in-app browsers (WhatsApp/Instagram/Messenger webviews especially) misreport video.currentTime - or fire `ended` outright - within the first second of playback, which was cutting the video after ~1s instead of near its real ending. Natural-end triggers are ignored until roughly this much real time has actually elapsed since playback started.

// High Precision Green Screen Removal (Keying out green hue range)
function isGreenPixel(r, g, b) {
  // 1. Direct RGB green dominance
  if (g > 40 && g > r * 0.92 && g > b * 0.92 && (g - r > 6 || g - b > 6)) return true;

  // 2. Hue Calculation for all green shades (50° to 180°)
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return false;

  let hue = 0;
  if (max === g) {
    hue = 60 * ((b - r) / delta + 2);
  }
  if (hue < 0) hue += 360;

  const sat = delta / max;
  return hue >= 50 && hue <= 180 && sat > 0.10 && g > 30;
}

export default function MessageScreen({ name = 'My Oni', message = '' }) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoAudioBlocked, setVideoAudioBlocked] = useState(false);
  const [videoPlayBlocked, setVideoPlayBlocked] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(true);
  const [showPhotoBackdrop, setShowPhotoBackdrop] = useState(false);

  const videoRef = useRef(null);
  // A plain useRef here would go stale on replay: the canvas lives inside the
  // {!videoEnded && ...} block, so it's fully unmounted/remounted by
  // AnimatePresence each time the video ends and replays. A state-backed ref
  // lets the chroma-key effect below (deps: [canvasEl]) notice the swap and
  // re-attach to the new DOM node - otherwise it keeps drawing into the old,
  // detached canvas while the freshly mounted one on screen stays blank.
  const [canvasEl, setCanvasEl] = useState(null);
  const animFrameId = useRef(null);
  const isEndingRef = useRef(false);
  const showPhotoBackdropRef = useRef(false);
  const playStartTimeRef = useRef(null);

  const defaultText =
    `Happy Birthday, My Friend! 🎉\n\nYou deserve all the happiness, love, and smiles in the world today and always. You have this special way of making everything around you brighter — your energy, your kindness, and your warm heart.\n\nYou've already worked so hard and done so much toward your dreams, and I hope your day is filled with joy, surprises, and moments that make your heart sing. You're truly one of a kind, and today we celebrate YOU! 👑💕\n\nI want you to never look back — always keep moving straight toward your dream until you reach it. I truly believe in you, and I know you have what it takes to reach the top of the mountain.\n\nWishing you endless laughter, success, and all the sweet things life has to offer! 🎂✨ I'll always be right here, cheering you on.\n\nWith Love, Your Friend 💕`;

  const letterText = message || defaultText;

  // Auto-stop background synthesizer music during video playback
  useEffect(() => {
    sound.stopBgMusic();
    isEndingRef.current = false;
    showPhotoBackdropRef.current = false;
    setCanvasVisible(true);
    setShowPhotoBackdrop(false);
    setVideoPlayBlocked(false);

    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      video
        .play()
        .then(() => {
          setVideoAudioBlocked(false);
        })
        .catch(() => {
          video.muted = true;
          setVideoAudioBlocked(true);
          video.play().catch(() => {
            // Even a muted, playsInline autoplay got blocked - happens in some
            // in-app browsers (Instagram/Messenger webviews) and with iOS's
            // "Never Auto-Play" Safari setting. Previously this silently
            // skipped straight to the letter with zero video shown, which is
            // what made it look like the video "barely played" on phones.
            // Give the user a real tap to start it instead - a direct tap is
            // always allowed to play video, no exceptions.
            setVideoPlayBlocked(true);
          });
        });
    }

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const triggerEnd = () => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    // 1. Ease the canvas out (via its own CSS opacity transition, see JSX)
    // instead of snapping it away, so hitting GREEN_SEGMENT_SAFE_END reads as
    // the video winding down rather than a jump-cut to the letter.
    setCanvasVisible(false);
    showPhotoBackdropRef.current = false;
    setShowPhotoBackdrop(false);

    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Trigger celebration confetti right away so it still feels tied to the moment
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#EC4899', '#F472B6', '#FDE047', '#A855F7', '#60A5FA', '#F59E0B'],
    });
    sound.playConfettiBurst();

    // Let the fade-out finish before clearing the frame and swapping in the
    // letter, so the two crossfade instead of flashing a blank card in between.
    setTimeout(() => {
      if (canvasEl) {
        const ctx = canvasEl.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      }
      setVideoEnded(true);
      setShowMessage(true);
    }, CANVAS_FADE_OUT_MS);
  };

  // Only allow the video to end "on its own" (native `ended` event, or our
  // own cutoff/ended checks in the frame loop below) once a plausible amount
  // of REAL wall-clock time has actually passed since playback started. This
  // guards against unreliable playback-position reporting in some mobile
  // in-app browsers (see MIN_REAL_SECONDS_BEFORE_NATURAL_END above) that was
  // ending the video after ~1s instead of near its real end. A manual skip
  // (the "Skip to Letter Reveal" button) or a total playback failure still
  // calls triggerEnd() directly - those are meant to end immediately.
  const triggerNaturalEnd = () => {
    const elapsedRealSeconds =
      playStartTimeRef.current === null
        ? Infinity // never recorded a start - don't get stuck forever, just allow it
        : (performance.now() - playStartTimeRef.current) / 1000;
    if (elapsedRealSeconds < MIN_REAL_SECONDS_BEFORE_NATURAL_END) return;
    triggerEnd();
  };

  // Real-time Chroma Keying
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasEl;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const processFrame = () => {
      if (isEndingRef.current) return;

      const currentTime = video.currentTime;

      // Cut to the end scene at a FIXED, measured timestamp (not video.duration,
      // which can be unreported/inaccurate on the very first play and is what
      // caused the green fade-out to slip through only sometimes). This lands
      // safely before the source video's un-keyable fade-to-black at ~64.7s.
      // Gated by triggerNaturalEnd() - see its comment - so an unreliable
      // early currentTime reading can't cut playback down to ~1s.
      if (currentTime >= GREEN_SEGMENT_SAFE_END) {
        triggerNaturalEnd();
        if (isEndingRef.current) return;
      }

      if (video.paused || video.ended) {
        if (video.ended) {
          triggerNaturalEnd();
          if (isEndingRef.current) return;
          // Guard held it back - keep polling every frame until enough real
          // time has passed, then it'll actually end.
          animFrameId.current = requestAnimationFrame(processFrame);
        }
        return;
      }

      // Reveal her photo (a full-card CSS layer behind the canvas, see JSX below)
      // exactly when the video cuts to its green "Happy Birthday" segment, so the
      // keyed-out text appears over her photo instead of the plain card background.
      const shouldShowPhoto = currentTime >= GREEN_SEGMENT_START;
      if (shouldShowPhoto !== showPhotoBackdropRef.current) {
        showPhotoBackdropRef.current = shouldShowPhoto;
        setShowPhotoBackdrop(shouldShowPhoto);
      }

      if (video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;
        const len = data.length;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Key out green background cleanly
          if (isGreenPixel(r, g, b)) {
            data[i + 3] = 0; // Transparent
          }
        }
        ctx.putImageData(frame, 0, 0);
      }

      animFrameId.current = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      playStartTimeRef.current = performance.now();
      animFrameId.current = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', handlePlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [canvasEl]);

  const handleReplay = () => {
    sound.playPop();
    sound.stopBgMusic();
    isEndingRef.current = false;
    showPhotoBackdropRef.current = false;
    setCanvasVisible(true);
    setShowPhotoBackdrop(false);
    setVideoEnded(false);
    setShowMessage(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => { });
    }
  };

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
    if (!newMuted) {
      setVideoAudioBlocked(false);
    }
  };

  const handleUnmuteVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => { });
    }
    setIsMuted(false);
    setVideoAudioBlocked(false);
  };

  // Fallback for when even muted autoplay was blocked (see the effect above).
  // This runs directly inside a click handler, so it's a real, direct user
  // gesture - every mobile browser and in-app webview allows video playback
  // started this way, with no autoplay-policy exceptions.
  const handleTapToPlay = () => {
    setVideoPlayBlocked(false);
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video
      .play()
      .then(() => setVideoAudioBlocked(false))
      .catch(() => {
        video.muted = true;
        setVideoAudioBlocked(true);
        video.play().catch(() => triggerEnd());
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-start max-w-md mx-auto p-2 sm:p-4 text-center space-y-3 w-full"
    >
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between px-2">
        <div className="w-8" />
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-pink-600 font-['Itim',_cursive] tracking-wide">
            Special Message Video
          </h2>
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-bounce" />
        </motion.div>

        {/* Video Sound Mute Button */}
        <button
          onClick={toggleSound}
          className="w-8 h-8 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
          title={isMuted ? 'Unmute Video' : 'Mute Video'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 opacity-80" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
        </button>
      </div>

      {/* Main Container Card */}
      <motion.div
        className="w-full relative overflow-hidden flex flex-col items-center justify-center"
        style={{
          borderRadius: '24px',
          border: '2.5px solid #F9A8D4',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF0F6 50%, #FCE7F3 100%)',
          boxShadow: '0 10px 30px rgba(244, 114, 182, 0.2)',
        }}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* HTML5 Video element - kept out of view but NOT display:none.
            display:none fully removes it from the render tree, and browsers
            frequently deprioritize/drop audio decoding for media elements that
            aren't actually rendered anywhere - which is what was silencing the
            video's audio even though the canvas kept drawing its frames fine. */}
        <video
          ref={videoRef}
          src={messageVideo}
          playsInline
          webkit-playsinline="true"
          onEnded={triggerNaturalEnd}
          aria-hidden="true"
          className="absolute w-px h-px opacity-0 pointer-events-none overflow-hidden -z-10"
        />

        {/* Clean Video Canvas Stage (NO BACKGROUND IMAGE BEHIND VIDEO DURING PLAYBACK) */}
        <AnimatePresence mode="wait">
          {!videoEnded && (
            <motion.div
              key="video-canvas-container"
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center justify-center p-3 relative"
            >
              {/* Mobile Tap to Start Overlay - shown when even muted autoplay was blocked */}
              {videoPlayBlocked && (
                <button
                  onClick={handleTapToPlay}
                  className="mb-2 px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-full shadow-lg animate-bounce flex items-center gap-1.5 cursor-pointer z-30 font-['Itim',_cursive]"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Tap to Play Video ▶</span>
                </button>
              )}

              {/* Mobile Tap to Enable Sound Overlay */}
              {!videoPlayBlocked && videoAudioBlocked && (
                <button
                  onClick={handleUnmuteVideo}
                  className="mb-2 px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-full shadow-lg animate-bounce flex items-center gap-1.5 cursor-pointer z-30 font-['Itim',_cursive]"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Tap for Video Sound 🔊</span>
                </button>
              )}

              {/* Pure Video Stage - Clean Container Without Background Image Overlap */}
              <div className="relative w-full aspect-[4/5] max-h-[60vh] rounded-2xl overflow-hidden shadow-md border-2 border-pink-200/80 bg-pink-50/60 flex items-center justify-center">
                {/* Her photo, sized to naturally cover this whole card - matches her
                    portrait photo's own shape far better than the video's own tiny
                    landscape frame (640x360) would, which is what was forcing an
                    ugly, zoomed-in crop on just her face. Revealed through the
                    canvas's keyed-out green during the video's "Happy Birthday"
                    segment; the opacity transition below eases it in/out smoothly. */}
                <img
                  src={TRANSPARENT_CUTOUTS.royal}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
                  style={{
                    opacity: showPhotoBackdrop ? 1 : 0,
                    zIndex: 5,
                    transition: `opacity ${PHOTO_FADE_IN_SECONDS}s ease-out`,
                  }}
                />
                {/* Soft scrim so the gold/pink script text stays readable over the photo */}
                <div
                  className="absolute inset-0 bg-black/20 pointer-events-none"
                  style={{
                    opacity: showPhotoBackdrop ? 1 : 0,
                    zIndex: 6,
                    transition: `opacity ${PHOTO_FADE_IN_SECONDS}s ease-out`,
                  }}
                />
                {/* Canvas rendering the video's own frames, green keyed to transparent */}
                <canvas
                  ref={setCanvasEl}
                  onClick={videoPlayBlocked ? handleTapToPlay : handleUnmuteVideo}
                  style={{
                    opacity: canvasVisible ? 1 : 0,
                    transition: `opacity ${CANVAS_FADE_OUT_MS}ms ease-out`,
                  }}
                  className="relative z-10 w-full h-full object-contain select-none cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* End Scene: Royal Birthday Queen Cutout Portrait & Wish Letter (Shown AFTER video finishes) */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              key="message-content"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="p-4 sm:p-6 w-full relative flex flex-col items-center space-y-3"
            >
              {/* Header Badge */}
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-pink-500 text-white px-3 py-1 rounded-full shadow-md text-xs font-extrabold font-['Itim',_cursive]">
                <Crown className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
                <span>HAPPY BIRTHDAY QUEEN 👑</span>
              </div>

              {/* End Scene Hero Cutout Frame */}
              <div className="relative w-full max-w-[200px] flex justify-center py-1">
                <div className="w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden shadow-xl border-3 border-white bg-gradient-to-b from-rose-100 via-pink-100 to-amber-50 relative group">
                  <img
                    src={TRANSPARENT_CUTOUTS.royal}
                    alt="Birthday Queen Royal Portrait"
                    className="w-full h-full object-cover object-top drop-shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-950/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md rounded-lg py-0.5 px-2 text-[11px] font-extrabold text-pink-600 shadow-md border border-pink-200 flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3 fill-pink-500 text-pink-500 animate-pulse" />
                    <span>{name} ✨</span>
                  </div>
                </div>
              </div>

              {/* Handwritten Letter Card */}
              <div className="w-full bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-inner border border-pink-200/80 relative text-left">
                <div className="absolute -top-2.5 right-3 bg-pink-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 font-['Itim',_cursive]">
                  <MailOpen className="w-3 h-3" />
                  <span>Special Letter</span>
                </div>

                <div className="relative z-10 text-pink-800 italic font-['Caveat',_cursive] text-base sm:text-lg leading-relaxed tracking-wide whitespace-pre-line">
                  {letterText}
                </div>
              </div>

              {/* Card Footer */}
              <div className="w-full pt-2 border-t border-pink-200/80 flex items-center justify-between text-pink-600 font-bold text-xs font-['Itim',_cursive]">
                <div className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                  <span>With Endless Love 💕</span>
                </div>

                <button
                  onClick={toggleSound}
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full transition-colors cursor-pointer text-[11px]"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3 h-3" />
                      <span>Sound Off</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      <span>Sound On</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        {!videoEnded && (
          <button
            onClick={triggerEnd}
            className="text-xs text-pink-500 hover:text-pink-700 font-bold font-['Itim',_cursive] transition-colors cursor-pointer underline flex items-center gap-1"
          >
            <span>Skip to Letter Reveal →</span>
          </button>
        )}

        {videoEnded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleReplay}
            className="px-4 py-1.5 bg-white text-pink-600 border-2 border-pink-200 rounded-full font-bold shadow-md hover:bg-pink-50 transition-all flex items-center gap-1.5 text-xs cursor-pointer font-['Itim',_cursive]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Video</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
