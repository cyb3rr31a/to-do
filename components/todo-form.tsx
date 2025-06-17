'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Priority, Category } from '@/types/todo';

interface TodoFormProps {
  onAdd: (
    title: string,
    description?: string,
    priority?: Priority,
    category?: Category,
    dueDate?: Date
  ) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    onAdd(title, description || undefined, priority, category, dueDateObj);
    
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('personal');
    setDueDate('');
    setIsExpanded(false);
  };

  const priorityColors = {
    low: 'text-emerald-600',
    medium: 'text-amber-600',
    high: 'text-red-600',
  };

  const categoryIcons = {
    personal: '👤',
    work: '💼',
    shopping: '🛒',
    health: '🏥',
    other: '📋',
  };

  return (
    <Card className="mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plus className="w-5 h-5 text-blue-500" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg h-12 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              onFocus={() => setIsExpanded(true)}
            />
          </div>

          {isExpanded && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add more details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Priority
                  </Label>
                  <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                    <SelectTrigger className="mt-1 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <span className={priorityColors.low}>● Low</span>
                      </SelectItem>
                      <SelectItem value="medium">
                        <span className={priorityColors.medium}>● Medium</span>
                      </SelectItem>
                      <SelectItem value="high">
                        <span className={priorityColors.high}>● High</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </Label>
                  <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
                    <SelectTrigger className="mt-1 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryIcons).map(([key, icon]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            {icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            {isExpanded && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
                className="px-4"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}