import { createClient } from '@/lib/supabase/server';
import { 
  Task, 
  CreateTaskData, 
  UpdateTaskData, 
  TaskFilters, 
  TaskSort,
  customStatusToTraditional,
  traditionalToCustomStatus,
  isCustomStatus,
  isTraditionalStatus,
  isPriorityLevel
} from '@/lib/types';

export async function getTasks(
  filters?: TaskFilters,
  sort?: TaskSort,
  limit?: number,
  offset?: number
): Promise<{ tasks: Task[]; count: number }> {
  const supabase = await createClient();
  
  let query = supabase
    .from('tasks')
    .select(`
      *,
      project:projects(id, name, color),
      assignees:task_assignments(
        user:users(id, email, full_name, avatar_url)
      ),
      tags:task_tags(
        tag:tags(id, name, color)
      ),
      comments(count),
      attachments(count)
    `, { count: 'exact' });

  // Apply filters - support both status systems
  if (filters?.status) {
    query = query.eq('status', filters.status);
  } else if (filters?.traditional_status) {
    query = query.eq('traditional_status', filters.traditional_status);
  } else {
    // By default, filter out "done" tasks unless explicitly requested
    query = query.neq('status', 'done').neq('traditional_status', 'done');
  }
  
  // Support both priority systems
  if (filters?.priority) {
    // Legacy priority field (deprecated but still supported)
    query = query.eq('priority', filters.priority);
  } else if (filters?.priority_level) {
    query = query.eq('priority_level', filters.priority_level);
  }
  
  if (filters?.project) {
    query = query.eq('project_id', filters.project);
  }
  
  if (filters?.assignee) {
    const { data: taskIds } = await supabase
      .from('task_assignments')
      .select('task_id')
      .eq('user_id', filters.assignee);
    
    const ids = taskIds?.map(item => item.task_id) || [];
    if (ids.length > 0) {
      query = query.in('id', ids);
    } else {
      // No tasks found for this assignee, return empty result
      query = query.eq('id', 'non-existent-id');
    }
  }
  
  if (filters?.tag) {
    const { data: taskIds } = await supabase
      .from('task_tags')
      .select('task_id')
      .eq('tag_id', filters.tag);
    
    const ids = taskIds?.map(item => item.task_id) || [];
    if (ids.length > 0) {
      query = query.in('id', ids);
    } else {
      // No tasks found for this tag, return empty result
      query = query.eq('id', 'non-existent-id');
    }
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  
  if (filters?.due_date) {
    const now = new Date();
    switch (filters.due_date) {
      case 'overdue':
        query = query.lt('due_date', now.toISOString());
        break;
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query.gte('due_date', today.toISOString())
                    .lt('due_date', tomorrow.toISOString());
        break;
      case 'this_week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        query = query.gte('due_date', startOfWeek.toISOString())
                    .lt('due_date', endOfWeek.toISOString());
        break;
      case 'this_month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        query = query.gte('due_date', startOfMonth.toISOString())
                    .lt('due_date', endOfMonth.toISOString());
        break;
    }
  }
  
  // Apply sorting - support both priority systems
  if (sort) {
    // Map legacy priority field to priority_level for sorting
    const sortField = sort.field === 'priority' ? 'priority_level' : sort.field;
    query = query.order(sortField, { ascending: sort.direction === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }
  
  // Apply pagination
  if (limit) {
    query = query.limit(limit);
  }
  
  if (offset) {
    query = query.range(offset, offset + (limit || 50) - 1);
  }

  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
  
  return {
    tasks: (data || []) as Task[],
    count: count || 0
  };
}

export async function getTaskById(id: string): Promise<Task | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects(id, name, color),
      assignees:task_assignments(
        user:users(id, email, full_name, avatar_url)
      ),
      tags:task_tags(
        tag:tags(id, name, color)
      ),
      comments(
        *,
        user:users(id, email, full_name, avatar_url)
      ),
      attachments(
        *,
        user:users(id, email, full_name, avatar_url)
      )
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Task not found
    }
    throw new Error(`Failed to fetch task: ${error.message}`);
  }
  
  return data as Task;
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Handle dual status system
  let statusData: {
    status?: string;
    traditional_status?: string;
    priority_level?: number;
  } = {};
  
  if (taskData.status && isCustomStatus(taskData.status)) {
    // Custom status system (current master)
    statusData.status = taskData.status;
    // Auto-sync to traditional system
    const traditional = customStatusToTraditional(taskData.status);
    statusData.traditional_status = traditional.status;
    statusData.priority_level = traditional.priority;
  } else if (taskData.traditional_status && isTraditionalStatus(taskData.traditional_status)) {
    // Traditional status system (new-ui-design)
    statusData.traditional_status = taskData.traditional_status;
    const priorityLevel = taskData.priority_level || taskData.priority || 2;
    statusData.priority_level = isPriorityLevel(priorityLevel) ? priorityLevel : 2;
    // Auto-sync to custom system
    statusData.status = traditionalToCustomStatus(taskData.traditional_status, statusData.priority_level as import('@/lib/types').PriorityLevel);
  } else {
    // Default to custom system
    const defaultStatus = taskData.status || 'priority_3';
    statusData.status = isCustomStatus(defaultStatus) ? defaultStatus : 'priority_3';
    const traditional = customStatusToTraditional(statusData.status as import('@/lib/types').CustomStatus);
    statusData.traditional_status = traditional.status;
    statusData.priority_level = traditional.priority;
  }
  
  // Create the task
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert({
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.due_date,
      project_id: taskData.project_id,
      created_by: user.id,
      ...statusData,
    })
    .select()
    .single();
    
  if (taskError) {
    throw new Error(`Failed to create task: ${taskError.message}`);
  }
  
  // Add task assignments if provided
  if (taskData.assignee_ids && taskData.assignee_ids.length > 0) {
    const assignments = taskData.assignee_ids.map(userId => ({
      task_id: task.id,
      user_id: userId
    }));
    
    const { error: assignmentError } = await supabase
      .from('task_assignments')
      .insert(assignments);
      
    if (assignmentError) {
      throw new Error(`Failed to assign task: ${assignmentError.message}`);
    }
  }
  
  // Add task tags if provided
  if (taskData.tag_ids && taskData.tag_ids.length > 0) {
    const taskTags = taskData.tag_ids.map(tagId => ({
      task_id: task.id,
      tag_id: tagId
    }));
    
    const { error: tagError } = await supabase
      .from('task_tags')
      .insert(taskTags);
      
    if (tagError) {
      throw new Error(`Failed to add task tags: ${tagError.message}`);
    }
  }
  
  // Log activity
  await logActivity('created', 'task', task.id, user.id, {
    title: taskData.title
  });
  
  // Return the complete task with relations
  const createdTask = await getTaskById(task.id);
  if (!createdTask) {
    throw new Error('Failed to retrieve created task');
  }
  
  return createdTask;
}

