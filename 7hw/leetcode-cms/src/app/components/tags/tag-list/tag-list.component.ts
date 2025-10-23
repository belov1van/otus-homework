import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TagService } from '../../../services/tag.service';
import { Tag } from '../../../models/tag.model';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss'
})
export class TagListComponent implements OnInit {
  tags: Tag[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  isLoading = true;

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.isLoading = true;
    this.tagService.getTags().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tags', error);
        this.isLoading = false;
      }
    });
  }

  deleteTag(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этот тег?')) {
      this.tagService.deleteTag(id).subscribe({
        next: () => {
          this.tags = this.tags.filter(tag => tag.id !== id);
        },
        error: (error) => {
          console.error('Error deleting tag', error);
        }
      });
    }
  }
}
