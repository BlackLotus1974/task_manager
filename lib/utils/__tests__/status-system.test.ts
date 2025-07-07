/**
 * Status System Utilities Tests
 * 
 * These tests validate the harmonized status system functionality
 */

import {
  CustomStatus,
  TraditionalStatus,
  PriorityLevel,
  Task,
  TraditionalTask,
  customStatusToTraditional,
  traditionalToCustomStatus,
  taskToTraditional,
  traditionalTaskToTask,
  isCustomStatus,
  isTraditionalStatus,
  isPriorityLevel
} from '@/lib/types';

import {
  StatusSystemMode,
  getStatusLabel,
  getStatusColor,
  getPriorityLabel,
  getPriorityColor,
  convertTaskToMode,
  getStatusOptions,
  getPriorityOptions,
  isTaskOverdue,
  getTaskUrgency,
  sortTasksByUrgency,
  filterTasksByStatus,
  getTaskStatusCounts
} from '@/lib/utils/status-system';

// Mock data
const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'urgent',
  priority: 4,
  traditional_status: 'todo',
  priority_level: 4,
  due_date: '2024-01-15T10:00:00Z',
  project_id: 'project-1',
  created_by: 'user-1',
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z'
};

const mockTraditionalTask: TraditionalTask = {
  id: '2',
  title: 'Traditional Task',
  description: 'Traditional Description',
  status: 'in_progress',
  priority: 3,
  due_date: '2024-01-20T10:00:00Z',
  project_id: 'project-1',
  created_by: 'user-1',
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z'
};

describe('Type Guards', () => {
  test('isCustomStatus correctly identifies custom status values', () => {
    expect(isCustomStatus('urgent')).toBe(true);
    expect(isCustomStatus('priority_2')).toBe(true);
    expect(isCustomStatus('priority_3')).toBe(true);
    expect(isCustomStatus('done')).toBe(true);
    expect(isCustomStatus('todo')).toBe(false);
    expect(isCustomStatus('in_progress')).toBe(false);
    expect(isCustomStatus('invalid')).toBe(false);
  });

  test('isTraditionalStatus correctly identifies traditional status values', () => {
    expect(isTraditionalStatus('todo')).toBe(true);
    expect(isTraditionalStatus('in_progress')).toBe(true);
    expect(isTraditionalStatus('done')).toBe(true);
    expect(isTraditionalStatus('urgent')).toBe(false);
    expect(isTraditionalStatus('priority_2')).toBe(false);
    expect(isTraditionalStatus('invalid')).toBe(false);
  });

  test('isPriorityLevel correctly identifies priority values', () => {
    expect(isPriorityLevel(1)).toBe(true);
    expect(isPriorityLevel(2)).toBe(true);
    expect(isPriorityLevel(3)).toBe(true);
    expect(isPriorityLevel(4)).toBe(true);
    expect(isPriorityLevel(0)).toBe(false);
    expect(isPriorityLevel(5)).toBe(false);
  });
});

describe('Status Conversion', () => {
  test('customStatusToTraditional converts correctly', () => {
    expect(customStatusToTraditional('urgent')).toEqual({ status: 'todo', priority: 4 });
    expect(customStatusToTraditional('priority_2')).toEqual({ status: 'todo', priority: 3 });
    expect(customStatusToTraditional('priority_3')).toEqual({ status: 'todo', priority: 2 });
    expect(customStatusToTraditional('done')).toEqual({ status: 'done', priority: 2 });
  });

  test('traditionalToCustomStatus converts correctly', () => {
    expect(traditionalToCustomStatus('todo', 4)).toBe('urgent');
    expect(traditionalToCustomStatus('todo', 3)).toBe('priority_2');
    expect(traditionalToCustomStatus('todo', 2)).toBe('priority_3');
    expect(traditionalToCustomStatus('todo', 1)).toBe('priority_3');
    expect(traditionalToCustomStatus('done', 2)).toBe('done');
    expect(traditionalToCustomStatus('in_progress', 4)).toBe('urgent');
  });
});

describe('Task Conversion', () => {
  test('taskToTraditional converts Task to TraditionalTask', () => {
    const traditional = taskToTraditional(mockTask);
    
    expect(traditional.id).toBe(mockTask.id);
    expect(traditional.title).toBe(mockTask.title);
    expect(traditional.status).toBe('todo'); // From traditional_status
    expect(traditional.priority).toBe(4); // From priority_level
  });

  test('traditionalTaskToTask converts TraditionalTask to Task', () => {
    const task = traditionalTaskToTask(mockTraditionalTask);
    
    expect(task.id).toBe(mockTraditionalTask.id);
    expect(task.title).toBe(mockTraditionalTask.title);
    expect(task.status).toBe('priority_2'); // Converted from in_progress + priority 3
    expect(task.traditional_status).toBe('in_progress');
    expect(task.priority_level).toBe(3);
  });
});

