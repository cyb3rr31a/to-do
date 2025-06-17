'use client';

import { Calendar, CheckSquare, Trophy, Target } from 'lucide-react';
import { TodoStats } from '@/types/todo';

interface TodoHeaderProps {
  stats: TodoStats;
}

export function TodoHeader({ stats }: TodoHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
          <CheckSquare className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your day, achieve your goals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Done
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completed}
          </p>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Active
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.active}
          </p>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Today
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completedToday}
          </p>
        </div>
      </div>
    </div>
  );
}