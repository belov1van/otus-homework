import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'api/users'; // Предполагаемый URL API
  
  // Временные данные для разработки
  private mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      username: 'user1',
      email: 'user1@example.com',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      username: 'user2',
      email: 'user2@example.com',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    // Для разработки используем моковые данные
    return of(this.mockUsers);
    // Для реального API: return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User | undefined> {
    const user = this.mockUsers.find(u => u.id === id);
    return of(user);
    // Для реального API: return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    // Имитация обновления пользователя
    const index = this.mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.mockUsers[index] = {
        ...user,
        updatedAt: new Date()
      };
      return of(this.mockUsers[index]);
    }
    return of(user);
    // Для реального API: return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }
}
