import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'api/tasks'; // Предполагаемый URL API
  
  // Временные данные для разработки
  private mockTasks: Task[] = [
    {
      id: 1,
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'easy',
      inputExample: 'nums = [2,7,11,15], target = 9',
      outputExample: '[0,1]',
      tags: [1, 2],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'Add Two Numbers',
      description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.',
      difficulty: 'medium',
      inputExample: 'l1 = [2,4,3], l2 = [5,6,4]',
      outputExample: '[7,0,8]',
      tags: [2, 3],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    // Для разработки используем моковые данные
    return of(this.mockTasks);
    // Для реального API: return this.http.get<Task[]>(this.apiUrl);
  }

  getTask(id: number): Observable<Task | undefined> {
    const task = this.mockTasks.find(t => t.id === id);
    return of(task);
    // Для реального API: return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    // Имитация создания задачи
    const newTask = {
      ...task,
      id: this.mockTasks.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockTasks.push(newTask);
    return of(newTask);
    // Для реального API: return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(task: Task): Observable<Task> {
    // Имитация обновления задачи
    const index = this.mockTasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.mockTasks[index] = {
        ...task,
        updatedAt: new Date()
      };
      return of(this.mockTasks[index]);
    }
    return of(task);
    // Для реального API: return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    // Имитация удаления задачи
    const index = this.mockTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTasks.splice(index, 1);
    }
    return of(undefined);
    // Для реального API: return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
