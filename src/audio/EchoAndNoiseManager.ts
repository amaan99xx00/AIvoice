/**
 * EchoAndNoiseManager
 * Implements 5A.4 (Echo Prevention), 5A.5 (Background Noise), and 5A.20/5A.21 (Clean Audio Pipeline).
 *
 * Uses browser-supported Acoustic Echo Cancellation and a gentle 80Hz High-Pass Filter
 * to remove fan rumble/AC hum without muffling natural speech or cutting off soft consonants.
 */

export class EchoAndNoiseManager {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private highPassFilter: BiquadFilterNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isAiSpeaking = false;
  private echoDuckingFactor = 1.0;

  constructor() {}

  /**
   * Initializes the Web Audio processing graph for a given MediaStream.
   * Handles iOS / Safari AudioContext unlocking.
   */
  public async setupAudioPipeline(
    stream: MediaStream,
    existingContext?: AudioContext
  ): Promise<{ analyser: AnalyserNode; context: AudioContext }> {
    // 5A.17: Handle browser-specific AudioContext (mobile Safari)
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioContext = existingContext || new AudioCtx({ latencyHint: 'interactive' });

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Disconnect old nodes if present
    this.cleanup();

    // Source from microphone
    this.sourceNode = this.audioContext.createMediaStreamSource(stream);

    // 5A.5: Gentle High-Pass filter at 80Hz (Q = 0.707 Butterworth)
    // Eliminates fan hum, AC rumble, table thumps, and 50/60Hz electrical hum.
    // Leaves human vocal frequencies (100Hz - 8000Hz) completely transparent and natural.
    this.highPassFilter = this.audioContext.createBiquadFilter();
    this.highPassFilter.type = 'highpass';
    this.highPassFilter.frequency.setValueAtTime(80, this.audioContext.currentTime);
    this.highPassFilter.Q.setValueAtTime(0.707, this.audioContext.currentTime);

    // Analyser node for VAD, volume VU meter, and waveform visualizer
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 512;
    this.analyserNode.smoothingTimeConstant = 0.2;

    // Connect pipeline: Mic Source -> 80Hz HPF -> Analyser
    // NOTE: We deliberately do NOT connect to audioContext.destination (speakers) to prevent acoustic feedback loop!
    this.sourceNode.connect(this.highPassFilter);
    this.highPassFilter.connect(this.analyserNode);

    return {
      analyser: this.analyserNode,
      context: this.audioContext
    };
  }

  /**
   * 5A.4: Echo prevention notification when AI starts or stops speaking.
   * Dynamically raises the detection margin during AI speech to prevent speaker audio leakage.
   */
  public setAiSpeakingState(isSpeaking: boolean): void {
    this.isAiSpeaking = isSpeaking;
    // When AI is speaking, slightly raise the energy threshold to prevent speaker audio loopback
    this.echoDuckingFactor = isSpeaking ? 1.45 : 1.0;
  }

  public getIsAiSpeaking(): boolean {
    return this.isAiSpeaking;
  }

  public getEchoDuckingFactor(): number {
    return this.echoDuckingFactor;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  public cleanup(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }

    if (this.highPassFilter) {
      try {
        this.highPassFilter.disconnect();
      } catch {
        // ignore
      }
      this.highPassFilter = null;
    }

    if (this.analyserNode) {
      try {
        this.analyserNode.disconnect();
      } catch {
        // ignore
      }
      this.analyserNode = null;
    }
  }
}
