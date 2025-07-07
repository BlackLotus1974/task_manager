/**
 * Status System Utilities
 * 
 * This module provides utilities for working with both the custom status system
 * (urgent, priority_2, priority_3, done) and the traditional status system
 * (todo, in_progress, done) with separate priority levels.
 */

import {
  CustomStatus,
  TraditionalStatus,
  PriorityLevel,
  Task,
  TraditionalTask,
  STATUS_LABELS,
  STATUS_COLORS,
  TRADITIONAL_STATUS_LABELS,
  TRADITIONAL_STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  customStatusToTraditional,
  traditionalToCustomStatus,
  taskToTraditional,
  traditionalTaskToTask,
  isCustomStatus,
  isTraditionalStatus,
  isPriorityLevel
} from '@/lib/types';

/**
 * Status System Mode
 */
export type StatusSystemMode = 'custom' | 'traditional';

/**
 * Get the appropriate status label based on the system mode
 */
export function getStatusLabel(
  status: CustomStatus | TraditionalStatus,
  mode: StatusSystemMode = 'custom'
): string {
  if (mode === 'custom' && isCustomStatus(status)) {
    return STATUS_LABELS[status];
  }
  
  if (mode === 'traditional' && isTraditionalStatus(status)) {
    return TRADITIONAL_STATUS_LABELS[status];
  }
  
  // Fallback: try to convert and get label
  if (isCustomStatus(status)) {
    const traditional = customStatusToTraditional(status);
    return TRADITIONAL_STATUS_LABELS[traditional.status];
  }
  
  return 'Unknown';
}

/**
 * Get the appropriate status color classes based on the system mode
 */
export function getStatusColor(
  status: CustomStatus | TraditionalStatus,
  mode: StatusSystemMode = 'custom'
): string {
  if (mode === 'custom' && isCustomStatus(status)) {
    return STATUS_COLORS[status];
  }
  
  if (mode === 'traditional' && isTraditionalStatus(status)) {
    return TRADITIONAL_STATUS_COLORS[status];
  }
  
  // Fallback: try to convert and get color
  if (isCustomStatus(status)) {
    const traditional = customStatusToTraditional(status);
    return TRADITIONAL_STATUS_COLORS[traditional.status];
  }
  
  return 'bg-gray-100 text-gray-800';
}

/**
 * Get priority label
 */
export function getPriorityLabel(priority: PriorityLevel): string {
  return PRIORITY_LABELS[priority];
}

/**
 * Get priority color classes
 */
export function getPriorityColor(priority: PriorityLevel): string {
  return PRIORITY_COLORS[priority];
}

/**
 * Convert any task to the specified system mode
 */
export function convertTaskToMode(
  task: Task | TraditionalTask,
  mode: StatusSystemMode
): Task | TraditionalTask {
  if (mode === 'traditional') {
    // Convert to traditional task
    if ('traditional_status' in task) {
      // It's already a Task, convert to TraditionalTask
      return taskToTraditional(task as Task);
    }
    // It's already a TraditionalTask
    return task as TraditionalTask;
  } else {
    // Convert to custom task
    if ('traditional_status' in task) {
      // It's already a Task
      return task as Task;
    }
    // It's a TraditionalTask, convert to Task
    return traditionalTaskToTask(task as TraditionalTask);
  }
}

/**
 * Get all possible status values for a given mode
 */
export function getStatusOptions(mode: StatusSystemMode): Array<{
  value: string;
  label: string;
  color: string;
}> {
  if (mode === 'traditional') {
    return Object.entries(TRADITIONAL_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
      color: TRADITIONAL_STATUS_COLORS[value as TraditionalStatus]
    }));
  } else {
    return Object.entries(STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
      color: STATUS_COLORS[value as CustomStatus]
    }));
  }
}

/**
 * Get all priority options
 */
export function getPriorityOptions(): Array<{
  value: PriorityLevel;
  label: string;
  color: string;
}> {
  return Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value: parseInt(value) as PriorityLevel,
    label,
    color: PRIORITY_COLORS[parseInt(value) as PriorityLevel]
  }));
}

/**
 * Determine if a task is overdue
 */
