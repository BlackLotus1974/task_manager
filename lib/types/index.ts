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

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 1 | 2 | 3 | 4; // 1=Low, 2=Medium, 3=High, 4=Urgent
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
  changes?: Record<string, any>;
  created_at: string;
  user?: User;
}

export interface TaskFilters {
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 1 | 2 | 3 | 4;
  assignee?: string;
  project?: string;
  tag?: string;
  due_date?: 'overdue' | 'today' | 'this_week' | 'this_month';
  search?: string;
}

export interface TaskSort {
  field: 'due_date' | 'created_at' | 'updated_at' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 1 | 2 | 3 | 4;
  due_date?: string;
  project_id?: string;
  assignee_ids?: string[];
  tag_ids?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 1 | 2 | 3 | 4;
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

export const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done'
} as const;

export const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800'
} as const; 