"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project, User, PRIORITY_LABELS, STATUS_LABELS, Task } from "@/lib/types";
import { createTaskAction } from "@/lib/actions/tasks";
import { useUndo } from "@/contexts/undo-context";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  users: User[];
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projects,
  users,
}: CreateTaskDialogProps) {
  const router = useRouter();
  const { addUndoAction } = useUndo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "priority_3" as Task['status'],
    priority: 2 as 1 | 2 | 3 | 4,
    due_date: "",
    project_id: "",
    assignee_ids: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await createTaskAction({
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
        project_id: formData.project_id || undefined,
        assignee_ids: formData.assignee_ids,
      });
      
      if (result.success && result.task) {
        addUndoAction({ type: 'create', task: result.task });
        setFormData({
          title: "",
          description: "",
          status: "priority_3",
          priority: 2,
          due_date: "",
          project_id: "",
          assignee_ids: [],
        });
        onOpenChange(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to create task");
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      setError("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Task title..."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) as 1 | 2 | 3 | 4 }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="project_id">Project</Label>
            <select
              id="project_id"
              value={formData.project_id}
              onChange={(e) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="assignees">Assign To</Label>
            <select
              id="assignees"
              multiple
              value={formData.assignee_ids}
              onChange={(e) => {
                const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, assignee_ids: selectedIds }))
              }}
              className="w-full px-3 py-2 border border-input bg-background rounded-md h-20"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.email}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Hold Ctrl or Cmd to select multiple users.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 