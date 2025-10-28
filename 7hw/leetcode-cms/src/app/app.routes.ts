import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tasks', 
    loadComponent: () => import('./components/tasks/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tasks/new', 
    loadComponent: () => import('./components/tasks/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'tasks/:id', 
    loadComponent: () => import('./components/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tasks/:id/edit', 
    loadComponent: () => import('./components/tasks/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'tags', 
    loadComponent: () => import('./components/tags/tag-list/tag-list.component').then(m => m.TagListComponent),
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tags/new', 
    loadComponent: () => import('./components/tags/tag-form/tag-form.component').then(m => m.TagFormComponent),
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'tags/:id/edit', 
    loadComponent: () => import('./components/tags/tag-form/tag-form.component').then(m => m.TagFormComponent),
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'users', 
    loadComponent: () => import('./components/users/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'users/new', 
    loadComponent: () => import('./components/users/user-form/user-form.component').then(m => m.UserFormComponent),
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'users/:id/edit', 
    loadComponent: () => import('./components/users/user-form/user-form.component').then(m => m.UserFormComponent),
    canActivate: [AuthGuard, AdminGuard] 
  },
  { path: '**', redirectTo: '/dashboard' }
];
