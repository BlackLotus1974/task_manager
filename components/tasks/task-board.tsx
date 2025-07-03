"use client";

import { Task, Project, User, STATUS_LABELS } from "@/lib/types";
import { TaskCard } from "./task-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TaskBoardProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
}

export function TaskBoard({ tasks }: TaskBoardProps) {
  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
    { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in_progress') },
    { id: 'done', title: 'Done', tasks: tasks.filter(t => t.status === 'done') },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <TaskCard key={task.id} task={task} />
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