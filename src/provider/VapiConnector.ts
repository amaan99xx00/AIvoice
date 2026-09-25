/**
 * VapiConnector
 * Implements 5A.20 (Clean Audio Pipeline) & 5A.21 (Do Not Over-Engineer Audio).
 *
 * Configures Vapi Web SDK using provider-supported features:
 * - Server-side turn detection & VAD
 * - Deepgram Nova-2 speech-to-text with multi-accent support (Indian, US, UK, Hinglish)
 * - Natural neural TTS (Cartesia / ElevenLabs) with conversational warmth
 * - Native WebRTC interruption / barge-in handling
 */

import Vapi from '@vapi-ai/web';
import { VOICE_CONFIG } from '../config/voiceConfig';

export interface VapiConnectorCallbacks {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onMessage?: (message: unknown) => void;
  onError?: (friendlyMessage: string, rawError?: unknown) => void;
  onVolumeLevel?: (volume: number) => void;
}

export class VapiConnector {
  private vapi: Vapi | null = null;
  private apiKey: string | null = null;
  private isConnected = false;
  private callbacks: VapiConnectorCallbacks = {};

  constructor(apiKey?: string, callbacks: VapiConnectorCallbacks = {}) {
    this.apiKey = apiKey || null;
    this.callbacks = callbacks;
    if (this.apiKey) {
      this.initVapi(this.apiKey);
    }
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.initVapi(apiKey);
  }

  private initVapi(apiKey: string): void {
    try {
      this.vapi = new Vapi(apiKey);

      this.vapi.on('call-start', () => {
        this.isConnected = true;
        this.callbacks.onCallStart?.();
      });

      this.vapi.on('call-end', () => {
        this.isConnected = false;
        this.callbacks.onCallEnd?.();
      });

      this.vapi.on('speech-start', () => {
        this.callbacks.onSpeechStart?.();
      });

      this.vapi.on('speech-end', () => {
        this.callbacks.onSpeechEnd?.();
      });

      this.vapi.on('message', (msg: unknown) => {
        this.callbacks.onMessage?.(msg);
      });

      this.vapi.on('volume-level', (vol: number) => {
        this.callbacks.onVolumeLevel?.(vol);
      });

      this.vapi.on('error', (err: unknown) => {
        console.error('Vapi provider error:', err);
        // Map to customer-friendly message without exposing raw trace
        const friendly = VOICE_CONFIG.messages.connectionRecovering;
        this.callbacks.onError?.(friendly, err);
      });
    } catch (err) {
      console.error('Failed to instantiate Vapi client:', err);
    }
  }

  /**
   * Starts a Vapi session with assistant configuration optimized for Section 5A
   */
  public async startSession(customAssistantId?: string): Promise<void> {
    if (!this.vapi) {
      throw new Error('Vapi API Key not provided. You can test in Standalone Native mode.');
    }

    if (customAssistantId) {
      await this.vapi.start(customAssistantId);
      return;
    }

    // 5A.11 & 5A.12: Configure assistant with conversational e-commerce persona
    const assistantConfig = {
      name: 'E-commerce Voice Support Assistant',
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'en', // Handles Indian English, US, UK, and phonetic Hinglish
        smart_format: true
      },
      model: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `You are a professional, warm, calm, and helpful e-commerce voice customer-support assistant for a wellness company.
            Guidelines:
            - Always prioritize clear speech recognition over lengthy answers.
            - Keep responses concise (1-2 sentences unless presenting multiple product options).
            - When presenting options, present 30, 60, and 100-pill options with natural pauses.
            - Always speak prices in natural words (e.g., "$59.99" as "fifty-nine dollars and ninety-nine cents").
            - Disambiguate quantities: if the customer says a quantity like 16, clarify if they meant the verified 60-pill option ("Just to confirm, did you mean the 60-pill option?").
            - If speech is unclear or inaudible, ask politely: "Sorry, I didn't quite catch that. Could you please say that again?"
            - Handle Hinglish phrases naturally (e.g. "kitne ka hai" means "how much is it").
            - The customer can interrupt you at any time. When interrupted, stop immediately and answer the new question.`
          }
        ]
      },
      voice: {
        provider: '11labs',
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel / professional customer support
        stability: 0.7,
        similarityBoost: 0.8
      },
      // Server-side turn-detection & barge-in
      silenceTimeoutSeconds: 0.7,
      maxDurationSeconds: 1800,
      backgroundSound: 'off'
    };

    await this.vapi.start(assistantConfig as unknown as string);
  }

  public stopSession(): void {
    if (this.vapi && this.isConnected) {
      this.vapi.stop();
      this.isConnected = false;
    }
  }

  public isSessionActive(): boolean {
    return this.isConnected;
  }
}
