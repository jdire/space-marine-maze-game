// 8-bit style sci-fi audio system
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.masterVolume = 0.3;
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context initialized:', this.audioContext.state);
        } catch (e) {
            console.error('Web Audio API not supported:', e);
            return;
        }
    }

    // Create 8-bit style oscillator
    createOscillator(frequency, type = 'square', duration = 0.1) {
        if (!this.audioContext) return null;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Envelope for 8-bit sound
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.5, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
        
        return { oscillator, gainNode };
    }

    // Play sci-fi background music loop
    playBackgroundMusic() {
        if (!this.audioContext || this.isPlaying) return;
        
        this.isPlaying = true;
        this.playMusicLoop();
    }

    playMusicLoop() {
        if (!this.isPlaying) return;

        const currentTime = this.audioContext.currentTime;
        const beatDuration = 0.4; // 150 BPM
        
        // Sci-fi melody pattern (C minor pentatonic scale)
        const melody = [
            261.63, 311.13, 369.99, 466.16, 523.25, // C4, Eb4, F#4, Bb4, C5
            392.00, 311.13, 261.63, 392.00, 466.16  // G4, Eb4, C4, G4, Bb4
        ];
        
        // Bass line (lower octave)
        const bass = [
            130.81, 155.56, 184.99, 233.08, 130.81, // C3, Eb3, F#3, Bb3, C3
            196.00, 155.56, 130.81, 196.00, 233.08  // G3, Eb3, C3, G3, Bb3
        ];

        // Play melody notes
        for (let i = 0; i < melody.length; i++) {
            const noteTime = currentTime + (i * beatDuration);
            
            // Melody (square wave)
            const melodyOsc = this.audioContext.createOscillator();
            const melodyGain = this.audioContext.createGain();
            
            melodyOsc.type = 'square';
            melodyOsc.frequency.setValueAtTime(melody[i], noteTime);
            
            melodyOsc.connect(melodyGain);
            melodyGain.connect(this.audioContext.destination);
            
            melodyGain.gain.setValueAtTime(0, noteTime);
            melodyGain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, noteTime + 0.01);
            melodyGain.gain.exponentialRampToValueAtTime(0.01, noteTime + beatDuration * 0.8);
            
            melodyOsc.start(noteTime);
            melodyOsc.stop(noteTime + beatDuration * 0.8);
            
            // Bass line (sawtooth wave)
            const bassOsc = this.audioContext.createOscillator();
            const bassGain = this.audioContext.createGain();
            
            bassOsc.type = 'sawtooth';
            bassOsc.frequency.setValueAtTime(bass[i], noteTime);
            
            bassOsc.connect(bassGain);
            bassGain.connect(this.audioContext.destination);
            
            bassGain.gain.setValueAtTime(0, noteTime);
            bassGain.gain.linearRampToValueAtTime(this.masterVolume * 0.2, noteTime + 0.01);
            bassGain.gain.exponentialRampToValueAtTime(0.01, noteTime + beatDuration * 0.9);
            
            bassOsc.start(noteTime);
            bassOsc.stop(noteTime + beatDuration * 0.9);
        }

        // Add some arpeggiated chords for atmosphere
        const chordNotes = [261.63, 311.13, 369.99]; // C, Eb, F#
        for (let i = 0; i < 8; i++) {
            const chordTime = currentTime + (i * beatDuration / 2);
            const noteIndex = i % chordNotes.length;
            
            const chordOsc = this.audioContext.createOscillator();
            const chordGain = this.audioContext.createGain();
            
            chordOsc.type = 'triangle';
            chordOsc.frequency.setValueAtTime(chordNotes[noteIndex] * 2, chordTime);
            
            chordOsc.connect(chordGain);
            chordGain.connect(this.audioContext.destination);
            
            chordGain.gain.setValueAtTime(0, chordTime);
            chordGain.gain.linearRampToValueAtTime(this.masterVolume * 0.1, chordTime + 0.01);
            chordGain.gain.exponentialRampToValueAtTime(0.01, chordTime + beatDuration / 3);
            
            chordOsc.start(chordTime);
            chordOsc.stop(chordTime + beatDuration / 3);
        }

        // Schedule next loop
        setTimeout(() => {
            if (this.isPlaying) {
                this.playMusicLoop();
            }
        }, melody.length * beatDuration * 1000);
    }

    stopBackgroundMusic() {
        this.isPlaying = false;
    }

    // Sound effects
    playMoveSound() {
        if (!this.audioContext) return;
        
        const frequencies = [400, 450, 500];
        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
        this.createOscillator(freq, 'square', 0.05);
    }

    playLevelCompleteSound() {
        if (!this.audioContext) return;
        
        const currentTime = this.audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        for (let i = 0; i < notes.length; i++) {
            setTimeout(() => {
                this.createOscillator(notes[i], 'square', 0.3);
            }, i * 100);
        }
    }

    playGameStartSound() {
        if (!this.audioContext) return;
        
        // Ascending sci-fi startup sound
        const startFreq = 200;
        const endFreq = 800;
        const duration = 1.0;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        console.log('Audio system volume set to:', this.masterVolume);
    }

    // Resume audio context (required for autoplay policies)
    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}