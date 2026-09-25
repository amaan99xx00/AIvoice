/**
 * AudioVisualizer
 * Real-time oscilloscope waveform & volume VU meter for microphone audio monitoring.
 */

export class AudioVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyser: AnalyserNode | null = null;
  private animationId: number | null = null;
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
  }

  public attachAnalyser(analyser: AnalyserNode): void {
    this.analyser = analyser;
    this.start();
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.render();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.clear();
  }

  private clear(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.ctx.clearRect(0, 0, width, height);

    // Draw baseline
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();
  }

  private render = (): void => {
    if (!this.isRunning) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.clearRect(0, 0, width, height);

    if (!this.analyser) {
      this.clear();
      this.animationId = requestAnimationFrame(this.render);
      return;
    }

    const bufferLength = this.analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(dataArray);

    // Calculate RMS to determine glow intensity
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / bufferLength);

    // Choose visualizer line color based on volume state
    let strokeColor = '#38bdf8'; // Soft cyan for normal
    if (rms > 0.08) {
      strokeColor = '#4ade80'; // Bright emerald when speaking
    } else if (rms < 0.005) {
      strokeColor = '#64748b'; // Muted slate when quiet
    }

    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.shadowBlur = rms > 0.05 ? 12 : 2;
    this.ctx.shadowColor = strokeColor;

    this.ctx.beginPath();
    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i];
      const y = (v * (height * 0.45)) + (height / 2);

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();

    // Reset shadow
    this.ctx.shadowBlur = 0;

    this.animationId = requestAnimationFrame(this.render);
  };
}
