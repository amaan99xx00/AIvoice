/**
 * Section 5A: Configuration Specifications for Voice Capture & Audio Quality
 * Aligned with real-world website usage across desktop, mobile, laptops, headsets, and Bluetooth.
 */

export interface AudioConstraintsConfig {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  channelCount: number;
  sampleRate: number;
  latency: number;
}

export interface VadConfig {
  /** RMS threshold for considering audio as speech (0.0 to 1.0) */
  speechThreshold: number;
  /** Minimum consecutive speech duration in ms before triggering SPEECH_START */
  speechOnsetDurationMs: number;
  /** Natural pause duration in ms before considering turn finished (prevents cutting off) */
  speechHangTimeMs: number;
  /** Silence threshold to detect silence / dead microphone */
  silenceThreshold: number;
  /** Timeout in ms to trigger "silent mic" warning */
  silentMicTimeoutMs: number;
}

export interface BargeInConfig {
  /** Enables interruption of AI playback when customer speaks */
  enabled: boolean;
  /** RMS energy needed during AI speech to register a deliberate barge-in */
  interruptionThreshold: number;
  /** Duration in ms that user speech must persist to confirm intentional interruption */
  minInterruptionDurationMs: number;
}

export interface VoiceMessagesConfig {
  /** 5A.6: When microphone permission is blocked/denied */
  permissionDenied: string;
  /** 5A.7: When microphone input level is too low or dead */
  microphoneUnavailable: string;
  /** 5A.10: When speech is unclear or uncertain */
  unclearSpeech: string;
  /** 5A.15: Disambiguation prompt for 60 vs 16 or similar quantities */
  quantityClarification: (quantity: number | string) => string;
  /** 5A.19: When audio connection experiences temporary jitter/glitch */
  connectionRecovering: string;
  /** 5A.19: When audio connection fails and cannot recover */
  connectionFailed: string;
}

export interface VoicePersonaConfig {
  provider: 'vapi' | 'web-speech' | 'elevenlabs';
  voiceId: string;
  model: string;
  speakingRate: number; // 1.0 = natural conversational
  pitch: number;
  temperature: number;
  bargeInEnabled: boolean;
}

export const VOICE_CONFIG = {
  // 5A.1 & 5A.20: Clean Microphone Input Constraints
  audioConstraints: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 1, // Mono: best for speech recognition
    sampleRate: 16000, // 16kHz: industry standard for STT
    latency: 0 // Lowest practical latency
  } as AudioConstraintsConfig,

  // 5A.2: Speech Detection & Turn Management
  vad: {
    speechThreshold: 0.025, // Responsive yet resistant to mild ambient noise
    speechOnsetDurationMs: 120, // Fast detection: < 150ms
    speechHangTimeMs: 700, // Natural pause: 700ms avoids cutting off sentence endings
    silenceThreshold: 0.005, // Below this is considered dead silence
    silentMicTimeoutMs: 4000 // 4 seconds of silence when expecting speech triggers check
  } as VadConfig,

  // 5A.3: Barge-in / Interruption handling
  bargeIn: {
    enabled: true,
    interruptionThreshold: 0.035, // Slightly higher than normal VAD to account for acoustic bleed
    minInterruptionDurationMs: 100 // Rapid interruption cutoff
  } as BargeInConfig,

  // 5A.6, 5A.7, 5A.10, 5A.15, 5A.19: Customer-Facing Messages (Strict Requirement Compliance)
  messages: {
    permissionDenied:
      "Microphone access is currently blocked. Please allow microphone access in your browser settings and try again.",
    microphoneUnavailable:
      "I can't hear you at the moment. Please check your microphone and try again.",
    unclearSpeech:
      "Sorry, I didn't quite catch that. Could you please say that again?",
    quantityClarification: (quantity: number | string) =>
      `Just to confirm, did you mean the ${quantity}-pill option?`,
    connectionRecovering:
      "I'm having a little trouble with the audio connection. Please try speaking again.",
    connectionFailed:
      "I'm sorry, the voice connection was interrupted. Please try again."
  } as VoiceMessagesConfig,

  // 5A.11 & 5A.12: Natural AI Voice Personality
  persona: {
    provider: 'vapi',
    voiceId: 'jennifer-playht',
    model: 'gpt-4o-mini',
    speakingRate: 1.0, // Conversational pacing
    pitch: 1.0,
    temperature: 0.4,
    bargeInEnabled: true
  } as VoicePersonaConfig,

  // Verified Catalog Options for 5A.13, 5A.14, 5A.15
  sampleCatalog: [
    {
      id: 'pack-30',
      title: 'Weight Wellness - 30 Pill Supply',
      pills: 30,
      price: 29.99,
      formattedPrice: 'twenty-nine dollars and ninety-nine cents',
      inStock: true
    },
    {
      id: 'pack-60',
      title: 'Weight Wellness - 60 Pill Supply',
      pills: 60,
      price: 54.99,
      formattedPrice: 'fifty-four dollars and ninety-nine cents',
      inStock: true
    },
    {
      id: 'pack-100',
      title: 'Weight Wellness - 100 Pill Supply',
      pills: 100,
      price: 79.99,
      formattedPrice: 'seventy-nine dollars and ninety-nine cents',
      inStock: true
    }
  ]
};