export async function updateTask(id: string, updates: UpdateTaskData): Promise<Task> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get current task for change tracking
  const currentTask = await getTaskById(id);
  if (!currentTask) {
    throw new Error('Task not found');
  }
  
  // Handle dual status system for updates
  let statusUpdates: {
    status?: string;
    traditional_status?: string;
    priority_level?: number;
  } = {};
  
  if (updates.status && isCustomStatus(updates.status)) {
    // Custom status system update
    statusUpdates.status = updates.status;
    // Auto-sync to traditional system
    const traditional = customStatusToTraditional(updates.status);
    statusUpdates.traditional_status = traditional.status;
    statusUpdates.priority_level = traditional.priority;
  } else if (updates.traditional_status && isTraditionalStatus(updates.traditional_status)) {
    // Traditional status system update
    statusUpdates.traditional_status = updates.traditional_status;
    const priorityLevel = updates.priority_level || updates.priority || currentTask.priority_level || 2;
    statusUpdates.priority_level = isPriorityLevel(priorityLevel) ? priorityLevel : 2;
    // Auto-sync to custom system
    statusUpdates.status = traditionalToCustomStatus(updates.traditional_status, statusUpdates.priority_level as import('@/lib/types').PriorityLevel);
  } else if (updates.priority_level && isPriorityLevel(updates.priority_level)) {
    // Priority level update only - sync both systems
    statusUpdates.priority_level = updates.priority_level;
    if (currentTask.traditional_status) {
      statusUpdates.status = traditionalToCustomStatus(currentTask.traditional_status, updates.priority_level);
    }
  } else if (updates.priority && isPriorityLevel(updates.priority)) {
    // Legacy priority field update
    statusUpdates.priority_level = updates.priority;
    if (currentTask.traditional_status) {
      statusUpdates.status = traditionalToCustomStatus(currentTask.traditional_status, updates.priority);
    }
  }

  // Update the task
  const { error: taskError } = await supabase
    .from('tasks')
    .update({
      title: updates.title,
      description: updates.description,
      due_date: updates.due_date,
      project_id: updates.project_id,
      updated_at: new Date().toISOString(),
      ...statusUpdates
    })
    .eq('id', id)
    .select()
    .single();
    
  if (taskError) {
    throw new Error(`Failed to update task: ${taskError.message}`);
  }
  
  // Update task assignments if provided
  if (updates.assignee_ids !== undefined) {
    // Remove existing assignments
    await supabase
      .from('task_assignments')
      .delete()
      .eq('task_id', id);
    
    // Add new assignments
    if (updates.assignee_ids.length > 0) {
      const assignments = updates.assignee_ids.map(userId => ({
        task_id: id,
        user_id: userId
      }));
      
      const { error: assignmentError } = await supabase
        .from('task_assignments')
        .insert(assignments);
        
      if (assignmentError) {
        throw new Error(`Failed to update task assignments: ${assignmentError.message}`);
      }
    }
  }
  
  // Update task tags if provided
  if (updates.tag_ids !== undefined) {
    // Remove existing tags
    await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', id);
    
    // Add new tags
    if (updates.tag_ids.length > 0) {
      const taskTags = updates.tag_ids.map(tagId => ({
        task_id: id,
        tag_id: tagId
      }));
      
      const { error: tagError } = await supabase
        .from('task_tags')
        .insert(taskTags);
        
      if (tagError) {
        throw new Error(`Failed to update task tags: ${tagError.message}`);
      }
    }
  }
  
  // Log activity with changes
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  (Object.keys(updates) as Array<keyof UpdateTaskData>).forEach(key => {
    // We can't compare assignee_ids and tag_ids directly
    if (key === 'assignee_ids' || key === 'tag_ids') return;

    const currentValue = currentTask[key as keyof Omit<UpdateTaskData, 'assignee_ids' | 'tag_ids'>];
    const newValue = updates[key as keyof Omit<UpdateTaskData, 'assignee_ids' | 'tag_ids'>];

    if (currentValue !== newValue) {
      changes[key] = { from: currentValue, to: newValue };
    }
  });
  
  if (Object.keys(changes).length > 0) {
    await logActivity('updated', 'task', id, user.id, changes);
  }
  
  // Return the updated task with relations
  const updatedTask = await getTaskById(id);
  if (!updatedTask) {
    throw new Error('Failed to retrieve updated task');
  }
  
  return updatedTask;
}