export function isTaskOverdue(task: Task | TraditionalTask): boolean {
  if (!task.due_date) return false;
  
  const dueDate = new Date(task.due_date);
  const now = new Date();
  
  // Check if task is not done and past due date
  if ('traditional_status' in task) {
    // Task interface
    return task.status !== 'done' && dueDate < now;
  } else {
    // TraditionalTask interface
    return task.status !== 'done' && dueDate < now;
  }
}

/**
 * Get task urgency level (for sorting/prioritization)
 */
export function getTaskUrgency(task: Task | TraditionalTask): number {
  let urgencyScore = 0;
  
  // Base priority score
  if ('traditional_status' in task) {
    // Task interface - use priority_level or convert from status
    const priority = task.priority_level || customStatusToTraditional(task.status).priority;
    urgencyScore += priority * 10;
  } else {
    // TraditionalTask interface
    urgencyScore += task.priority * 10;
  }
  
  // Add urgency for overdue tasks
  if (isTaskOverdue(task)) {
    urgencyScore += 50;
  }
  
  // Add urgency for tasks due today
  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    const today = new Date();
    if (dueDate.toDateString() === today.toDateString()) {
      urgencyScore += 20;
    }
  }
  
  return urgencyScore;
}

/**
 * Sort tasks by urgency
 */
export function sortTasksByUrgency(
  tasks: (Task | TraditionalTask)[],
  direction: 'asc' | 'desc' = 'desc'
): (Task | TraditionalTask)[] {
  return [...tasks].sort((a, b) => {
    const urgencyA = getTaskUrgency(a);
    const urgencyB = getTaskUrgency(b);
    
    return direction === 'desc' ? urgencyB - urgencyA : urgencyA - urgencyB;
  });
}

/**
 * Filter tasks by status (works with both systems)
 */
export function filterTasksByStatus(
  tasks: (Task | TraditionalTask)[],
  status: CustomStatus | TraditionalStatus,
  mode: StatusSystemMode = 'custom'
): (Task | TraditionalTask)[] {
  return tasks.filter(task => {
    if (mode === 'custom') {
      if ('traditional_status' in task) {
        // Task interface
        return task.status === status;
      } else {
        // TraditionalTask - convert to custom status
        const customStatus = traditionalToCustomStatus(task.status, task.priority);
        return customStatus === status;
      }
    } else {
      if ('traditional_status' in task) {
        // Task interface - use traditional_status or convert
        const traditionalStatus = task.traditional_status || customStatusToTraditional(task.status).status;
        return traditionalStatus === status;
      } else {
        // TraditionalTask interface
        return task.status === status;
      }
    }
  });
}

/**
 * Get task counts by status for dashboard
 */
export function getTaskStatusCounts(
  tasks: (Task | TraditionalTask)[],
  mode: StatusSystemMode = 'custom'
): Record<string, number> {
  const counts: Record<string, number> = {};
  
  if (mode === 'custom') {
    // Count by custom status
    counts.urgent = filterTasksByStatus(tasks, 'urgent', 'custom').length;
    counts.priority_2 = filterTasksByStatus(tasks, 'priority_2', 'custom').length;
    counts.priority_3 = filterTasksByStatus(tasks, 'priority_3', 'custom').length;
    counts.done = filterTasksByStatus(tasks, 'done', 'custom').length;
  } else {
    // Count by traditional status
    counts.todo = filterTasksByStatus(tasks, 'todo', 'traditional').length;
    counts.in_progress = filterTasksByStatus(tasks, 'in_progress', 'traditional').length;
    counts.done = filterTasksByStatus(tasks, 'done', 'traditional').length;
    
    // Also count by priority
    const priorities = [1, 2, 3, 4] as PriorityLevel[];
    priorities.forEach(priority => {
      counts[`priority_${priority}`] = tasks.filter(task => {
        if ('traditional_status' in task) {
          return task.priority_level === priority;
        } else {
          return task.priority === priority;
        }
      }).length;
    });
  }
  
  // Common counts
  counts.overdue = tasks.filter(isTaskOverdue).length;
  counts.total = tasks.length;
  
  return counts;
} 