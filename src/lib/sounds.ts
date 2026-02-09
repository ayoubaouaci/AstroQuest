"use client";

// Cosmic Synth Engine
// Generates sound effects procedurally using Web Audio API
// No external files required!

class SoundEngine {
    private audioContext: AudioContext | null = null;
    private enabled: boolean = true;
    private masterGain: GainNode | null = null;

    constructor() {
        if (typeof window !== "undefined") {
            // Lazy init to handle browser autoplay policies
            window.addEventListener('click', () => this.initContext(), { once: true });
            window.addEventListener('keydown', () => this.initContext(), { once: true });
        }
    }

    private initContext() {
        if (this.audioContext) return;

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.audioContext = new AudioContextClass();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.6; // Increased volume
            this.masterGain.connect(this.audioContext.destination);

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 1) {
        if (!this.enabled || !this.audioContext || !this.masterGain) {
            // Try initializing if user gesture happened but context wasn't ready
            if (!this.audioContext) this.initContext();
            return;
        }

        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + startTime);

            gain.gain.setValueAtTime(0, this.audioContext.currentTime + startTime);
            gain.gain.linearRampToValueAtTime(vol, this.audioContext.currentTime + startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(this.audioContext.currentTime + startTime);
            osc.stop(this.audioContext.currentTime + startTime + duration);
        } catch (e) {
            // Ignore ephemeral audio errors
        }
    }

    playClick() {
        // Crisp high-pitched tick
        this.playTone(800, 'sine', 0.05, 0, 0.5);
        this.playTone(1200, 'triangle', 0.02, 0, 0.3);
    }

    playHover() {
        // Subtle airy shimmer
        this.playTone(400, 'sine', 0.1, 0, 0.1);
    }

    playAscend() {
        // Rising magical chord
        if (!this.audioContext) return;
        const now = 0;
        this.playTone(220, 'sine', 1.5, now, 0.2);
        this.playTone(330, 'sine', 1.5, now + 0.1, 0.2); // E
        this.playTone(440, 'sine', 1.5, now + 0.2, 0.2); // A
        this.playTone(554, 'triangle', 2.0, now + 0.3, 0.1); // C# (Major 7th)
        this.playTone(880, 'sine', 2.5, now + 0.4, 0.1); // A octave
    }

    playComplete() {
        // Success chime
        this.playTone(523.25, 'triangle', 0.6, 0, 0.3); // C
        this.playTone(659.25, 'triangle', 0.6, 0.1, 0.3); // E
        this.playTone(783.99, 'triangle', 1.0, 0.2, 0.3); // G
        this.playTone(1046.50, 'sine', 1.5, 0.3, 0.4); // High C
    }

    playLevelUp() {
        // Retro powerup
        if (!this.audioContext) return;
        const t = this.audioContext.currentTime;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(880, t + 0.4);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain!); // safe asserting since check is above

        osc.start(t);
        osc.stop(t + 0.5);
    }

    playStateChange() {
        // Mysterious shift
        this.playTone(300, 'sawtooth', 0.8, 0, 0.05);
        this.playTone(200, 'pulse' as OscillatorType, 0.8, 0.1, 0.05);
    }

    playZoom() {
        // Whoosh
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.value = 100;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        filter.frequency.linearRampToValueAtTime(2000, this.audioContext.currentTime + 0.2);

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    playSpeech() {
        // Soft data blip
        const freq = 300 + Math.random() * 500;
        this.playTone(freq, 'sine', 0.05, 0, 0.1);
    }

    toggle() {
        this.enabled = !this.enabled;
    }

    setMuted(muted: boolean) {
        this.enabled = !muted;
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : 0.6;
        }
    }
}

export const soundEngine = new SoundEngine();
