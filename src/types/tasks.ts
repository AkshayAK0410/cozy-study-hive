export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  tags?: string[];
  category?: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'created_at' | 'user_id'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;
