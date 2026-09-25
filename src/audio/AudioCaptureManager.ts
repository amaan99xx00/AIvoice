/**
 * AudioCaptureManager
 * Implements 5A.1 (Clean Microphone Input), 5A.6 (Microphone Permission),
 * 5A.17 (Mobile Audio), and 5A.18 (Headphones / Bluetooth).
 */

import { VOICE_CONFIG } from '../config/voiceConfig';

export type PermissionState = 'prompt' | 'requesting' | 'granted' | 'denied' | 'unsupported';

export interface DeviceInfo {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
  isBluetoothOrHeadset: boolean;
}

export interface AudioCaptureCallbacks {
  onPermissionChange?: (state: PermissionState) => void;
  onDeviceChange?: (devices: DeviceInfo[]) => void;
  onError?: (friendlyMessage: string, technicalDetails?: unknown) => void;
  onStreamActive?: (stream: MediaStream) => void;
}

export class AudioCaptureManager {
  private mediaStream: MediaStream | null = null;
  private permissionState: PermissionState = 'prompt';
  private callbacks: AudioCaptureCallbacks = {};
  private activeDeviceId: string | null = null;
  private deviceChangeListenerAttached = false;

  constructor(callbacks: AudioCaptureCallbacks = {}) {
    this.callbacks = callbacks;
    this.initDeviceListener();
  }

