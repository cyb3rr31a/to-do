'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from '@/types/todo';
import { List, Clock, CheckCircle, Trash2 } from 'lucide-react';

interface TodoFiltersProps {
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export function TodoFilters({
  currentFilter,
  onFilterChange,
  onClearCompleted,
  stats,
}: TodoFiltersProps) {
  const filters = [
    { key: 'all' as Filter, label: 'All', icon: List, count: stats.total },
    { key: 'active' as Filter, label: 'Active', icon: Clock, count: stats.active },
    { key: 'completed' as Filter, label: 'Completed', icon: CheckCircle, count: stats.completed },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex gap-2 flex-wrap">
        {filters.map(({ key, label, icon: Icon, count }) => (
          <Button
            key={key}
            variant={currentFilter === key ? 'default' : 'ghost'}
            onClick={() => onFilterChange(key)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              currentFilter === key
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <Badge
              variant="secondary"
              className={`ml-1 ${
                currentFilter === key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {stats.completed > 0 && (
        <Button
          variant="outline"
          onClick={onClearCompleted}
          className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
          Clear Completed
        </Button>
      )}
    </div>
  );
}