/**
 * BargeInManager
 * Implements 5A.3 (Interruptions / Barge-In):
 *
 * Example:
 * AI: "The 60-pill option is currently—"
 * Customer: "Wait, what is the price?"
 * AI immediately stops speaking and listens to the customer's new question.
 */

import { VOICE_CONFIG } from '../config/voiceConfig';

export interface BargeInCallbacks {
  onInterrupted?: (timestamp: number, cause: 'voice_detected' | 'manual') => void;
  onAiSpeechStarted?: () => void;
  onAiSpeechEnded?: () => void;
}

export class BargeInManager {
  private isAiSpeaking = false;
  private interruptionThreshold = VOICE_CONFIG.bargeIn.interruptionThreshold;
  private minInterruptionDurationMs = VOICE_CONFIG.bargeIn.minInterruptionDurationMs;
  private interruptionStartTime: number = 0;
  private callbacks: BargeInCallbacks = {};
  private activeAudioElements: HTMLAudioElement[] = [];

  constructor(callbacks: BargeInCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Registers an active HTMLAudioElement being played by TTS/Vapi so it can be halted instantly.
   */
  public registerAudioElement(audio: HTMLAudioElement): void {
    this.activeAudioElements.push(audio);
    audio.onended = () => {
      this.unregisterAudioElement(audio);
    };
  }

  public unregisterAudioElement(audio: HTMLAudioElement): void {
    const idx = this.activeAudioElements.indexOf(audio);
    if (idx !== -1) {
      this.activeAudioElements.splice(idx, 1);
    }
  }

  /**
   * Marks AI speech start/end
   */
  public setAiSpeaking(speaking: boolean): void {
    this.isAiSpeaking = speaking;
    if (speaking) {
      this.interruptionStartTime = 0;
      this.callbacks.onAiSpeechStarted?.();
    } else {
      this.callbacks.onAiSpeechEnded?.();
    }
  }

  public getIsAiSpeaking(): boolean {
    return this.isAiSpeaking;
  }

  /**
   * Evaluates incoming microphone RMS volume for barge-in while AI is speaking.
   * Called continuously by the audio loop.
   */
  public evaluateAudioLevel(rms: number): boolean {
    if (!this.isAiSpeaking || !VOICE_CONFIG.bargeIn.enabled) {
      this.interruptionStartTime = 0;
      return false;
    }

    const now = performance.now();

    // If RMS exceeds interruption threshold while AI is speaking
    if (rms >= this.interruptionThreshold) {
      if (this.interruptionStartTime === 0) {
        this.interruptionStartTime = now;
      } else if (now - this.interruptionStartTime >= this.minInterruptionDurationMs) {
        // Sustained human speech detected during AI utterance -> TRIGGER IMMEDIATE BARGE-IN!
        this.triggerBargeIn('voice_detected');
        return true;
      }
    } else {
      this.interruptionStartTime = 0;
    }

    return false;
  }

  /**
   * Immediately halts AI voice output across all audio channels (HTMLAudio, Web Speech, etc.)
   */
  public triggerBargeIn(cause: 'voice_detected' | 'manual' = 'voice_detected'): void {
    if (!this.isAiSpeaking) return;

    // 1. Immediately pause and mute all registered audio playback elements
    for (const audio of this.activeAudioElements) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
    }
    this.activeAudioElements = [];

    // 2. Halt browser native speech synthesis if in use
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    // 3. Mark AI as no longer speaking
    this.isAiSpeaking = false;
    this.interruptionStartTime = 0;

    // 4. Notify listeners so UI immediately switches to listening state
    this.callbacks.onInterrupted?.(Date.now(), cause);
  }
}
