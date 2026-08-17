// Web Audio API Sound Synthesizer for Birthday App
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgMusicNode = null;
    this.isPlayingBg = false;
    this.bgInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isPlayingBg) {
      this.stopBgMusic();
    }
    return this.isMuted;
  }

  // Play a simple synthesized note
  playNote(freq, type = 'sine', duration = 0.2, gainVal = 0.1, delay = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.error('Audio play note error:', e);
      }
    }, delay * 1000);
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

  // Start romantic ambient music loop (music box style tune: "Happy Birthday / Romantic Melody")
  startBgMusic() {
    if (this.isMuted || this.isPlayingBg) return;
    this.init();
    if (!this.ctx) return;

    this.isPlayingBg = true;

    // Melody notes (frequency, duration)
    const melody = [
      { f: 392.00, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 523.25, d: 0.8 }, { f: 493.88, d: 1.2 },
      { f: 392.00, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 587.33, d: 0.8 }, { f: 523.25, d: 1.2 },
      { f: 392.00, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 783.99, d: 0.8 }, { f: 659.25, d: 0.8 }, { f: 523.25, d: 0.8 }, { f: 493.88, d: 0.8 }, { f: 440.00, d: 0.8 },
      { f: 698.46, d: 0.4 }, { f: 698.46, d: 0.4 }, { f: 659.25, d: 0.8 }, { f: 523.25, d: 0.8 }, { f: 587.33, d: 0.8 }, { f: 523.25, d: 1.5 }
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.isPlayingBg || this.isMuted) return;
      const note = melody[noteIdx];
      this.playNote(note.f, 'sine', note.d * 0.9, 0.08);
      // Soft harmony chord
      this.playNote(note.f / 2, 'triangle', note.d * 0.9, 0.04);

      noteIdx = (noteIdx + 1) % melody.length;
      this.bgTimeout = setTimeout(playNextNote, note.d * 1000 * 1.1);
    };

    playNextNote();
  }

  stopBgMusic() {
    this.isPlayingBg = false;
    if (this.bgTimeout) {
      clearTimeout(this.bgTimeout);
      this.bgTimeout = null;
    }
  }
}

export const sound = new SoundEngine();
