/**
 * VoiceStateMachine
 * Implements Section 10 (Fix the "Waiting / Stuck" Problem) & Section 32 (Centralized State Machine).
 *
 * States:
 * IDLE -> CONNECTING -> READY -> LISTENING -> USER_SPEAKING -> TRANSCRIBING -> THINKING -> ASSISTANT_SPEAKING -> LISTENING
 * Plus MUTED, LOGIN_REQUIRED, ACTION_CONFIRMATION, ERROR, ENDED.
 */

export type VoiceState =
  | 'IDLE'
  | 'CONNECTING'
  | 'READY'
  | 'LISTENING'
  | 'USER_SPEAKING'
  | 'TRANSCRIBING'
  | 'THINKING'
  | 'ASSISTANT_SPEAKING'
  | 'MUTED'
  | 'LOGIN_REQUIRED'
  | 'ACTION_CONFIRMATION'
  | 'ERROR'
  | 'ENDED';

export interface StateChangeDetails {
  previousState: VoiceState;
  currentState: VoiceState;
  errorMessage?: string;
  contextData?: unknown;
}

export type StateChangeListener = (details: StateChangeDetails) => void;

export class VoiceStateMachine {
  private currentState: VoiceState = 'IDLE';
  private previousState: VoiceState = 'IDLE';
  private listeners: StateChangeListener[] = [];
  private watchdogTimer: number | null = null;
  private isTransitioning = false;

  // Maximum allowed times before watchdog auto-recovers (Section 10)
  private readonly TIMEOUT_LIMITS: Partial<Record<VoiceState, number>> = {
    CONNECTING: 10000,
    TRANSCRIBING: 8000,
    THINKING: 8000,
    ASSISTANT_SPEAKING: 35000
  };

  constructor() {}

  public getState(): VoiceState {
    return this.currentState;
  }

  public getPreviousState(): VoiceState {
    return this.previousState;
  }

  /**
   * Safe transition with watchdog reset and loop protection
   */
  public transition(nextState: VoiceState, details?: { errorMessage?: string; contextData?: unknown }): boolean {
    if (this.currentState === nextState) return false;

    // Reset watchdog whenever state changes
    this.clearWatchdog();

    this.previousState = this.currentState;
    this.currentState = nextState;

    const changeDetails: StateChangeDetails = {
      previousState: this.previousState,
      currentState: this.currentState,
      errorMessage: details?.errorMessage,
      contextData: details?.contextData
    };

    // Arm watchdog for transient states (Section 10: Never get permanently stuck!)
    const timeout = this.TIMEOUT_LIMITS[nextState];
    if (timeout) {
      this.watchdogTimer = setTimeout(() => {
        this.handleWatchdogTimeout(nextState);
      }, timeout) as unknown as number;
    }

    this.notifyListeners(changeDetails);
    return true;
  }

  private handleWatchdogTimeout(stuckState: VoiceState): void {
    console.warn(`[VoiceStateMachine] Watchdog triggered: Stuck in ${stuckState} state. Auto-recovering...`);
    if (stuckState === 'CONNECTING' || stuckState === 'THINKING' || stuckState === 'TRANSCRIBING') {
      this.transition('ERROR', {
        errorMessage: "Something went wrong. Let's try again."
      });
    } else if (stuckState === 'ASSISTANT_SPEAKING') {
      // Auto-recover back to LISTENING
      this.transition('LISTENING');
    }
  }

  public clearWatchdog(): void {
    if (this.watchdogTimer !== null) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  public subscribe(listener: StateChangeListener): () => void {
    this.listeners.push(listener);
    listener({
      previousState: this.previousState,
      currentState: this.currentState
    });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(details: StateChangeDetails): void {
    this.listeners.forEach((l) => {
      try {
        l(details);
      } catch (err) {
        console.error('State listener error:', err);
      }
    });
  }

  public setIsTransitioning(val: boolean): void {
    this.isTransitioning = val;
  }

  public getIsTransitioning(): boolean {
    return this.isTransitioning;
  }
}
