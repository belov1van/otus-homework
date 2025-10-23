export interface Task {
  id?: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  inputExample: string;
  outputExample: string;
  tags: number[];
  createdAt?: Date;
  updatedAt?: Date;
}