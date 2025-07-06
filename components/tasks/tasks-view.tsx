"use client";

import { Task, Project, User } from "@/lib/types";
import { TaskBoard } from "./task-board";
import { formatDate } from "@/lib/utils";
import { InlineStatusEditor } from "./inline-status-editor";
import { InlineDateEditor } from "./inline-date-editor";
import { useState } from "react";
import Link from "next/link";

interface TasksViewProps {
  tasks: Task[];
  view: 'list' | 'board';
  projects: Project[];
  users: User[];
}

interface TaskRowProps {
  task: Task;
  onStatusChange: (taskId: string, deleted: boolean) => void;
  projects: Project[];
  users: User[];
  color?: string;
}

// A dedicated component to ensure consistent rendering for each task row
function TaskRow({ task, onStatusChange, projects, users, color }: TaskRowProps) {
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

export function TasksView({ tasks: initialTasks, view, projects, users }: TasksViewProps) {
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
  if (view === 'board') {
    return <TaskBoard tasks={tasks} projects={projects} users={users} />;
  }

  // Group tasks by status/priority for the new design
  const now = new Date();
  const overdueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < now && task.status !== 'done'
  );
  const todayTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate.toDateString() === now.toDateString() && task.status !== 'done';
  });
  const otherTasks = tasks.filter(task => 
    !overdueTasks.includes(task) && !todayTasks.includes(task)
  );

  return (
    <div>
      {/* Task Header */}
      <div className="task-grid task-grid-layout task-header">
        <div>Task</div>
        <div>Person</div>
        <div>Status</div>
        <div>Due Date</div>
        <div>Project</div>
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="task-group overdue">
          <div className="group-title">
            <span>🔴 Overdue</span>
            <span className="item-count">({overdueTasks.length})</span>
          </div>
          {overdueTasks.map((task) => (
            <TaskRow 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange} 
              projects={projects} 
              users={users} 
              color="var(--urgent-red)" 
            />
          ))}
        </div>
      )}

      {/* Today Tasks */}
      {todayTasks.length > 0 && (
        <div className="task-group today">
          <div className="group-title">
            <span>🟢 Today</span>
            <span className="item-count">({todayTasks.length})</span>
          </div>
          {todayTasks.map((task) => (
            <TaskRow 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange} 
              projects={projects} 
              users={users} 
              color="var(--today-green)" 
            />
          ))}
        </div>
      )}

      {/* Other Tasks */}
      {otherTasks.length > 0 && (
        <div className="task-group">
          <div className="group-title">
            <span>📋 Other Tasks</span>
            <span className="item-count">({otherTasks.length})</span>
          </div>
          {otherTasks.map((task) => (
            <TaskRow 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange} 
              projects={projects} 
              users={users} 
            />
          ))}
        </div>
      )}

      {/* Add Task Row */}
      <Link href="/dashboard/tasks/new" className="add-task" style={{ textDecoration: 'none' }}>
        <i>➕</i>
        <span>Add new task</span>
      </Link>

      {/* No tasks message */}
      {tasks.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-secondary)'
        }}>
          <p>No tasks found. Create your first task!</p>
        </div>
      )}
    </div>
  );
} 