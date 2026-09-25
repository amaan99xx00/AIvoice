/**
 * WebSpeechFallback
 * Robust client-side voice engine leveraging Web Speech API & Web Audio.
 *
 * Fixes:
 * 1. Self-Speech / Echo Suppression: Filters out the AI's own audio so the agent never
 *    transcribes its own voice or loops in talking to itself.
 * 2. SpeechRecognition Auto-Keeper: Recovers from onend / onerror without dying.
 * 3. Chrome GC Protection: Holds active SpeechSynthesisUtterance reference.
 * 4. Multi-language tolerance: Uses browser language with en-US/en-IN fallbacks.
 * 5. Single Response Pipeline: Dispatches exclusively to callbacks.onTranscript without duplicate calls.
 */

import { BargeInManager } from '../audio/BargeInManager';
import { SpeechNormalizer } from '../speech/SpeechNormalizer';

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
  onSpeechDetected?: () => void;
}

export class WebSpeechFallback {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private isRecognizing = false;
  private bargeInManager: BargeInManager;
  private callbacks: WebSpeechCallbacks;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  
  // Echo suppression: track what the AI is speaking to avoid hearing itself
  private lastAiSpokenUtterance = '';
  private aiSpeakingEndTime = 0;
  private currentUtterance: SpeechSynthesisUtterance | null = null; // Prevent Chrome GC bug
  private restartTimer: number | null = null;

  constructor(bargeInManager: BargeInManager, callbacks: WebSpeechCallbacks = {}) {
    this.bargeInManager = bargeInManager;
    this.callbacks = callbacks;
    this.initSpeechSynthesis();
  }

  private initSpeechSynthesis(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
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
   * Section 26: Echo suppression - Detects if transcribed text is the AI's own voice
   */
  private isSelfEcho(transcript: string): boolean {
    if (!this.lastAiSpokenUtterance) return false;
    const cleanT = transcript.toLowerCase().trim();
    if (!cleanT) return true;

    // Check if AI is currently speaking or spoke within the last 800ms
    const isDuringOrNearAiSpeech =
      this.bargeInManager.getIsAiSpeaking() || Date.now() - this.aiSpeakingEndTime < 800;

    if (!isDuringOrNearAiSpeech) return false;

    // Compare word overlap with last spoken AI text
    const aiWords = this.lastAiSpokenUtterance
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const userWords = cleanT
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    if (userWords.length === 0) return true;

    let matches = 0;
    for (const w of userWords) {
      if (aiWords.includes(w)) matches++;
    }

    const overlap = matches / userWords.length;
    // If 40% or more words match the AI's own recent words, it is an echo!
    return overlap >= 0.4;
  }

  /**
   * Initializes browser speech recognition
   */
  public startListening(): boolean {
    this.isListening = true;
    return this.setupAndStartRecognition();
  }

  private setupAndStartRecognition(): boolean {
    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      console.warn('[WebSpeechFallback] Speech recognition not supported in this browser.');
      this.callbacks.onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.onend = null;
          this.recognition.onerror = null;
          this.recognition.stop();
        } catch {
          // ignore
        }
      }

      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      // Smart language: default to user's browser language with en-US/en-IN support
      const sysLang = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US';
      this.recognition.lang = sysLang;

      this.recognition.onstart = () => {
        console.log('[WebSpeechFallback] Speech recognition ACTIVE. Listening on lang:', this.recognition?.lang);
        this.isRecognizing = true;
      };

