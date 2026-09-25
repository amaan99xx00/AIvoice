/**
 * WebSpeechFallback
 * High-fidelity client-side voice engine leveraging Web Speech API & Web Audio.
 * Enables 100% functional standalone testing without needing a third-party API key.
 *
 * Implements:
 * - Real-time speech recognition (SpeechRecognition / webkitSpeechRecognition)
 * - Immediate interruption / barge-in cancellation
 * - Neural/natural voice synthesis with natural speaking speed
 */

import { BargeInManager } from '../audio/BargeInManager';
import { SpeechNormalizer } from '../speech/SpeechNormalizer';
import { HinglishIntentParser } from '../speech/HinglishIntentParser';

// Type definitions for browser speech recognition
interface IWindow extends Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

export interface WebSpeechCallbacks {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAiSpeakingStart?: (text: string) => void;
  onAiSpeakingEnd?: () => void;
  onError?: (friendlyMessage: string) => void;
}

export class WebSpeechFallback {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private bargeInManager: BargeInManager;
  private callbacks: WebSpeechCallbacks;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor(bargeInManager: BargeInManager, callbacks: WebSpeechCallbacks = {}) {
    this.bargeInManager = bargeInManager;
    this.callbacks = callbacks;
    this.initSpeechSynthesis();
  }

  private initSpeechSynthesis(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Look for natural high quality female/male customer support voices
        this.selectedVoice =
          voices.find(
            (v) =>
              (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')) &&
              v.lang.startsWith('en')
          ) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0] ||
          null;
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  /**
   * Initializes browser speech recognition
   */
  public startListening(): boolean {
    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      this.callbacks.onError?.('Speech recognition is not supported in this browser.');
      return false;
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch {
          // ignore
        }
      }

      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Supports Indian English, Hinglish, and global English

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        // If customer starts speaking while AI is speaking -> TRIGGER BARGE-IN!
        if (interimTranscript.trim().length > 0 && this.bargeInManager.getIsAiSpeaking()) {
          this.bargeInManager.triggerBargeIn('voice_detected');
        }

        if (finalTranscript.trim().length > 0) {
          this.callbacks.onTranscript?.(finalTranscript.trim(), true);
          this.handleCustomerUtterance(finalTranscript.trim());
        } else if (interimTranscript.trim().length > 0) {
          this.callbacks.onTranscript?.(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'no-speech') return;
        if (event.error === 'not-allowed') {
          this.callbacks.onError?.(
            'Microphone access is currently blocked. Please allow microphone access in your browser settings and try again.'
          );
        }
      };

      this.recognition.onend = () => {
        // Automatically keep alive if session is still supposed to be active
        if (this.isListening) {
          try {
            this.recognition?.start();
          } catch {
            // ignore
          }
        }
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Speech recognition start error:', err);
      return false;
    }
  }

  public stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Responds to customer speech with natural TTS output and pacing
   */
  public handleCustomerUtterance(text: string): void {
    const parseResult = HinglishIntentParser.parse(text);
    this.speak(parseResult.aiResponseText);
  }

  /**
   * Speaks text using speech synthesis with normalization & barge-in support
   */
  public speak(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // 1. If currently speaking, stop first
    window.speechSynthesis.cancel();

    // 2. Normalize text: $59.99 -> "fifty-nine dollars and ninety-nine cents"
    const normalized = SpeechNormalizer.normalizeTtsText(text);

    const utterance = new SpeechSynthesisUtterance(normalized);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 1.0; // 5A.13: Comfortable conversational speed
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.bargeInManager.setAiSpeaking(true);
      this.callbacks.onAiSpeakingStart?.(text);
    };

    utterance.onend = () => {
      this.bargeInManager.setAiSpeaking(false);
      this.callbacks.onAiSpeakingEnd?.();
    };

    utterance.onerror = () => {
      this.bargeInManager.setAiSpeaking(false);
      this.callbacks.onAiSpeakingEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }
}
