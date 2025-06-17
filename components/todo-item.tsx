'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Trash2, 
  Calendar, 
  AlertCircle,
  Edit3,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Todo } from '@/types/todo';
import { format, isToday, isPast } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 150);
  };

  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
    medium: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  };

  const categoryEmojis = {
    personal: '👤',
    work: '💼',
    shopping: '🛒',
    health: '🏥',
    other: '📋',
  };

  const getDueDateColor = () => {
    if (!todo.dueDate) return '';
    if (isPast(todo.dueDate) && !todo.completed) return 'text-red-500';
    if (isToday(todo.dueDate)) return 'text-amber-500';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getDueDateText = () => {
    if (!todo.dueDate) return '';
    if (isToday(todo.dueDate)) return 'Due today';
    if (isPast(todo.dueDate) && !todo.completed) return 'Overdue';
    return `Due ${format(todo.dueDate, 'MMM d')}`;
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${
        isDeleting ? 'animate-out slide-out-to-right-full duration-150' : 'animate-in slide-in-from-left-1 duration-200'
      } ${
        todo.completed
          ? 'bg-white/40 dark:bg-gray-800/40 opacity-75'
          : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90'
      } backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              id={todo.id}
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium break-words ${
                    todo.completed
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`text-sm mt-1 break-words ${
                      todo.completed
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {todo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {todo.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge className={priorityColors[todo.priority]}>
                <AlertCircle className="w-3 h-3 mr-1" />
                {todo.priority}
              </Badge>

              <Badge variant="outline" className="text-xs">
                {categoryEmojis[todo.category]} {todo.category}
              </Badge>

              {todo.dueDate && (
                <Badge variant="outline" className={`text-xs ${getDueDateColor()}`}>
                  <Calendar className="w-3 h-3 mr-1" />
                  {getDueDateText()}
                </Badge>
              )}

              <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                {format(todo.createdAt, 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}