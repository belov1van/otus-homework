import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TaskService } from '../../services/task.service';
import { TagService } from '../../services/tag.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  taskCount = 0;
  tagCount = 0;
  userCount = 0;
  recentTasks: Task[] = [];
  isLoading = true;

  private readonly difficultyLabels: { [key: string]: string } = {
    'easy': 'Легкая',
    'medium': 'Средняя',
    'hard': 'Сложная'
  };

  constructor(
    private taskService: TaskService,
    private tagService: TagService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Загрузка количества задач и последних задач
    this.taskService.getTasks().pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (tasks) => {
        this.taskCount = tasks.length;
        this.recentTasks = tasks.slice(0, 5); // Получаем последние 5 задач
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading tasks', error);
        this.checkLoadingComplete();
      }
    });

    // Загрузка количества тегов
    this.tagService.getTags().pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (tags) => {
        this.tagCount = tags.length;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading tags', error);
        this.checkLoadingComplete();
      }
    });

    // Загрузка количества пользователей
    this.userService.getUsers().pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (users) => {
        this.userCount = users.length;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // Проверяем, загрузились ли все данные
    if (this.taskCount >= 0 && this.tagCount >= 0 && this.userCount >= 0) {
      this.isLoading = false;
    }
  }

  getDifficultyLabel(difficulty: string): string {
    return this.difficultyLabels[difficulty] || difficulty;
  }

  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty}`;
  }
}
