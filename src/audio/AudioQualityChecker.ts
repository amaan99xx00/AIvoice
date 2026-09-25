/**
 * AudioQualityChecker
 * Implements 5A.7 (Microphone Quality Check):
 * - Detects disconnected mic, silent mic, extremely low volume, clipping
 * - Provides non-blaming customer-facing error messages
 *   "I can't hear you at the moment. Please check your microphone and try again."
 */

import { VOICE_CONFIG } from '../config/voiceConfig';

export interface QualityMetrics {
  rms: number;
  peak: number;
  isSilent: boolean;
  isTooLow: boolean;
  isClipping: boolean;
  health: 'optimal' | 'low_volume' | 'silent' | 'clipping' | 'disconnected';
  recommendation?: string;
}

export interface AudioQualityCallbacks {
  onQualityAlert?: (metrics: QualityMetrics, userFacingMessage?: string) => void;
}

export class AudioQualityChecker {
  private isMonitoring = false;
  private silenceTimer: number | null = null;
  private lowVolumeCount = 0;
  private clippingCount = 0;
  private consecutiveSilenceCount = 0;
  private callbacks: AudioQualityCallbacks = {};

  constructor(callbacks: AudioQualityCallbacks = {}) {
    this.callbacks = callbacks;
  }

  public startMonitoring(): void {
    this.isMonitoring = true;
    this.consecutiveSilenceCount = 0;
    this.lowVolumeCount = 0;
    this.clippingCount = 0;
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.silenceTimer !== null) {
      window.clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  /**
   * Evaluates audio samples in real-time.
   * Called ~60 times per second during session.
   */
  public evaluateMetrics(rms: number, peak: number): QualityMetrics {
    if (!this.isMonitoring) {
      return {
        rms,
        peak,
        isSilent: false,
        isTooLow: false,
        isClipping: false,
        health: 'optimal'
      };
    }

    const isSilent = rms < VOICE_CONFIG.vad.silenceThreshold;
    const isTooLow = rms > VOICE_CONFIG.vad.silenceThreshold && rms < 0.015;
    const isClipping = peak >= 0.98;

    let health: QualityMetrics['health'] = 'optimal';
    let recommendation: string | undefined = undefined;

    if (isSilent) {
      this.consecutiveSilenceCount++;
      // If continuous silence lasts > 4 seconds while conversation active
      if (this.consecutiveSilenceCount > 240) {
        health = 'silent';
        // 5A.7: "I can't hear you at the moment. Please check your microphone and try again."
        recommendation = VOICE_CONFIG.messages.microphoneUnavailable;
        this.callbacks.onQualityAlert?.(
          { rms, peak, isSilent, isTooLow, isClipping, health, recommendation },
          recommendation
        );
      }
    } else {
      this.consecutiveSilenceCount = 0;
    }

    if (isTooLow) {
      this.lowVolumeCount++;
      if (this.lowVolumeCount > 180) {
        health = 'low_volume';
        recommendation = "You're sounding a little quiet. If you'd like, try speaking closer to your microphone.";
      }
    } else {
      this.lowVolumeCount = Math.max(0, this.lowVolumeCount - 2);
    }

    if (isClipping) {
      this.clippingCount++;
      if (this.clippingCount > 20) {
        health = 'clipping';
        recommendation = 'Microphone volume is very high. Try stepping back slightly to avoid audio distortion.';
      }
    } else {
      this.clippingCount = Math.max(0, this.clippingCount - 1);
    }

    return {
      rms,
      peak,
      isSilent,
      isTooLow,
      isClipping,
      health,
      recommendation
    };
  }

  /**
   * 5A.7: Pre-flight check before session starts to ensure audio input is alive
   */
  public async runPreflightCheck(stream: MediaStream): Promise<{ passed: boolean; message?: string }> {
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      return {
        passed: false,
        message: VOICE_CONFIG.messages.microphoneUnavailable
      };
    }

    const track = audioTracks[0];
    if (track.readyState !== 'live' || track.muted) {
      return {
        passed: false,
        message: VOICE_CONFIG.messages.microphoneUnavailable
      };
    }

    return { passed: true };
  }
}
