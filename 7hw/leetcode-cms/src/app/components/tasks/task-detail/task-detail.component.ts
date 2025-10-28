import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { TaskService } from '../../../services/task.service';
import { TagService } from '../../../services/tag.service';
import { Task } from '../../../models/task.model';
import { Tag } from '../../../models/tag.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  task?: Task;
  tags: Tag[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadTask(+id);
        } else {
          this.router.navigate(['/tasks']);
        }
      });
  }

  loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getTask(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (task) => {
          this.task = task;
          if (task && task.tags) {
            this.loadTagDetails(task.tags);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading task', error);
          this.isLoading = false;
          this.router.navigate(['/tasks']);
        }
      });
  }

  loadTagDetails(tagIds: number[]): void {
    this.tagService.getTags()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (allTags) => {
          this.tags = allTags.filter(tag => tagIds.includes(tag.id!));
        },
        error: (error) => {
          console.error('Error loading tags', error);
        }
      });
  }

  private readonly difficultyLabels: { [key: string]: string } = {
    'easy': 'Легкая',
    'medium': 'Средняя',
    'hard': 'Сложная'
  };

  getDifficultyLabel(difficulty: string): string {
    return this.difficultyLabels[difficulty] || difficulty;
  }

  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty}`;
  }

  deleteTask(): void {
    if (this.task && this.task.id && confirm('Вы уверены, что хотите удалить эту задачу?')) {
      this.taskService.deleteTask(this.task.id)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Error deleting task', error);
          }
        });
    }
  }
}
