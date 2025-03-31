import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/tasks';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  createTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, task: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const getTasks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskInput: CreateTaskInput) => {
    if (!user) throw new Error('Must be logged in to create tasks');

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          ...taskInput,
          user_id: user.id,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      toast.success('Task created successfully');
      await getTasks(); // Refresh task list
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (id: string, taskInput: UpdateTaskInput) => {
    if (!user) throw new Error('Must be logged in to update tasks');

    try {
      const { error } = await supabase
        .from('tasks')
        .update(taskInput)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Task updated successfully');
      await getTasks(); // Refresh task list
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete tasks');

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Task deleted successfully');
      await getTasks(); // Refresh task list
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  // Fetch tasks when user changes
  useEffect(() => {
    getTasks();
  }, [user]);

  const value = {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    getTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
