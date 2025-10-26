import axios from 'axios';
import { Problem, User, Tag, Category } from '../types';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API для задач
export const problemsApi = {
  getAll: () => api.get<Problem[]>('/problems'),
  getById: (id: string) => api.get<Problem>(`/problems/${id}`),
  create: (problem: Omit<Problem, 'id'>) => api.post<Problem>('/problems', problem),
  update: (id: string, problem: Partial<Problem>) => api.put<Problem>(`/problems/${id}`, problem),
  delete: (id: string) => api.delete(`/problems/${id}`),
};

// API для пользователей
export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  updateRating: (id: string, rating: number) => api.patch<User>(`/users/${id}/rating`, { rating }),
};

// API для тегов
export const tagsApi = {
  getAll: () => api.get<Tag[]>('/tags'),
  create: (tag: Omit<Tag, 'id'>) => api.post<Tag>('/tags', tag),
  update: (id: string, tag: Partial<Tag>) => api.put<Tag>(`/tags/${id}`, tag),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

// API для категорий
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (category: Omit<Category, 'id'>) => api.post<Category>('/categories', category),
  update: (id: string, category: Partial<Category>) => api.put<Category>(`/categories/${id}`, category),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export default api;