describe('Status System Utilities', () => {
  test('getStatusLabel returns correct labels', () => {
    expect(getStatusLabel('urgent', 'custom')).toBe('Urgent');
    expect(getStatusLabel('todo', 'traditional')).toBe('To Do');
    expect(getStatusLabel('in_progress', 'traditional')).toBe('In Progress');
  });

  test('getStatusColor returns correct color classes', () => {
    expect(getStatusColor('urgent', 'custom')).toBe('bg-red-100 text-red-800');
    expect(getStatusColor('todo', 'traditional')).toBe('bg-gray-100 text-gray-800');
  });

  test('getPriorityLabel returns correct labels', () => {
    expect(getPriorityLabel(1)).toBe('Low');
    expect(getPriorityLabel(2)).toBe('Medium');
    expect(getPriorityLabel(3)).toBe('High');
    expect(getPriorityLabel(4)).toBe('Urgent');
  });

  test('getPriorityColor returns correct color classes', () => {
    expect(getPriorityColor(1)).toBe('bg-gray-100 text-gray-800');
    expect(getPriorityColor(4)).toBe('bg-red-100 text-red-800');
  });
});

describe('Task Operations', () => {
  test('isTaskOverdue correctly identifies overdue tasks', () => {
    const overdueMockTask = {
      ...mockTask,
      due_date: '2023-01-01T10:00:00Z', // Past date
      status: 'urgent' as CustomStatus
    };
    
    const doneMockTask = {
      ...mockTask,
      due_date: '2023-01-01T10:00:00Z', // Past date
      status: 'done' as CustomStatus
    };

    expect(isTaskOverdue(overdueMockTask)).toBe(true);
    expect(isTaskOverdue(doneMockTask)).toBe(false); // Done tasks are not overdue
    expect(isTaskOverdue({ ...mockTask, due_date: undefined })).toBe(false); // No due date
  });

  test('getTaskUrgency calculates urgency correctly', () => {
    const urgentTask = { ...mockTask, status: 'urgent' as CustomStatus, priority_level: 4 };
    const normalTask = { ...mockTask, status: 'priority_3' as CustomStatus, priority_level: 2 };
    
    expect(getTaskUrgency(urgentTask)).toBeGreaterThan(getTaskUrgency(normalTask));
  });

  test('sortTasksByUrgency sorts correctly', () => {
    const tasks = [
      { ...mockTask, id: '1', status: 'priority_3' as CustomStatus, priority_level: 2 },
      { ...mockTask, id: '2', status: 'urgent' as CustomStatus, priority_level: 4 },
      { ...mockTask, id: '3', status: 'priority_2' as CustomStatus, priority_level: 3 }
    ];

    const sorted = sortTasksByUrgency(tasks, 'desc');
    expect(sorted[0].id).toBe('2'); // Most urgent first
    expect(sorted[2].id).toBe('1'); // Least urgent last
  });
});

describe('Filtering and Counting', () => {
  test('filterTasksByStatus filters correctly', () => {
    const tasks = [
      { ...mockTask, id: '1', status: 'urgent' as CustomStatus },
      { ...mockTask, id: '2', status: 'priority_2' as CustomStatus },
      { ...mockTask, id: '3', status: 'done' as CustomStatus }
    ];

    const urgentTasks = filterTasksByStatus(tasks, 'urgent', 'custom');
    expect(urgentTasks).toHaveLength(1);
    expect(urgentTasks[0].id).toBe('1');
  });

  test('getTaskStatusCounts counts correctly', () => {
    const tasks = [
      { ...mockTask, id: '1', status: 'urgent' as CustomStatus },
      { ...mockTask, id: '2', status: 'urgent' as CustomStatus },
      { ...mockTask, id: '3', status: 'priority_2' as CustomStatus },
      { ...mockTask, id: '4', status: 'done' as CustomStatus }
    ];

    const counts = getTaskStatusCounts(tasks, 'custom');
    expect(counts.urgent).toBe(2);
    expect(counts.priority_2).toBe(1);
    expect(counts.priority_3).toBe(0);
    expect(counts.done).toBe(1);
    expect(counts.total).toBe(4);
  });
});

describe('Status Options', () => {
  test('getStatusOptions returns correct options for custom mode', () => {
    const options = getStatusOptions('custom');
    expect(options).toHaveLength(4);
    expect(options.find(o => o.value === 'urgent')).toBeDefined();
    expect(options.find(o => o.value === 'priority_2')).toBeDefined();
  });

  test('getStatusOptions returns correct options for traditional mode', () => {
    const options = getStatusOptions('traditional');
    expect(options).toHaveLength(3);
    expect(options.find(o => o.value === 'todo')).toBeDefined();
    expect(options.find(o => o.value === 'in_progress')).toBeDefined();
  });

  test('getPriorityOptions returns correct priority options', () => {
    const options = getPriorityOptions();
    expect(options).toHaveLength(4);
    expect(options.find(o => o.value === 1 && o.label === 'Low')).toBeDefined();
    expect(options.find(o => o.value === 4 && o.label === 'Urgent')).toBeDefined();
  });
}); 