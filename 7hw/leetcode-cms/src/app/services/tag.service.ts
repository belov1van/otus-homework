import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = 'api/tags'; // Предполагаемый URL API
  
  // Временные данные для разработки
  private mockTags: Tag[] = [
    {
      id: 1,
      name: 'Array',
      description: 'Problems involving arrays or lists',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Hash Table',
      description: 'Problems involving hash tables or dictionaries',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Linked List',
      description: 'Problems involving linked lists',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) { }

  getTags(): Observable<Tag[]> {
    // Для разработки используем моковые данные
    return of(this.mockTags);
    // Для реального API: return this.http.get<Tag[]>(this.apiUrl);
  }

  getTag(id: number): Observable<Tag | undefined> {
    const tag = this.mockTags.find(t => t.id === id);
    return of(tag);
    // Для реального API: return this.http.get<Tag>(`${this.apiUrl}/${id}`);
  }

  createTag(tag: Tag): Observable<Tag> {
    // Имитация создания тега
    const newTag = {
      ...tag,
      id: this.mockTags.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockTags.push(newTag);
    return of(newTag);
    // Для реального API: return this.http.post<Tag>(this.apiUrl, tag);
  }

  updateTag(tag: Tag): Observable<Tag> {
    // Имитация обновления тега
    const index = this.mockTags.findIndex(t => t.id === tag.id);
    if (index !== -1) {
      this.mockTags[index] = {
        ...tag,
        updatedAt: new Date()
      };
      return of(this.mockTags[index]);
    }
    return of(tag);
    // Для реального API: return this.http.put<Tag>(`${this.apiUrl}/${tag.id}`, tag);
  }

  deleteTag(id: number): Observable<void> {
    // Имитация удаления тега
    const index = this.mockTags.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTags.splice(index, 1);
    }
    return of(undefined);
    // Для реального API: return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