export async function deleteTask(id: string): Promise<void> {
  console.log(`[deleteTask] Starting deletion for task ID: ${id}`);
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('[deleteTask] Error: User not authenticated.');
    throw new Error('User not authenticated');
  }
  console.log(`[deleteTask] Authenticated user: ${user.id}`);
  
  // Get task info for logging
  const task = await getTaskById(id);
  if (!task) {
    console.warn(`[deleteTask] Warning: Task with ID ${id} not found before deletion.`);
    // We can choose to throw an error or allow the delete to proceed,
    // which will likely do nothing but won't error out.
    // For now, we let it proceed.
  } else {
    console.log(`[deleteTask] Found task to delete: "${task.title}"`);
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`[deleteTask] Supabase delete error for task ID ${id}:`, error);
    throw new Error(`Failed to delete task: ${error.message}`);
  }

  console.log(`[deleteTask] Supabase delete operation completed for task ID: ${id}. Returned data:`, data);
  
  // Log activity
  await logActivity('deleted', 'task', id, user.id, {
    title: task?.title || 'Unknown Task'
  });
  console.log(`[deleteTask] Activity logged for task ID: ${id}`);
}

export async function assignTask(taskId: string, userIds: string[]): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Remove existing assignments
  await supabase
    .from('task_assignments')
    .delete()
    .eq('task_id', taskId);
  
  // Add new assignments
  if (userIds.length > 0) {
    const assignments = userIds.map(userId => ({
      task_id: taskId,
      user_id: userId
    }));
    
    const { error } = await supabase
      .from('task_assignments')
      .insert(assignments);
      
    if (error) {
      throw new Error(`Failed to assign task: ${error.message}`);
    }
  }
  
  // Log activity
  await logActivity('assigned', 'task', taskId, user.id, {
    assignees: userIds
  });
}

async function logActivity(
  action: string,
  entityType: string,
  entityId: string,
  userId: string,
  changes?: Record<string, unknown>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("activity_log").insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    user_id: userId,
    changes
  });
  
  if (error) {
    throw new Error(`Failed to log activity: ${error.message}`);
  }
} 