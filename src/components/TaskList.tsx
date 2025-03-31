
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, X, Clock, CheckCheck, ListTodo, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Task, getTasks, saveTask, deleteTask, updateTaskCompletion } from "@/lib/timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskListProps {
  onSelectTask?: (task: Task) => void;
  selectedTaskId?: string | null;
}

const TaskList = ({ onSelectTask, selectedTaskId }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPomodoros, setNewTaskPomodoros] = useState("1");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPomodoros, setEditPomodoros] = useState("1");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    const pomodoros = parseInt(newTaskPomodoros);
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date(),
      estimatedPomodoros: pomodoros,
      completedPomodoros: 0,
    };

    saveTask(newTask);
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskPomodoros("1");
    setShowAddTask(false);
    toast.success("Task added successfully");
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTaskCompletion(taskId, completed);
    
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed } : task
      )
    );

    if (completed) {
      toast.success("Task marked as completed");
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("Task deleted");
    
    // If the selected task is deleted, clear selection
    if (selectedTaskId === taskId && onSelectTask) {
      onSelectTask(null as any);
    }
  };

  const startEditTask = (task: Task) => {
    setIsEditing(task.id);
    setEditTitle(task.title);
    setEditPomodoros(task.estimatedPomodoros.toString());
  };

  const saveEditTask = (taskId: string) => {
    if (!editTitle.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    const updatedTask = tasks.find((t) => t.id === taskId);
    if (!updatedTask) return;

    const editedTask: Task = {
      ...updatedTask,
      title: editTitle.trim(),
      estimatedPomodoros: parseInt(editPomodoros),
    };

    saveTask(editedTask);
    
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? editedTask : task))
    );
    
    setIsEditing(null);
    toast.success("Task updated");
    
    // Update selected task if it was edited
    if (selectedTaskId === taskId && onSelectTask) {
      onSelectTask(editedTask);
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  const handleSelectTask = (task: Task) => {
    if (onSelectTask) {
      onSelectTask(selectedTaskId === task.id ? null as any : task);
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <Card className="w-full shadow-soft animate-fade-in glass-effect">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            <ListTodo className="mr-2 h-5 w-5" />
            Tasks
          </CardTitle>
          <div className="flex space-x-2">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as any)}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => setShowAddTask(true)}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {filter === "all" ? (
              <p>No tasks yet. Add your first task to get started.</p>
            ) : (
              <p>No {filter} tasks found.</p>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <li key={task.id}>
                <div
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                    selectedTaskId === task.id
                      ? "bg-primary/10 border border-primary/20"
                      : "border border-border hover:border-primary/20 hover:bg-accent/50"
                  }`}
                >
                  {isEditing === task.id ? (
                    // Edit mode
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full"
                        placeholder="Task title"
                      />
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`edit-pomodoros-${task.id}`} className="text-xs whitespace-nowrap">
                          Pomodoros:
                        </Label>
                        <Select
                          value={editPomodoros}
                          onValueChange={setEditPomodoros}
                        >
                          <SelectTrigger
                            id={`edit-pomodoros-${task.id}`}
                            className="w-24 h-8"
                          >
                            <SelectValue placeholder="Pomodoros" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex space-x-2 ml-auto">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                            className="h-8 px-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveEditTask(task.id)}
                            className="h-8 px-2"
                          >
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={(checked) =>
                          handleToggleComplete(task.id, checked as boolean)
                        }
                        className="mr-2"
                      />
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleSelectTask(task)}
                      >
                        <div
                          className={`font-medium ${
                            task.completed ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditTask(task)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTask(task.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task to track your work.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What do you need to accomplish?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated-pomodoros">Estimated Pomodoros</Label>
              <Select
                value={newTaskPomodoros}
                onValueChange={setNewTaskPomodoros}
              >
                <SelectTrigger id="estimated-pomodoros">
                  <SelectValue placeholder="Estimated Pomodoros" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} pomodoro{num !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskList;
