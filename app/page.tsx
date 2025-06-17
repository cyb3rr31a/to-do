'use client';

import { useTodos } from '@/hooks/use-todos';
import { TodoHeader } from '@/components/todo-header';
import { TodoForm } from '@/components/todo-form';
import { TodoFilters } from '@/components/todo-filters';
import { TodoList } from '@/components/todo-list';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const {
    todos,
    filter,
    setFilter,
    loading,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  const handleAddTodo = (
    title: string,
    description?: string,
    priority?: any,
    category?: any,
    dueDate?: Date
  ) => {
    addTodo(title, description, priority, category, dueDate);
    toast.success('Task added successfully!');
  };

  const handleToggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    toggleTodo(id);
    if (todo) {
      toast.success(todo.completed ? 'Task marked as active' : 'Task completed! 🎉');
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    toast.success('Task deleted');
  };

  const handleClearCompleted = () => {
    clearCompleted();
    toast.success('Completed tasks cleared');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading TaskFlow...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <TodoHeader stats={stats} />
        <TodoForm onAdd={handleAddTodo} />
        <TodoFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
          stats={stats}
        />
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          filter={filter}
        />
      </div>
    </div>
  );
}