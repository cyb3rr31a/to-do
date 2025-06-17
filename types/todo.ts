export type Priority = 'low' | 'medium' | 'high';
export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'other';
export type Filter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completedToday: number;
}