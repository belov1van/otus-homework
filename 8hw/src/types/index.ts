// Типы для задач
export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  examples: Example[];
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

// Типы для пользователей
export interface User {
  id: string;
  username: string;
  email: string;
  rating: number;
  solvedProblems: string[];
}

// Типы для тегов и категорий
export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  problems: string[];
}