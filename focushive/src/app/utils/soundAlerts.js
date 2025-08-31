class SoundAlert {
  constructor() {
    this.audioContext = null;
    this.isSupported = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  }

  async initAudioContext() {
    if (!this.isSupported) return false;
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    return true;
  }

  async playModeAlert(mode) {
    if (!await this.initAudioContext()) return;

    const soundConfig = this.getSoundConfigForMode(mode);
    await this.playSound(soundConfig);
  }

  getSoundConfigForMode(mode) {
    switch (mode) {
      case 'focus':
        return {
          frequency: 800,
          duration: 500,
          type: 'sine',
          volume: 0.3
        };
      case 'shortBreak':
        return {
          frequency: 600,
          duration: 300,
          type: 'triangle',
          volume: 0.2
        };
      case 'longBreak':
        return {
          frequency: 400,
          duration: 800,
          type: 'square',
          volume: 0.25
        };
      default:
        return {
          frequency: 800,
          duration: 500,
          type: 'sine',
          volume: 0.3
        };
    }
  }

  async playSound({ frequency, duration, type, volume }) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }
}

export const soundAlert = new SoundAlert();