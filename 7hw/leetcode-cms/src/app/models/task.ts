export interface Task {
  id?: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  inputExamples: string[];
  outputExamples: string[];
  tags: number[];
  createdAt?: Date;
  updatedAt?: Date;
}
