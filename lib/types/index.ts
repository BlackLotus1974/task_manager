export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  members?: ProjectMember[];
}

// Status system types
export type CustomStatus = 'urgent' | 'priority_2' | 'priority_3' | 'done';
export type TraditionalStatus = 'todo' | 'in_progress' | 'done';
export type PriorityLevel = 1 | 2 | 3 | 4; // 1=Low, 2=Medium, 3=High, 4=Urgent

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: CustomStatus; // Current master system
  priority?: PriorityLevel; // Legacy field (deprecated)
  due_date?: string;
  project_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // New harmonized fields (from database migration)
  traditional_status?: TraditionalStatus;
  priority_level?: PriorityLevel;
  
  // Relations
  project?: Project;
  assignees?: User[];
  comments?: Comment[];
  attachments?: Attachment[];
  tags?: Tag[];
}

// Traditional task interface for new-ui-design compatibility
export interface TraditionalTask {
  id: string;
  title: string;
  description?: string;
  status: TraditionalStatus;
  priority: PriorityLevel;
  due_date?: string;
  project_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  project?: Project;
  assignees?: User[];
  comments?: Comment[];
  attachments?: Attachment[];
  tags?: Tag[];
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  assigned_at: string;
}

export interface Comment {
  id: string;
  content: string;
  task_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Attachment {
  id: string;
  filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  task_id: string;
  uploaded_by: string;
  created_at: string;
  user?: User;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface TaskTag {
  id: string;
  task_id: string;
  tag_id: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  user_id: string;
  task_id?: string;
  read: boolean;
  created_at: string;
  task?: Task;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  user?: User;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  changes?: Record<string, unknown>;
  created_at: string;
  user?: User;
}

// Harmonized filter interfaces
export interface TaskFilters {
  status?: CustomStatus;
  traditional_status?: TraditionalStatus;
  priority?: PriorityLevel;
  priority_level?: PriorityLevel;
  assignee?: string;
  project?: string;
  tag?: string;
  due_date?: 'overdue' | 'today' | 'this_week' | 'this_month';
  search?: string;
}

export interface TaskSort {
  field: 'due_date' | 'created_at' | 'updated_at' | 'priority' | 'priority_level' | 'title';
  direction: 'asc' | 'desc';
}

// Harmonized create/update interfaces
export interface CreateTaskData {
  title: string;
  description?: string;
  status?: CustomStatus;
  traditional_status?: TraditionalStatus;
  priority?: PriorityLevel;
  priority_level?: PriorityLevel;
  due_date?: string;
  project_id?: string;
  assignee_ids?: string[];
  tag_ids?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: CustomStatus;
  traditional_status?: TraditionalStatus;
  priority?: PriorityLevel;
  priority_level?: PriorityLevel;
  due_date?: string;
  project_id?: string;
  assignee_ids?: string[];
  tag_ids?: string[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  member_ids?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
  member_ids?: string[];
}

export interface CreateCommentData {
  content: string;
  task_id: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  task_assigned: boolean;
  task_due_reminder: boolean;
  comment_added: boolean;
  task_completed: boolean;
}

// Status system constants
export const STATUS_LABELS = {
  urgent: 'Urgent',
  priority_2: 'Priority 2',
  priority_3: 'Priority 3',
  done: 'Done'
} as const;

export const STATUS_COLORS = {
  urgent: 'bg-red-100 text-red-800',
  priority_2: 'bg-yellow-100 text-yellow-800',
  priority_3: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800'
} as const;

export const TRADITIONAL_STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done'
} as const;

export const TRADITIONAL_STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800'
} as const;

export const PRIORITY_LABELS = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Urgent'
} as const;

export const PRIORITY_COLORS = {
  1: 'bg-gray-100 text-gray-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-red-100 text-red-800'
} as const;

// Type guards
export function isCustomStatus(status: string): status is CustomStatus {
  return ['urgent', 'priority_2', 'priority_3', 'done'].includes(status);
}

export function isTraditionalStatus(status: string): status is TraditionalStatus {
  return ['todo', 'in_progress', 'done'].includes(status);
}

export function isPriorityLevel(priority: number): priority is PriorityLevel {
  return [1, 2, 3, 4].includes(priority);
}

// Conversion utilities
export function customStatusToTraditional(customStatus: CustomStatus): { status: TraditionalStatus; priority: PriorityLevel } {
  switch (customStatus) {
    case 'urgent':
      return { status: 'todo', priority: 4 };
    case 'priority_2':
      return { status: 'todo', priority: 3 };
    case 'priority_3':
      return { status: 'todo', priority: 2 };
    case 'done':
      return { status: 'done', priority: 2 };
    default:
      return { status: 'todo', priority: 2 };
  }
}

export function traditionalToCustomStatus(traditionalStatus: TraditionalStatus, priority: PriorityLevel): CustomStatus {
  if (traditionalStatus === 'done') {
    return 'done';
  }
  
  switch (priority) {
    case 4:
      return 'urgent';
    case 3:
      return 'priority_2';
    case 2:
      return 'priority_3';
    case 1:
      return 'priority_3';
    default:
      return 'priority_3';
  }
}

// Task conversion utilities
export function taskToTraditional(task: Task): TraditionalTask {
  const traditional = customStatusToTraditional(task.status);
  
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.traditional_status || traditional.status,
    priority: task.priority_level || traditional.priority,
    due_date: task.due_date,
    project_id: task.project_id,
    created_by: task.created_by,
    created_at: task.created_at,
    updated_at: task.updated_at,
    project: task.project,
    assignees: task.assignees,
    comments: task.comments,
    attachments: task.attachments,
    tags: task.tags
  };
}

export function traditionalTaskToTask(traditionalTask: TraditionalTask): Task {
  const customStatus = traditionalToCustomStatus(traditionalTask.status, traditionalTask.priority);
  
  return {
    id: traditionalTask.id,
    title: traditionalTask.title,
    description: traditionalTask.description,
    status: customStatus,
    priority: traditionalTask.priority,
    traditional_status: traditionalTask.status,
    priority_level: traditionalTask.priority,
    due_date: traditionalTask.due_date,
    project_id: traditionalTask.project_id,
    created_by: traditionalTask.created_by,
    created_at: traditionalTask.created_at,
    updated_at: traditionalTask.updated_at,
    project: traditionalTask.project,
    assignees: traditionalTask.assignees,
    comments: traditionalTask.comments,
    attachments: traditionalTask.attachments,
    tags: traditionalTask.tags
  };
}

// Utility type for components that can work with either system
export type TaskFiltersType = TaskFilters;
export type AnyTask = Task | TraditionalTask; 