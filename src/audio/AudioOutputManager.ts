/**
 * AudioOutputManager
 * Implements 5A.16 (Audio Output Volume), 5A.17 (Mobile Audio Unlock), and 5A.18 (Audio Output Routing).
 *
 * Employs a DynamicsCompressorNode to normalize AI speech volume, preventing sudden loudness
 * jumps, clipping, and distortion while maintaining natural conversational warmth.
 */

export class AudioOutputManager {
  private audioContext: AudioContext | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private masterGainNode: GainNode | null = null;
  private isUnlocked = false;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext(): void {
    if (typeof window === 'undefined') return;

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      this.audioContext = new AudioCtx({ latencyHint: 'interactive' });

      // 5A.16: Dynamics Compressor to prevent clipping and balance volume
      this.compressorNode = this.audioContext.createDynamicsCompressor();
      this.compressorNode.threshold.setValueAtTime(-20, this.audioContext.currentTime);
      this.compressorNode.knee.setValueAtTime(30, this.audioContext.currentTime);
      this.compressorNode.ratio.setValueAtTime(4, this.audioContext.currentTime);
      this.compressorNode.attack.setValueAtTime(0.003, this.audioContext.currentTime);
      this.compressorNode.release.setValueAtTime(0.25, this.audioContext.currentTime);

      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);

      // Compressor -> Master Gain -> Output Destination
      this.compressorNode.connect(this.masterGainNode);
      this.masterGainNode.connect(this.audioContext.destination);
    }
  }

  /**
   * 5A.17: Mobile Audio unlock for iOS Safari and mobile Chrome.
   * Mobile browsers mandate a user gesture (tap/click) before playing audio through Web Audio.
   */
  public async unlockMobileAudio(): Promise<boolean> {
    if (this.isUnlocked) return true;

    if (!this.audioContext) {
      this.initAudioContext();
    }

    if (this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        try {
          await this.audioContext.resume();
        } catch {
          // ignore
        }
      }

      // Play a short silent buffer to unlock iOS audio pipeline
      try {
        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
        this.isUnlocked = true;
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Connects an HTMLAudioElement or audio source to the normalized output compressor
   */
  public attachMediaElement(element: HTMLAudioElement): void {
    if (!this.audioContext || !this.compressorNode) return;

    try {
      const source = this.audioContext.createMediaElementSource(element);
      source.connect(this.compressorNode);
    } catch {
      // Element might already be attached or cross-origin
    }
  }

  /**
   * 5A.18: Route audio to a specific output device (e.g. Bluetooth headset) if browser supports setSinkId
   */
  public async setAudioOutputDevice(element: HTMLAudioElement, deviceId: string): Promise<boolean> {
    if (typeof (element as unknown as { setSinkId?: (id: string) => Promise<void> }).setSinkId === 'function') {
      try {
        await (element as unknown as { setSinkId: (id: string) => Promise<void> }).setSinkId(deviceId);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  public setVolume(volume: number): void {
    if (this.masterGainNode && this.audioContext) {
      const clamped = Math.max(0, Math.min(1, volume));
      this.masterGainNode.gain.setValueAtTime(clamped, this.audioContext.currentTime);
    }
  }

  public getAudioContext(): AudioContext | null {
    return this.audioContext;
  }
}