  /**
   * Initializes device change detection (detecting Bluetooth headsets, wired headphones, etc.)
   */
  private initDeviceListener(): void {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      if (!this.deviceChangeListenerAttached) {
        navigator.mediaDevices.addEventListener('devicechange', async () => {
          const devices = await this.getAvailableAudioDevices();
          if (this.callbacks.onDeviceChange) {
            this.callbacks.onDeviceChange(devices);
          }
        });
        this.deviceChangeListenerAttached = true;
      }
    }
  }

  /**
   * Checks current permission status without prompting user if possible (Permissions API)
   */
  public async checkPermissionStatus(): Promise<PermissionState> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      this.permissionState = 'unsupported';
      return this.permissionState;
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        // Query microphone permission state
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'granted') {
          this.permissionState = 'granted';
        } else if (permission.state === 'denied') {
          this.permissionState = 'denied';
        } else {
          this.permissionState = 'prompt';
        }

        permission.onchange = () => {
          if (permission.state === 'granted') this.permissionState = 'granted';
          else if (permission.state === 'denied') this.permissionState = 'denied';
          else this.permissionState = 'prompt';
          this.callbacks.onPermissionChange?.(this.permissionState);
        };

        return this.permissionState;
      }
    } catch {
      // Permissions API query not supported for microphone on some browsers (e.g. Safari)
    }

    return this.permissionState;
  }

  /**
   * 5A.1 & 5A.6: Request microphone permission & acquire optimized audio stream.
   * Uses optimal constraints with automatic graceful mobile fallbacks.
   */
  public async requestMicrophone(selectedDeviceId?: string): Promise<MediaStream> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.permissionState = 'unsupported';
      this.callbacks.onPermissionChange?.(this.permissionState);
      const msg = VOICE_CONFIG.messages.permissionDenied;
      this.callbacks.onError?.(msg, 'navigator.mediaDevices.getUserMedia is unsupported');
      throw new Error(msg);
    }

    this.permissionState = 'requesting';
    this.callbacks.onPermissionChange?.(this.permissionState);

    // Stop existing stream if currently active
    this.stopCapture();

    // 5A.1: Construct browser-recommended audio constraints
    const idealConstraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: { ideal: VOICE_CONFIG.audioConstraints.echoCancellation },
        noiseSuppression: { ideal: VOICE_CONFIG.audioConstraints.noiseSuppression },
        autoGainControl: { ideal: VOICE_CONFIG.audioConstraints.autoGainControl },
        channelCount: { ideal: VOICE_CONFIG.audioConstraints.channelCount },
        sampleRate: { ideal: VOICE_CONFIG.audioConstraints.sampleRate },
        ...(selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : {}),
        ...({ latency: { ideal: VOICE_CONFIG.audioConstraints.latency } } as Record<string, unknown>)
      } as MediaTrackConstraints,
      video: false
    };

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia(idealConstraints);
      this.permissionState = 'granted';
      this.activeDeviceId = selectedDeviceId || null;
      this.callbacks.onPermissionChange?.(this.permissionState);
      this.callbacks.onStreamActive?.(this.mediaStream);
      return this.mediaStream;
    } catch (primaryError: unknown) {
      console.warn('Primary audio constraints rejected, attempting graceful standard fallback for mobile/Safari...', primaryError);

      // Graceful fallback for mobile browsers (iOS Safari rejects exact sampleRate/latency in some versions)
      try {
        const fallbackConstraints: MediaStreamConstraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            ...(selectedDeviceId ? { deviceId: selectedDeviceId } : {})
          },
          video: false
        };

        this.mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        this.permissionState = 'granted';
        this.activeDeviceId = selectedDeviceId || null;
        this.callbacks.onPermissionChange?.(this.permissionState);
        this.callbacks.onStreamActive?.(this.mediaStream);
        return this.mediaStream;
      } catch (fallbackError: unknown) {
        // Handle permission denial or hardware error gracefully
        this.permissionState = 'denied';
        this.callbacks.onPermissionChange?.(this.permissionState);

        // 5A.6: "Microphone access is currently blocked. Please allow microphone access in your browser settings and try again."
        // Do not show technical browser errors to the customer.
        const userFacingMessage = VOICE_CONFIG.messages.permissionDenied;
        this.callbacks.onError?.(userFacingMessage, fallbackError);
        throw new Error(userFacingMessage);
      }
    }
  }

  /**
   * 5A.18: Enumerate available audio input and output devices.
   * Identifies Bluetooth headsets, earbuds, and headphones.
   */
  public async getAvailableAudioDevices(): Promise<DeviceInfo[]> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter((d) => d.kind === 'audioinput' || d.kind === 'audiooutput')
        .map((d) => {
          const labelLower = d.label.toLowerCase();
          const isBluetoothOrHeadset =
            labelLower.includes('bluetooth') ||
            labelLower.includes('airpod') ||
            labelLower.includes('buds') ||
            labelLower.includes('headset') ||
            labelLower.includes('headphone') ||
            labelLower.includes('wireless') ||
            labelLower.includes('hands-free');

          return {
            deviceId: d.deviceId,
            label: d.label || `${d.kind === 'audioinput' ? 'Microphone' : 'Speaker'} (${d.deviceId.slice(0, 5)})`,
            kind: d.kind,
            isBluetoothOrHeadset
          };
        });
    } catch {
      return [];
    }
  }

  private _isMuted = false;

  /**
   * Section 7: Mute microphone input cleanly without ending voice session
   */
  public mute(): void {
    this._isMuted = true;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((t) => {
        t.enabled = false;
      });
    }
  }

  /**
   * Section 7: Unmute microphone input
   */
  public unmute(): void {
    this._isMuted = false;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((t) => {
        t.enabled = true;
      });
    }
  }

  public isMuted(): boolean {
    return this._isMuted;
  }

  /**
   * Section 8 & 34: Completely stops all microphone tracks and releases hardware resources
   */
  public releaseAll(): void {
    this.stopCapture();
    this._isMuted = false;
  }

  /**
   * Stops all active microphone tracks and cleans up resources
   */
  public stopCapture(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore cleanup errors
        }
      });
      this.mediaStream = null;
    }
    this._isMuted = false;
  }

  public getActiveStream(): MediaStream | null {
    return this.mediaStream;
  }

  public getPermissionState(): PermissionState {
    return this.permissionState;
  }

  public getActiveDeviceId(): string | null {
    return this.activeDeviceId;
  }
}
