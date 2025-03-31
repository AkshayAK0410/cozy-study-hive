import { useState } from 'react';
import { useTasks } from '@/lib/TaskProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  Loader2,
  Plus,
  Tag,
  X
} from 'lucide-react';

type TaskFilter = {
  status: string[];
  priority: string[];
  category: string | null;
};

export function Tasks() {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<string>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFilter>({
    status: [],
    priority: [],
    category: null
  });

  const categories = Array.from(new Set(tasks.map(task => task.category).filter(Boolean)));

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask({
      title: newTaskTitle,
      status: 'todo',
      priority: newTaskPriority as 'low' | 'medium' | 'high',
      category: newTaskCategory || undefined,
      due_date: newTaskDueDate?.toISOString(),
    });
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setNewTaskCategory('');
    setNewTaskDueDate(null);
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    await updateTask(taskId, { status: newStatus });
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.category && task.category !== filters.category) return false;
    return true;
  });

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateTask} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What do you need to study?"
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            placeholder="Category"
            className="w-[120px]"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] pl-3 text-left font-normal">
                {newTaskDueDate ? (
                  format(newTaskDueDate, 'PPP')
                ) : (
                  <span>Due date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newTaskDueDate}
                onSelect={setNewTaskDueDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        {(filters.status.length > 0 || filters.priority.length > 0 || filters.category) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ status: [], priority: [], category: null })}
          >
            Clear filters
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <h4 className="font-medium">Status</h4>
            <div className="flex flex-wrap gap-2">
              {['todo', 'in_progress', 'completed'].map((status) => (
                <Badge
                  key={status}
                  variant={filters.status.includes(status) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      status: prev.status.includes(status)
                        ? prev.status.filter(s => s !== status)
                        : [...prev.status, status]
                    }));
                  }}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <Badge
                  key={priority}
                  variant={filters.priority.includes(priority) ? 'default' : 'outline'}
                  className={cn('cursor-pointer', filters.priority.includes(priority) ? '' : priorityColors[priority as keyof typeof priorityColors])}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      priority: prev.priority.includes(priority)
                        ? prev.priority.filter(p => p !== priority)
                        : [...prev.priority, priority]
                    }));
                  }}
                >
                  {priority}
                </Badge>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.category === category ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        category: prev.category === category ? null : category
                      }));
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-4 p-4 bg-card hover:bg-accent/50 rounded-lg transition-colors"
          >
            <button
              onClick={() => handleToggleStatus(task.id, task.status)}
              className="flex-shrink-0"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-medium truncate",
                  task.status === 'completed' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </span>
                <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {task.priority}
                </Badge>
                {task.category && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {task.category}
                  </Badge>
                )}
              </div>
              {task.due_date && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>Due {format(new Date(task.due_date), 'PPP')}</span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {tasks.length === 0 ? (
              "No tasks yet. Add your first task above!"
            ) : (
              "No tasks match your filters."
            )}
          </div>
        )}
      </div>
    </div>
  );
}
