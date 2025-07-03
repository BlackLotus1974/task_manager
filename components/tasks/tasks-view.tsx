"use client";

import { Task, Project, User } from "@/lib/types";
import { TaskCard } from "./task-card";
import { TaskBoard } from "./task-board";

interface TasksViewProps {
  tasks: Task[];
  view: 'list' | 'board';
  projects: Project[];
  users: User[];
}

export function TasksView({ tasks, view, projects, users }: TasksViewProps) {
  if (view === 'board') {
    return <TaskBoard tasks={tasks} projects={projects} users={users} />;
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
} 