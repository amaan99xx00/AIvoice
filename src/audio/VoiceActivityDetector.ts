/**
 * VoiceActivityDetector (VAD)
 * Implements 5A.2 (Speech Detection):
 * - Fast onset detection (< 150ms)
 * - Natural speech end detection without cutting off words (hang-time: 700ms)
 * - Handles short pauses naturally during continuous sentences
 * - Real-time energy & RMS computation for volume metering
 */

import { VOICE_CONFIG } from '../config/voiceConfig';
import { EchoAndNoiseManager } from './EchoAndNoiseManager';

export type VadState = 'idle' | 'speech_onset' | 'speaking' | 'speech_hangtime';

export interface VadCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: (totalDurationMs: number) => void;
  onVolumeChange?: (rms: number, peak: number) => void;
  onStateChange?: (state: VadState) => void;
}

export class VoiceActivityDetector {
  private analyser: AnalyserNode | null = null;
  private echoManager: EchoAndNoiseManager | null = null;
  private callbacks: VadCallbacks = {};
  private animationFrameId: number | null = null;
  private isRunning = false;

  private state: VadState = 'idle';
  private onsetStartTime: number = 0;
  private speechStartTime: number = 0;
  private silenceStartTime: number = 0;

  // Thresholds from config
  private baseSpeechThreshold = VOICE_CONFIG.vad.speechThreshold;
  private onsetDurationMs = VOICE_CONFIG.vad.speechOnsetDurationMs;
  private hangTimeMs = VOICE_CONFIG.vad.speechHangTimeMs;

  constructor(callbacks: VadCallbacks = {}) {
    this.callbacks = callbacks;
  }

  public start(analyser: AnalyserNode, echoManager?: EchoAndNoiseManager): void {
    this.analyser = analyser;
    this.echoManager = echoManager || null;
    this.isRunning = true;
    this.state = 'idle';
    this.loop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state = 'idle';
  }

  private loop = (): void => {
    if (!this.isRunning || !this.analyser) return;

    const buffer = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(buffer);

    // Compute RMS and Peak volume
    let sumSquares = 0;
    let peak = 0;
    for (let i = 0; i < buffer.length; i++) {
      const val = buffer[i];
      const absVal = Math.abs(val);
      if (absVal > peak) peak = absVal;
      sumSquares += val * val;
    }
    const rms = Math.sqrt(sumSquares / buffer.length);

    this.callbacks.onVolumeChange?.(rms, peak);

    // Dynamic threshold factoring in echo ducking when AI speaks
    const duckingMultiplier = this.echoManager ? this.echoManager.getEchoDuckingFactor() : 1.0;
    const effectiveSpeechThreshold = this.baseSpeechThreshold * duckingMultiplier;

    const now = performance.now();
    const isAboveThreshold = rms >= effectiveSpeechThreshold;

    this.updateVadState(isAboveThreshold, now);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  /**
   * Finite State Machine for reliable speech detection without jitter
   */
  private updateVadState(isAboveThreshold: boolean, now: number): void {
    const prevState = this.state;

    switch (this.state) {
      case 'idle':
        if (isAboveThreshold) {
          this.state = 'speech_onset';
          this.onsetStartTime = now;
        }
        break;

      case 'speech_onset':
        if (isAboveThreshold) {
          // If sound persists for onset duration (e.g. 120ms), confirm speech start
          if (now - this.onsetStartTime >= this.onsetDurationMs) {
            this.state = 'speaking';
            this.speechStartTime = now;
            this.callbacks.onSpeechStart?.();
          }
        } else {
          // False trigger or brief click: return to idle
          this.state = 'idle';
        }
        break;

      case 'speaking':
        if (!isAboveThreshold) {
          // Customer paused speaking: enter hangtime window to see if it's just a natural sentence pause
          this.state = 'speech_hangtime';
          this.silenceStartTime = now;
        }
        break;

      case 'speech_hangtime':
        if (isAboveThreshold) {
          // Customer resumed speaking within natural pause window -> resume speaking state!
          this.state = 'speaking';
        } else if (now - this.silenceStartTime >= this.hangTimeMs) {
          // Silence exceeded hang-time window -> Speech turn has legitimately finished!
          this.state = 'idle';
          const duration = now - this.speechStartTime;
          this.callbacks.onSpeechEnd?.(duration);
        }
        break;
    }

    if (this.state !== prevState) {
      this.callbacks.onStateChange?.(this.state);
    }
  }

  public getState(): VadState {
    return this.state;
  }

  public setSensitivity(threshold: number): void {
    this.baseSpeechThreshold = threshold;
  }

  public setHangTime(hangTimeMs: number): void {
    this.hangTimeMs = hangTimeMs;
  }
}
