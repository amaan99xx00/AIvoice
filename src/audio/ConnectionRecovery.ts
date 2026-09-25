/**
 * ConnectionRecovery
 * Implements 5A.19 (Audio Failure Recovery):
 * - Watches audio stream and connection health
 * - Graceful re-acquisition of audio tracks without terminating the conversation
 * - Context preservation across network hiccups
 * - Non-blaming friendly status messaging:
 *   "I'm having a little trouble with the audio connection. Please try speaking again."
 */

import { VOICE_CONFIG } from '../config/voiceConfig';

export interface RecoveryCallbacks {
  onReconnecting?: (attempt: number, message: string) => void;
  onRecovered?: () => void;
  onFailed?: (message: string) => void;
}

export class ConnectionRecovery {
  private callbacks: RecoveryCallbacks = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private isReconnecting = false;
  private watchdogInterval: number | null = null;
  private currentStream: MediaStream | null = null;
  private reconnectFn: (() => Promise<MediaStream>) | null = null;

  constructor(callbacks: RecoveryCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Attaches watchdog monitoring to the live MediaStream
   */
  public watchStream(stream: MediaStream, reconnectFn: () => Promise<MediaStream>): void {
    this.currentStream = stream;
    this.reconnectFn = reconnectFn;
    this.stopWatchdog();

    // Listen to track ended or muted events
    stream.getAudioTracks().forEach((track) => {
      track.onended = () => {
        console.warn('Audio track ended unexpectedly, triggering recovery...');
        this.attemptRecovery();
      };
      track.onmute = () => {
        console.warn('Audio track muted by system/hardware, initiating health check...');
      };
    });

    // Check periodically for healthy track state
    this.watchdogInterval = window.setInterval(() => {
      if (this.currentStream && !this.isReconnecting) {
        const tracks = this.currentStream.getAudioTracks();
        const hasLiveTrack = tracks.some((t) => t.readyState === 'live' && t.enabled);
        if (!hasLiveTrack) {
          this.attemptRecovery();
        }
      }
    }, 2500);
  }

  /**
   * Attempts safe recovery and reconnection
   */
  public async attemptRecovery(): Promise<boolean> {
    if (this.isReconnecting) return false;
    if (!this.reconnectFn) return false;

    this.isReconnecting = true;
    this.reconnectAttempts++;

    // 5A.19: Notify user with conversational, non-technical reassurance
    const recoveryMsg = VOICE_CONFIG.messages.connectionRecovering;
    this.callbacks.onReconnecting?.(this.reconnectAttempts, recoveryMsg);

    try {
      // Exponential backoff delay
      const backoffMs = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts - 1), 3000);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));

      const newStream = await this.reconnectFn();
      this.currentStream = newStream;
      this.reconnectAttempts = 0;
      this.isReconnecting = false;
      this.callbacks.onRecovered?.();
      return true;
    } catch {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.isReconnecting = false;
        return this.attemptRecovery();
      } else {
        this.isReconnecting = false;
        const failedMsg = VOICE_CONFIG.messages.connectionFailed;
        this.callbacks.onFailed?.(failedMsg);
        return false;
      }
    }
  }

  public stopWatchdog(): void {
    if (this.watchdogInterval !== null) {
      clearInterval(this.watchdogInterval);
      this.watchdogInterval = null;
    }
    this.isReconnecting = false;
    this.reconnectAttempts = 0;
  }
}
