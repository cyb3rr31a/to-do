'use client';

import { TodoItem } from './todo-item';
import { Todo } from '@/types/todo';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filter: 'all' | 'active' | 'completed';
}

export function TodoList({ todos, onToggle, onDelete, filter }: TodoListProps) {
  if (todos.length === 0) {
    const emptyMessages = {
      all: {
        icon: Sparkles,
        title: "Welcome to TaskFlow!",
        message: "You don't have any tasks yet. Create your first task to get started.",
      },
      active: {
        icon: Clock,
        title: "All caught up!",
        message: "You don't have any active tasks. Time to add some goals!",
      },
      completed: {
        icon: CheckCircle,
        title: "No completed tasks yet",
        message: "Complete some tasks to see them here. You've got this!",
      },
    };

    const { icon: Icon, title, message } = emptyMessages[filter];

    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl mb-4">
          <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}