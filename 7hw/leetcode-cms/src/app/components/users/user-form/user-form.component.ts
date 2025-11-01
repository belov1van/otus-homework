import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId!: number;
  isLoading = false;
  submitAttempted = false;
  roles = [
    { value: 'admin', label: 'Администратор' },
    { value: 'moderator', label: 'Модератор' },
    { value: 'user', label: 'Пользователь' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.pipe(
      takeUntilDestroyed()
    ).subscribe((params: any) => {
      if (params['id']) {
        this.userId = +params['id'];
        this.loadUser(this.userId);
      } else {
        this.router.navigate(['/users']);
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      role: ['', Validators.required]
    });
  }

  loadUser(id: number): void {
    this.isLoading = true;
    this.userService.getUser(id).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (user: User | undefined) => {
        if (user) {
          this.userForm.patchValue({
            role: user.role
          });
        } else {
          console.error('User not found');
          this.router.navigate(['/users']);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user', error);
        this.isLoading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    this.submitAttempted = true;
    
    if (this.userForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.userService.getUser(this.userId).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (user: User | undefined) => {
        if (user) {
          const updatedUser: User = {
            ...user,
            role: this.userForm.value.role
          };
          
          this.userService.updateUser(updatedUser).pipe(
            takeUntilDestroyed()
          ).subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/users']);
            },
            error: (error: any) => {
              console.error('Error updating user', error);
              this.isLoading = false;
            }
          });
        } else {
          console.error('User not found');
          this.isLoading = false;
          this.router.navigate(['/users']);
        }
      },
      error: (error: any) => {
        console.error('Error loading user', error);
        this.isLoading = false;
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    
    if (!control || !control.errors || !this.submitAttempted) {
      return '';
    }

    if (control.errors['required']) {
      return 'Это поле обязательно';
    }

    return 'Неверное значение';
  }
}
