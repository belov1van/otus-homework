import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['id', 'title', 'difficulty', 'actions'];
  isLoading = true;

  constructor(private taskService: TaskService) {}

  private readonly difficultyLabels: { [key: string]: string } = {
    'easy': 'Легкая',
    'medium': 'Средняя',
    'hard': 'Сложная'
  };

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading tasks', error);
          this.isLoading = false;
        }
      });
  }
  
  getDifficultyLabel(difficulty: string): string {
    return this.difficultyLabels[difficulty] || difficulty;
  }
  
  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty}`;
  }
  
  deleteTask(id: number): void {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      this.taskService.deleteTask(id)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => {
            this.tasks = this.tasks.filter(task => task.id !== id);
          },
          error: (error: any) => {
            console.error('Error deleting task', error);
          }
        });
    }
  }


}
