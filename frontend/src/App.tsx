import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  taskService,
  type Task,
  type CreateTaskData,
} from "@/services/taskService";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
  });
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load tasks";
      toast({
        variant: "destructive",
        title: "Error fetching tasks",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskService.createTask(formData);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      setIsCreateOpen(false);
      setFormData({ title: "", description: "" });
      fetchTasks();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create task";
      toast({
        variant: "destructive",
        title: "Error creating task",
        description: message,
      });
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask) return;
    try {
      await taskService.updateTask(currentTask.id, formData);
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setIsEditOpen(false);
      setCurrentTask(null);
      setFormData({ title: "", description: "" });
      fetchTasks();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update task";
      toast({
        variant: "destructive",
        title: "Error updating task",
        description: message,
      });
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      fetchTasks();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete task";
      toast({
        variant: "destructive",
        title: "Error deleting task",
        description: message,
      });
    }
  };

  const handleToggleStatus = async (id: number, completed: boolean) => {
    try {
      await taskService.toggleTaskStatus(id, completed);
      fetchTasks();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to toggle task status";
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: message,
      });
    }
  };

  const openEditDialog = (task: Task) => {
    setCurrentTask(task);
    setFormData({ title: task.title, description: task.description || "" });
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Task Manager
          </h1>
          <Button onClick={() => setIsCreateOpen(true)} className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex h-40 flex-col items-center justify-center">
              <p className="text-muted-foreground">
                No tasks found. Create one to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={`${task.completed ? "bg-slate-50/50" : "bg-white"} shadow-sm transition-colors`}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                  <div className="flex flex-1 items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full ${task.completed ? "text-green-600" : "text-slate-400"}`}
                      onClick={() =>
                        handleToggleStatus(task.id, !task.completed)
                      }
                      title={
                        task.completed
                          ? "Mark as incomplete"
                          : "Mark as completed"
                      }
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </Button>
                    <div className="space-y-1">
                      <CardTitle
                        className={`text-lg font-semibold ${task.completed ? "text-slate-400 line-through" : "text-slate-900"}`}
                      >
                        {task.title}
                      </CardTitle>
                      {task.description && (
                        <CardDescription
                          className={`${task.completed ? "text-slate-300 line-through" : "text-slate-600"}`}
                        >
                          {task.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(task)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-8 w-8 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a title and description for your task.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Finish the report..."
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Include the financial summary"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update your task details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTask} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
