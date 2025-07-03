import { createClient } from '@/lib/supabase/server';
import { 
  Task, 
  CreateTaskData, 
  UpdateTaskData, 
  TaskFilters, 
  TaskSort 
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

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
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
  
  // Apply sorting
  if (sort) {
    query = query.order(sort.field, { ascending: sort.direction === 'asc' });
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
  
  // Create the task
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      due_date: taskData.due_date,
      project_id: taskData.project_id,
      created_by: user.id
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
    title: taskData.title,
    priority: taskData.priority
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
  
  // Update the task
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .update({
      title: updates.title,
      description: updates.description,
      status: updates.status,
      priority: updates.priority,
      due_date: updates.due_date,
      project_id: updates.project_id,
      updated_at: new Date().toISOString()
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
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get task info for logging
  const task = await getTaskById(id);
  if (!task) {
    throw new Error('Task not found');
  }
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
  
  // Log activity
  await logActivity('deleted', 'task', id, user.id, {
    title: task.title
  });
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