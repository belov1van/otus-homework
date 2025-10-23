import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TagService } from '../../../services/tag.service';
import { Tag } from '../../../models/tag.model';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tag-form.component.html',
  styleUrl: './tag-form.component.scss'
})
export class TagFormComponent implements OnInit {
  tagForm!: FormGroup;
  isEditMode = false;
  tagId?: number;
  isLoading = false;
  submitAttempted = false;

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEditMode = true;
        this.tagId = +params['id'];
        this.loadTag(this.tagId);
      }
    });
  }

  initForm(): void {
    this.tagForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)]
    });
  }

  loadTag(id: number): void {
    this.isLoading = true;
    this.tagService.getTag(id).subscribe({
      next: (tag) => {
        if (tag) {
          this.tagForm.patchValue({
            name: tag.name,
            description: tag.description
          });
        } else {
          console.error('Tag not found');
          this.router.navigate(['/tags']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tag', error);
        this.isLoading = false;
        this.router.navigate(['/tags']);
      }
    });
  }

  onSubmit(): void {
    this.submitAttempted = true;
    
    if (this.tagForm.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.tagId) {
      this.tagService.getTag(this.tagId).subscribe({
        next: (existingTag) => {
          if (existingTag) {
            const updatedTag: Tag = {
              ...existingTag,
              name: this.tagForm.value.name,
              description: this.tagForm.value.description
            };
            
            this.tagService.updateTag(updatedTag).subscribe({
              next: () => {
                this.isLoading = false;
                this.router.navigate(['/tags']);
              },
              error: (error) => {
                console.error('Error updating tag', error);
                this.isLoading = false;
              }
            });
          } else {
            console.error('Tag not found');
            this.isLoading = false;
            this.router.navigate(['/tags']);
          }
        },
        error: (error) => {
          console.error('Error loading tag', error);
          this.isLoading = false;
        }
      });
    } else {
      // Для создания нового тега
      const newTag: Tag = {
        id: 0, // Будет заменено в сервисе
        name: this.tagForm.value.name,
        description: this.tagForm.value.description || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.tagService.createTag(newTag).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/tags']);
        },
        error: (error) => {
          console.error('Error creating tag', error);
          this.isLoading = false;
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.tagForm.get(controlName);
    
    if (!control || !control.errors || !this.submitAttempted) {
      return '';
    }

    if (control.errors['required']) {
      return 'Это поле обязательно';
    }

    if (control.errors['maxlength']) {
      return `Максимальная длина ${control.errors['maxlength'].requiredLength} символов`;
    }

    return 'Неверное значение';
  }
}
