"use client";

import { useState } from "react";
import { Task, Project, User } from "@/lib/types";
import { TaskCard } from "./task-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TaskBoardProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
}

export function TaskBoard({ tasks: initialTasks, projects, users }: TaskBoardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _projects = projects;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _users = users;
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleStatusChange = (taskId: string, deleted: boolean) => {
    if (deleted) {
      // Remove task from the list when it's marked as done (deleted)
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } else {
      // Refresh task data (could be improved with optimistic updates)
      window.location.reload(); // Simple refresh for now
    }
  };

  const columns = [
    { id: 'urgent', title: 'Urgent', tasks: tasks.filter(t => t.status === 'urgent') },
    { id: 'priority_2', title: 'Priority 2', tasks: tasks.filter(t => t.status === 'priority_2') },
    { id: 'priority_3', title: 'Priority 3', tasks: tasks.filter(t => t.status === 'priority_3') },
    { id: 'done', title: 'Done', tasks: tasks.filter(t => t.status === 'done') },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {columns.map((column) => (
        <Card key={column.id} className="min-h-[500px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {column.title}
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                {column.tasks.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
            ))}
            {column.tasks.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No tasks
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 