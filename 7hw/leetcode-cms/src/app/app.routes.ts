import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { TaskDetailComponent } from './components/tasks/task-detail/task-detail.component';
import { TagListComponent } from './components/tags/tag-list/tag-list.component';
import { TagFormComponent } from './components/tags/tag-form/tag-form.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:id/edit', component: TaskFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'tags', component: TagListComponent, canActivate: [AuthGuard] },
  { path: 'tags/new', component: TagFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'tags/:id/edit', component: TagFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'users/new', component: UserFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'users/:id/edit', component: UserFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