      (this.recognition as unknown as { onspeechstart?: () => void }).onspeechstart = () => {
        console.log('[WebSpeechFallback] Voice detected by recognizer');
        this.callbacks.onSpeechDetected?.();
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

        const rawTranscript = (finalTranscript || interimTranscript).trim();
        if (!rawTranscript) return;

        // Check for self-speech echo
        if (this.isSelfEcho(rawTranscript)) {
          console.log('[WebSpeechFallback] Filtered out AI self-speech echo:', rawTranscript);
          return;
        }

        // Legitimate customer speech while AI is speaking -> Trigger Barge-In!
        if (this.bargeInManager.getIsAiSpeaking()) {
          console.log('[WebSpeechFallback] Customer interrupted AI speech with:', rawTranscript);
          this.bargeInManager.triggerBargeIn('voice_detected');
        }

        if (finalTranscript.trim().length > 0) {
          console.log('[WebSpeechFallback] Final customer transcript:', finalTranscript.trim());
          this.callbacks.onTranscript?.(finalTranscript.trim(), true);
        } else if (interimTranscript.trim().length > 0) {
          this.callbacks.onTranscript?.(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.log('[WebSpeechFallback] Recognition event status:', event.error);
        if (event.error === 'no-speech') {
          // Normal silence, keep listening
          return;
        }
        if (event.error === 'not-allowed') {
          this.callbacks.onError?.(
            'Microphone access is currently blocked. Please allow microphone access in your browser settings and try again.'
          );
          return;
        }
        if (event.error === 'aborted') {
          if (this.isListening) {
            this.safeRestart(200);
          }
          return;
        }
        if (event.error === 'network') {
          this.safeRestart(500);
        }
      };

      this.recognition.onend = () => {
        console.log('[WebSpeechFallback] Recognition ended. Keepalive needed:', this.isListening);
        this.isRecognizing = false;
        if (this.isListening) {
          this.safeRestart(150);
        }
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('[WebSpeechFallback] Initial start error:', err);
      return false;
    }
  }

  private safeRestart(delayMs: number = 150): void {
    if (!this.isListening) return;

    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }

    this.restartTimer = window.setTimeout(() => {
      if (this.isListening && !this.isRecognizing) {
        try {
          if (this.recognition) {
            this.recognition.start();
            this.isRecognizing = true;
          } else {
            this.setupAndStartRecognition();
          }
        } catch {
          // If start() throws, recreate a fresh SpeechRecognition instance
          this.setupAndStartRecognition();
        }
      }
    }, delayMs);
  }

  /**
   * Ensures recognition is actively listening when AI finishes speaking
   */
  public ensureListening(): void {
    if (!this.isListening) return;
    if (!this.isRecognizing) {
      this.safeRestart(100);
    }
  }

  public stopListening(): void {
    this.isListening = false;
    this.isRecognizing = false;

    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }

    if (this.recognition) {
      try {
        this.recognition.onend = null;
        this.recognition.onerror = null;
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
   * Speaks text using speech synthesis with normalization & barge-in support
   */
  public speak(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // 1. If currently speaking, stop first
    window.speechSynthesis.cancel();

    // 2. Normalize text: $59.99 -> "fifty-nine dollars and ninety-nine cents"
    const normalized = SpeechNormalizer.normalizeTtsText(text);

    // Track AI spoken text for self-echo suppression
    this.lastAiSpokenUtterance = normalized;

    const utterance = new SpeechSynthesisUtterance(normalized);
    this.currentUtterance = utterance; // Prevent Chrome GC bug

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.bargeInManager.setAiSpeaking(true);
      this.callbacks.onAiSpeakingStart?.(text);
    };

    utterance.onend = () => {
      this.bargeInManager.setAiSpeaking(false);
      this.aiSpeakingEndTime = Date.now();
      this.currentUtterance = null;
      this.callbacks.onAiSpeakingEnd?.();
      // Ensure recognizer is actively listening for the customer's answer!
      this.ensureListening();
    };

    utterance.onerror = () => {
      this.bargeInManager.setAiSpeaking(false);
      this.aiSpeakingEndTime = Date.now();
      this.currentUtterance = null;
      this.callbacks.onAiSpeakingEnd?.();
      this.ensureListening();
    };

    window.speechSynthesis.speak(utterance);
  }

  public setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public handleCustomerUtterance(text: string): void {
    this.callbacks.onTranscript?.(text, true);
  }
}
