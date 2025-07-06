"use client";

import { Task, Project, User } from "@/lib/types";
import { InlineStatusEditor } from "./inline-status-editor";
import { InlineDateEditor } from "./inline-date-editor";

interface TaskRowProps {
  task: Task;
  onStatusChange: (taskId: string, deleted: boolean) => void;
  projects: Project[];
  users: User[];
  color?: string;
}

export function TaskRow({ task, onStatusChange, projects, users, color }: TaskRowProps) {
  return (
    <div key={task.id} className="task-row">
      <div className="task-grid task-grid-layout">
        <div className="task-name">
          <i className="fa-circle-check">☐</i>
          <span>{task.title}</span>
        </div>
        <div className="task-avatar">
          {task.assignees && task.assignees.length > 0
            ? task.assignees[0].full_name?.charAt(0) || '?'
            : '-'}
        </div>
        <div>
          <InlineStatusEditor task={task} onStatusChange={onStatusChange} />
        </div>
        <div>
          <InlineDateEditor task={task} color={color} />
        </div>
        <div>
          {task.project_id
            ? projects.find((p) => p.id === task.project_id)?.name || 'Unknown'
            : '-'}
        </div>
      </div>
    </div>
  );
} 