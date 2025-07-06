"use client";

import { Task, Project, User } from "@/lib/types";
import { TaskBoard } from "./task-board";
import { formatDate } from "@/lib/utils";

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
      <div className="task-grid task-header">
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
            <div key={task.id} className="task-row">
              <div className="task-grid">
                <div className="task-name">
                  <i className="fa-circle-check">☐</i>
                  <span>{task.title}</span>
                </div>
                <div className="task-avatar">
                  {task.assignees && task.assignees.length > 0 ? (
                    task.assignees[0].full_name?.charAt(0) || '?'
                  ) : '-'}
                </div>
                <div>
                  <span className={`status ${task.status === 'done' ? 'priority-3' : task.priority === 4 ? 'urgent' : 'priority-3'}`}>
                    {task.status === 'done' ? 'Done' :
                     task.status === 'in_progress' ? 'Working on it' : 'Stuck'}
                  </span>
                </div>
                <div style={{color: 'var(--urgent-red)'}}>
                  {task.due_date ? formatDate(task.due_date) : '-'}
                </div>
                <div>
                  {task.project_id ? 
                    projects.find(p => p.id === task.project_id)?.name || 'Unknown' : 
                    '-'
                  }
                </div>
              </div>
            </div>
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
            <div key={task.id} className="task-row">
              <div className="task-grid">
                <div className="task-name">
                  <i className="fa-circle-check">☐</i>
                  <span>{task.title}</span>
                </div>
                <div className="task-avatar">
                  {task.assignees && task.assignees.length > 0 ? (
                    task.assignees[0].full_name?.charAt(0) || '?'
                  ) : '-'}
                </div>
                <div>
                  <span className={`status ${task.status === 'done' ? 'priority-3' : task.priority === 4 ? 'urgent' : 'priority-3'}`}>
                    {task.status === 'done' ? 'Done' :
                     task.status === 'in_progress' ? 'Working on it' : 'Stuck'}
                  </span>
                </div>
                <div style={{color: 'var(--today-green)'}}>
                  {task.due_date ? formatDate(task.due_date) : '-'}
                </div>
                <div>
                  {task.project_id ? 
                    projects.find(p => p.id === task.project_id)?.name || 'Unknown' : 
                    '-'
                  }
                </div>
              </div>
            </div>
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
            <div key={task.id} className="task-row">
              <div className="task-grid">
                <div className="task-name">
                  <i className="fa-circle-check">☐</i>
                  <span>{task.title}</span>
                </div>
                <div className="task-avatar">
                  {task.assignees && task.assignees.length > 0 ? (
                    task.assignees[0].full_name?.charAt(0) || '?'
                  ) : '-'}
                </div>
                <div>
                  <span className={`status ${task.status === 'done' ? 'priority-3' : task.priority === 4 ? 'urgent' : 'priority-3'}`}>
                    {task.status === 'done' ? 'Done' :
                     task.status === 'in_progress' ? 'Working on it' : 'Stuck'}
                  </span>
                </div>
                <div style={{color: 'var(--text-secondary)'}}>
                  {task.due_date ? formatDate(task.due_date) : '-'}
                </div>
                <div>
                  {task.project_id ? 
                    projects.find(p => p.id === task.project_id)?.name || 'Unknown' : 
                    '-'
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Row */}
      <div className="add-task">
        <i>➕</i>
        <span>Add new task</span>
      </div>

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