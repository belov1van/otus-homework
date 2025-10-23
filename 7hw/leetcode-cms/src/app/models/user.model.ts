export interface User {
  id?: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}