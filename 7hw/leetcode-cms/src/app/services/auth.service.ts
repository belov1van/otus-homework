import { Injectable, PLATFORM_ID, Inject, signal, computed } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();
  public currentUser$ = computed(() => this.currentUser());
  
  private isAuthenticatedSignal = signal<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  public isAuthenticated$ = computed(() => this.isAuthenticated());
  private isBrowser: boolean;

  // Mock users for demonstration
  private users: User[] = [
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, username: 'user', email: 'user@example.com', role: 'user', createdAt: new Date(), updatedAt: new Date() }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Initialize authentication state only in browser environment
    if (this.isBrowser) {
      this.isAuthenticatedSignal.set(this.hasToken());
      
      // Check if user is already logged in from localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      }
    }
  }

  login(username: string, password: string): Observable<User> {
    // In a real app, this would be an HTTP request to a backend API
    const user = this.users.find(u => u.username === username);

    if (user && password === 'password') { // Simple mock password check
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', 'mock-jwt-token');
      }
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
      return of(user).pipe(delay(500)); // Simulate API delay
    } else {
      return throwError(() => new Error('Username or password is incorrect'));
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'admin';
  }

  private hasToken(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return !!localStorage.getItem('token');
  }
}
