/**
 * VoiceOrbVisualizer
 * Implements Section 30 (Voice Visualizer):
 * - User is speaking: Animate dynamically based on microphone RMS energy
 * - AI is speaking: Undulating glowing soundwave ripples
 * - Idle: Subtle soothing breathing animation
 * - Muted: Soft subdued slate ring
 * - Thinking: Gentle amber pulse
 */

import { VoiceState } from '../state/VoiceStateMachine';

export class VoiceOrbVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyser: AnalyserNode | null = null;
  private currentState: VoiceState = 'IDLE';
  private animationId: number | null = null;
  private isRunning = false;
  private phase = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context for orb visualizer');
    this.ctx = ctx;
  }

  public setAnalyser(analyser: AnalyserNode | null): void {
    this.analyser = analyser;
  }

  public setState(state: VoiceState): void {
    this.currentState = state;
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private render = (): void => {
    if (!this.isRunning) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.28;

    this.ctx.clearRect(0, 0, width, height);
    this.phase += 0.04;

    // Read microphone RMS if active
    let rms = 0;
    if (this.analyser && (this.currentState === 'USER_SPEAKING' || this.currentState === 'LISTENING')) {
      const buffer = new Float32Array(this.analyser.fftSize);
      this.analyser.getFloatTimeDomainData(buffer);
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i];
      }
      rms = Math.sqrt(sum / buffer.length);
    }

    switch (this.currentState) {
      case 'USER_SPEAKING':
        this.renderUserSpeakingOrb(centerX, centerY, baseRadius, rms);
        break;

      case 'ASSISTANT_SPEAKING':
        this.renderAssistantSpeakingOrb(centerX, centerY, baseRadius);
        break;

      case 'THINKING':
      case 'TRANSCRIBING':
        this.renderThinkingOrb(centerX, centerY, baseRadius);
        break;

      case 'MUTED':
        this.renderMutedOrb(centerX, centerY, baseRadius);
        break;

      case 'ERROR':
        this.renderErrorOrb(centerX, centerY, baseRadius);
        break;

      case 'LISTENING':
      case 'READY':
      default:
        this.renderBreathingOrb(centerX, centerY, baseRadius, rms);
        break;
    }

    this.animationId = requestAnimationFrame(this.render);
  };

  /**
   * User speaking: reacts directly to microphone RMS input
   */
  private renderUserSpeakingOrb(cx: number, cy: number, baseRadius: number, rms: number): void {
    const scale = 1 + Math.min(0.6, rms * 3.5);
    const radius = baseRadius * scale;

    // Outer glow
    const grad = this.ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.6);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.9)'); // Emerald green
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.5)'); // Cyan
    grad.addColorStop(1, 'rgba(16, 185, 129, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Inner core
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#10b981';
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#34d399';
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  /**
   * AI speaking: undulating audio waves with blue/indigo glow
   */
  private renderAssistantSpeakingOrb(cx: number, cy: number, baseRadius: number): void {
    const pulse1 = Math.sin(this.phase * 2) * 8;
    const pulse2 = Math.cos(this.phase * 1.5) * 6;

    // Ripple 1
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, baseRadius * 1.45 + pulse1, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Ripple 2
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, baseRadius * 1.25 + pulse2, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Core gradient
    const grad = this.ctx.createRadialGradient(cx, cy, 5, cx, cy, baseRadius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#38bdf8');
    grad.addColorStop(1, '#6366f1');

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, baseRadius + pulse1 * 0.4, 0, Math.PI * 2);
    this.ctx.fillStyle = grad;
    this.ctx.shadowBlur = 24;
    this.ctx.shadowColor = '#38bdf8';
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  /**
   * Thinking: subtle amber shimmer
   */
  private renderThinkingOrb(cx: number, cy: number, baseRadius: number): void {
    const pulse = Math.sin(this.phase * 3) * 4;

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, baseRadius + pulse, 0, Math.PI * 2);
    const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.3);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, 'rgba(245, 158, 11, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.fill();
  }

  /**
   * Muted: soft slate gray
   */
  private renderMutedOrb(cx: number, cy: number, baseRadius: number): void {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, baseRadius * 0.9, 0, Math.PI * 2);
    this.ctx.fillStyle = '#64748b';
    this.ctx.fill();

    // Draw slash across
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 20, cy - 20);
    this.ctx.lineTo(cx + 20, cy + 20);
    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  }

  /**
   * Error: soft red warning orb
   */
  private renderErrorOrb(cx: number, cy: number, baseRadius: number): void {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#ef4444';
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  /**
   * Idle/Listening: subtle soothing breathing animation
   */
  private renderBreathingOrb(cx: number, cy: number, baseRadius: number, rms: number): void {
    const breath = Math.sin(this.phase * 0.8) * 3 + rms * 30;
    const r = baseRadius + breath;

    const grad = this.ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.4);
    grad.addColorStop(0, '#f0f9ff');
    grad.addColorStop(0.4, '#0ea5e9');
    grad.addColorStop(0.8, '#0284c7');
    grad.addColorStop(1, 'rgba(2, 132, 199, 0)');

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
    this.ctx.fillStyle = grad;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = '#38bdf8';
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }
}
