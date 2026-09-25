/**
 * AuthService
 * Implements Section 20 & 21 (Authentication Check before Cart Action).
 * Manages user authentication state, login, signup, and listeners.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export type AuthListener = (user: User | null) => void;

export class AuthService {
  private static currentUser: User | null = null;
  private static listeners: AuthListener[] = [];

  public static getCurrentUser(): User | null {
    return this.currentUser;
  }

  public static isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  public static login(email: string, _password?: string): User {
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0] || 'Customer',
      email
    };
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  public static signup(name: string, email: string, _password?: string): User {
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || 'Customer',
      email
    };
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  public static logout(): void {
    this.currentUser = null;
    this.notifyListeners();
  }

  public static subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach((l) => {
      try {
        l(this.currentUser);
      } catch {
        // ignore
      }
    });
  }
}
