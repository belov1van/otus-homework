import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { tap, delay, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
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
      this.isAuthenticatedSubject.next(this.hasToken());
      
      // Check if user is already logged in from localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
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
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
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
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
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
