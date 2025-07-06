"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Project, User, PRIORITY_LABELS, STATUS_LABELS, Task } from "@/lib/types";
import { createTaskAction } from "@/lib/actions/tasks";
import { useUndo } from "@/contexts/undo-context";

interface CreateTaskFormProps {
  projects: Project[];
  users: User[];
}

export function CreateTaskForm({ projects, users }: CreateTaskFormProps) {
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
        router.push("/dashboard/tasks");
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

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="What needs to be done?"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add more details about this task..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md mt-1"
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
                  className="w-full px-3 py-2 border border-input bg-background rounded-md mt-1"
                >
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="project_id">Project</Label>
              <select
                id="project_id"
                value={formData.project_id}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md mt-1"
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
                className="w-full px-3 py-2 border border-input bg-background rounded-md mt-1 h-24"
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

            <div className="flex justify-end space-x-3">
              <Link href="/dashboard/tasks">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading || !formData.title.trim()}>
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 