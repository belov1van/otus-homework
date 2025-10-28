import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { TaskService } from '../../../services/task.service';
import { TagService } from '../../../services/tag.service';
import { Task } from '../../../models/task.model';
import { Tag } from '../../../models/tag.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId?: number;
  tags: Tag[] = [];
  isLoading = false;
  submitAttempted = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTags();
    
    // Проверяем, находимся ли мы в режиме редактирования
    this.route.paramMap.pipe(
      takeUntilDestroyed()
    ).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.loadTask(this.taskId);
      }
    });
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      difficulty: ['easy', Validators.required],
      inputExample: ['', Validators.required],
      outputExample: ['', Validators.required],
      tags: [[], Validators.required]
    });
  }

  loadTags(): void {
    this.tagService.getTags().pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (tags) => {
        this.tags = tags;
      },
      error: (error) => {
        console.error('Error loading tags', error);
      }
    });
  }

  loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getTask(id).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (task) => {
        if (task) {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            inputExample: task.inputExample,
            outputExample: task.outputExample,
            tags: task.tags
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitAttempted = true;
    
    if (this.taskForm.invalid) {
      return;
    }

    const taskData: Task = this.taskForm.value;
    
    if (this.isEditMode && this.taskId) {
      // Обновление существующей задачи
      taskData.id = this.taskId;
      this.taskService.updateTask(taskData).pipe(
        takeUntilDestroyed()
      ).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error updating task', error);
        }
      });
    } else {
      // Создание новой задачи
      this.taskService.createTask(taskData).pipe(
        takeUntilDestroyed()
      ).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error creating task', error);
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);
    
    if (!control || !control.errors || !this.submitAttempted) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'Это поле обязательно';
    }
    
    if (control.errors['minlength']) {
      return `Минимальная длина ${control.errors['minlength'].requiredLength} символов`;
    }
    
    return 'Некорректное значение';
  }
}
