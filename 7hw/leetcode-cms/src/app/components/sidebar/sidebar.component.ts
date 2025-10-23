import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
  template: `
    <nav class="sidebar" *ngIf="isAuthenticated">
      <div class="sidebar-header">
        <h3>LeetCode CMS</h3>
      </div>
      <ul class="nav-list">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a routerLink="/tasks" routerLinkActive="active">
            <mat-icon>assignment</mat-icon>
            <span>Tasks</span>
          </a>
        </li>
        <li>
          <a routerLink="/tags" routerLinkActive="active">
            <mat-icon>label</mat-icon>
            <span>Tags</span>
          </a>
        </li>
        <li *ngIf="isAdmin">
          <a routerLink="/users" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            <span>Users</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100%;
      background-color: #f8f9fa;
      padding: 20px 0;
      border-right: 1px solid #dee2e6;
      position: fixed;
      top: 64px; /* Height of the header */
      left: 0;
      bottom: 0;
      overflow-y: auto;
    }
    
    .sidebar-header {
      padding: 0 20px 20px;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 20px;
    }
    
    .sidebar-header h3 {
      margin: 0;
      color: #3f51b5;
      font-size: 1.5rem;
    }
    
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .nav-list li {
      margin-bottom: 5px;
    }
    
    .nav-list a {
      color: #333;
      text-decoration: none;
      font-size: 16px;
      display: flex;
      align-items: center;
      padding: 12px 20px;
      transition: background-color 0.2s, color 0.2s;
    }
    
    .nav-list a:hover {
      background-color: #e9ecef;
    }
    
    .nav-list a.active {
      background-color: #e3f2fd;
      color: #3f51b5;
      border-left: 4px solid #3f51b5;
    }
    
    .nav-list mat-icon {
      margin-right: 10px;
      color: #666;
    }
    
    .nav-list a.active mat-icon {
      color: #3f51b5;
    }
  `]
})
export class SidebarComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = !!user && user.role === 'admin';
    });
  }
}