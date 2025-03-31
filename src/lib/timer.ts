import { toast } from "sonner";

export type TimerMode = 'work' | 'break' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeRemaining: number;
  initialTime: number;
  isRunning: boolean;
  completedSessions: number;
  totalSessions: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  estimatedPomodoros: number;
  completedPomodoros: number;
  tags?: string[]; // Add tags property as optional string array
}

export interface StudySession {
  id: string;
  date: Date;
  duration: number;
  mode: TimerMode;
  taskId?: string;
}

// Helper to format time for display
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Play notification sounds
export function playSound(soundType: 'start' | 'finish' | 'tick'): void {
  // In a real app, this would play actual sounds
  console.log(`Playing ${soundType} sound`);
  
  // Mock sound behavior
  if (soundType === 'finish') {
    toast("Time's up!", {
      description: "Your session has completed.",
      duration: 5000,
    });
  }
}

// Save a completed study session to storage
export function saveSession(session: StudySession): void {
  const sessionsJson = localStorage.getItem('study_sessions');
  let sessions: StudySession[] = [];
  
  if (sessionsJson) {
    try {
      sessions = JSON.parse(sessionsJson);
    } catch (error) {
      console.error('Error parsing sessions', error);
    }
  }
  
  sessions.push(session);
  localStorage.setItem('study_sessions', JSON.stringify(sessions));
}

// Get all study sessions from storage
export function getSessions(): StudySession[] {
  const sessionsJson = localStorage.getItem('study_sessions');
  if (!sessionsJson) return [];
  
  try {
    return JSON.parse(sessionsJson);
  } catch (error) {
    console.error('Error parsing sessions', error);
    return [];
  }
}

// Calculate stats from sessions
export function calculateStats(sessions: StudySession[]): { 
  totalTime: number; 
  totalSessions: number;
  streakDays: number;
  averageSessionTime: number;
} {
  if (!sessions.length) {
    return { totalTime: 0, totalSessions: 0, streakDays: 0, averageSessionTime: 0 };
  }
  
  // Calculate total time
  const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  
  // Count work sessions
  const workSessions = sessions.filter(s => s.mode === 'work').length;
  
  // Calculate streak days
  const uniqueDays = new Set<string>();
  const dayFormat = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  sessions.forEach(session => {
    uniqueDays.add(dayFormat.format(new Date(session.date)));
  });
  
  // Count consecutive days (this is simplified - a real app would do more)
  const streakDays = uniqueDays.size;
  
  // Average session time
  const averageSessionTime = workSessions ? Math.round(totalTime / workSessions) : 0;
  
  return {
    totalTime,
    totalSessions: workSessions,
    streakDays,
    averageSessionTime
  };
}

// Save a task to storage
export function saveTask(task: Task): void {
  const tasksJson = localStorage.getItem('tasks');
  let tasks: Task[] = [];
  
  if (tasksJson) {
    try {
      tasks = JSON.parse(tasksJson);
    } catch (error) {
      console.error('Error parsing tasks', error);
    }
  }
  
  // Check if task exists and update it, otherwise add it
  const index = tasks.findIndex(t => t.id === task.id);
  if (index >= 0) {
    tasks[index] = task;
  } else {
    tasks.push(task);
  }
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get all tasks from storage
export function getTasks(): Task[] {
  const tasksJson = localStorage.getItem('tasks');
  if (!tasksJson) return [];
  
  try {
    return JSON.parse(tasksJson);
  } catch (error) {
    console.error('Error parsing tasks', error);
    return [];
  }
}

// Delete a task from storage
export function deleteTask(taskId: string): void {
  const tasksJson = localStorage.getItem('tasks');
  if (!tasksJson) return;
  
  try {
    const tasks: Task[] = JSON.parse(tasksJson);
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error deleting task', error);
  }
}

// Update a task's completion status
export function updateTaskCompletion(taskId: string, completed: boolean): void {
  const tasksJson = localStorage.getItem('tasks');
  if (!tasksJson) return;
  
  try {
    const tasks: Task[] = JSON.parse(tasksJson);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex >= 0) {
      tasks[taskIndex].completed = completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  } catch (error) {
    console.error('Error updating task', error);
  }
}

// Increment completed pomodoros for a task
export function incrementTaskPomodoros(taskId: string): void {
  const tasksJson = localStorage.getItem('tasks');
  if (!tasksJson) return;
  
  try {
    const tasks: Task[] = JSON.parse(tasksJson);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex >= 0) {
      tasks[taskIndex].completedPomodoros += 1;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  } catch (error) {
    console.error('Error updating task pomodoros', error);
  }
}
