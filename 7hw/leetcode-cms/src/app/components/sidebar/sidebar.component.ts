import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="sidebar">
      <ul class="nav-list">
        <li><a routerLink="/dashboard">Dashboard</a></li>
        <li><a routerLink="/tasks">Tasks</a></li>
        <li><a routerLink="/tags">Tags</a></li>
        <li><a routerLink="/users">Users</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100%;
      background-color: #f8f9fa;
      padding: 20px;
      border-right: 1px solid #dee2e6;
    }
    
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .nav-list li {
      margin-bottom: 10px;
    }
    
    .nav-list a {
      color: #333;
      text-decoration: none;
      font-size: 16px;
      display: block;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .nav-list a:hover {
      background-color: #e9ecef;
    }
  `]
})
export class SidebarComponent {}