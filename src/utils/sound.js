// Web Audio API Sound Synthesizer for Birthday App

// "Happy Birthday to You" melody (frequency in Hz, duration in seconds).
// G G A G C B / G G A G D C / G G G(8) E C B A / F F E C D C
const HAPPY_BIRTHDAY_MELODY = [
  { f: 392.00, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 523.25, d: 0.8 }, { f: 493.88, d: 1.2 },
  { f: 392.00, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 587.33, d: 0.8 }, { f: 523.25, d: 1.2 },
  { f: 392.00, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 783.99, d: 0.8 }, { f: 659.25, d: 0.8 }, { f: 523.25, d: 0.8 }, { f: 493.88, d: 0.8 }, { f: 440.00, d: 0.8 },
  { f: 698.46, d: 0.4 }, { f: 698.46, d: 0.4 }, { f: 659.25, d: 0.8 }, { f: 523.25, d: 0.8 }, { f: 587.33, d: 0.8 }, { f: 523.25, d: 1.5 },
];

// How far ahead (in seconds) to keep notes scheduled on the audio graph.
// Scheduling is done against the AudioContext's own precise clock rather
// than nested setTimeout calls, so once a batch is queued it plays back
// sample-accurately even if the watchdog timer below gets throttled by the
// browser (e.g. a backgrounded/locked phone) - it just catches up and
// re-fills the queue next time it runs, with no drift or restart glitch.
const BG_LOOKAHEAD_SECONDS = 2.0;
const BG_WATCHDOG_MS = 500;

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingBg = false;
    this.bgWatchdogId = null;
    this.bgNoteIndex = 0;
    this.bgNextNoteTime = 0;
    this.recoveryBound = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => { });
    }
    this.bindRecovery();
  }

  // Mobile browsers routinely suspend the AudioContext when the screen
  // locks, the tab is backgrounded, or a call/notification interrupts audio
  // - and on strict engines (iOS Safari especially) it can only be resumed
  // from inside a real user gesture, not from a timer callback. Without
  // this, the background music would silently go dead the first time that
  // happens and never come back on its own. This binds once and tries to
  // resume on the next real interaction or whenever the page becomes
  // visible again.
  bindRecovery() {
    if (this.recoveryBound) return;
    this.recoveryBound = true;

    const tryResume = () => {
      if (this.ctx && this.ctx.state !== 'running') {
        this.ctx.resume().catch(() => { });
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') tryResume();
    });
    ['pointerdown', 'touchstart', 'keydown'].forEach((evt) => {
      document.addEventListener(evt, tryResume, { passive: true });
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isPlayingBg) {
      this.stopBgMusic();
    }
    return this.isMuted;
  }

  // Play a single simple synthesized note, immediately (or after `delay`).
  // Used for one-off sound effects triggered directly by a user gesture.
  playNote(freq, type = 'sine', duration = 0.2, gainVal = 0.1, delay = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      if (!this.ctx) return;
      this.scheduleNoteAt(freq, this.ctx.currentTime, duration, gainVal, type);
    }, delay * 1000);
  }

  // Schedule one note directly on the audio graph at an exact AudioContext
  // time - this is what actually produces sample-accurate, drift-free
  // timing (both for one-off notes and for the background melody below).
  scheduleNoteAt(freq, startTime, duration, gainVal, type) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.error('Audio schedule error:', e);
    }
  }

  // Sound effect for Countdown step (3, 2, 1)
  playCountBeep(number) {
    const freqs = { 3: 523.25, 2: 659.25, 1: 783.99, 0: 1046.50 }; // C5, E5, G5, C6
    const freq = freqs[number] || 800;
    this.playNote(freq, 'triangle', 0.25, 0.2);
  }

  // Sound effect for button click
  playPop() {
    this.playNote(587.33, 'sine', 0.1, 0.15); // D5
    this.playNote(880, 'sine', 0.15, 0.1, 0.05); // A5
  }

  // Sound effect for cake cut
  playCakeCut() {
    // Swoosh + magic chimes
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      this.playNote(freq, 'sine', 0.3, 0.15, idx * 0.06);
    });
  }

  // Sound effect for confetti explosion
  playConfettiBurst() {
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      this.playNote(freq, 'triangle', 0.4, 0.15, idx * 0.05);
    });
  }

  // Start the looping "Happy Birthday to You" background music.
  startBgMusic() {
    if (this.isMuted || this.isPlayingBg) return;
    this.init();
    if (!this.ctx) return;

    this.isPlayingBg = true;
    this.bgNoteIndex = 0;
    this.bgNextNoteTime = this.ctx.currentTime + 0.05;
    this.runBgWatchdog();
  }

  // Keeps roughly BG_LOOKAHEAD_SECONDS of notes queued on the audio graph at
  // all times, re-checking every BG_WATCHDOG_MS. If this watchdog itself
  // gets throttled while the tab is backgrounded, playback doesn't glitch -
  // it just resumes filling the queue from wherever it left off next time
  // it's allowed to run.
  runBgWatchdog() {
    if (!this.isPlayingBg || this.isMuted || !this.ctx) return;

    if (this.ctx.state === 'running') {
      while (this.bgNextNoteTime < this.ctx.currentTime + BG_LOOKAHEAD_SECONDS) {
        const note = HAPPY_BIRTHDAY_MELODY[this.bgNoteIndex];
        this.scheduleNoteAt(note.f, this.bgNextNoteTime, note.d * 0.9, 0.08, 'sine');
        this.scheduleNoteAt(note.f / 2, this.bgNextNoteTime, note.d * 0.9, 0.04, 'triangle'); // soft harmony
        this.bgNextNoteTime += note.d * 1.1;
        this.bgNoteIndex = (this.bgNoteIndex + 1) % HAPPY_BIRTHDAY_MELODY.length;
      }
    } else {
      // Context is suspended (backgrounded/locked) - nothing to schedule
      // right now. bindRecovery() will resume it on the next real
      // interaction or when the page becomes visible again, and this
      // watchdog will pick back up and re-fill the queue from here.
      this.ctx.resume().catch(() => { });
    }

    this.bgWatchdogId = setTimeout(() => this.runBgWatchdog(), BG_WATCHDOG_MS);
  }

  stopBgMusic() {
    this.isPlayingBg = false;
    if (this.bgWatchdogId) {
      clearTimeout(this.bgWatchdogId);
      this.bgWatchdogId = null;
    }
  }
}

export const sound = new SoundEngine();
