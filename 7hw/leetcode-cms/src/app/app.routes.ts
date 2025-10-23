import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { TaskDetailComponent } from './components/tasks/task-detail/task-detail.component';
import { TagListComponent } from './components/tags/tag-list/tag-list.component';
import { TagFormComponent } from './components/tags/tag-form/tag-form.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/:id', component: TaskDetailComponent },
  { path: 'tasks/:id/edit', component: TaskFormComponent },
  { path: 'tags', component: TagListComponent },
  { path: 'tags/new', component: TagFormComponent },
  { path: 'tags/:id/edit', component: TagFormComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id/edit', component: UserFormComponent },
];
