'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo, Priority, Category, Filter, TodoStats } from '@/types/todo';

const STORAGE_KEY = 'taskflow-todos';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error('Failed to save todos to localStorage:', error);
      }
    }
  }, [todos, loading]);

  const addTodo = (
    title: string,
    description?: string,
    priority: Priority = 'medium',
    category: Category = 'personal',
    dueDate?: Date
  ) => {
    const newTodo: Todo = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      priority,
      category,
      createdAt: new Date(),
      dueDate,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date() : undefined,
            }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // Calculate statistics
  const stats: TodoStats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    active: todos.filter((todo) => !todo.completed).length,
    completedToday: todos.filter((todo) => {
      if (!todo.completedAt) return false;
      const today = new Date();
      const completedDate = new Date(todo.completedAt);
      return (
        completedDate.getDate() === today.getDate() &&
        completedDate.getMonth() === today.getMonth() &&
        completedDate.getFullYear() === today.getFullYear()
      );
    }).length,
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    loading,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
  };
}