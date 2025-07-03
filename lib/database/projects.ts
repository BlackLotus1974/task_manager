import { createClient } from '@/lib/supabase/server';
import { Project, CreateProjectData, UpdateProjectData } from '@/lib/types';

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      members:project_members(
        user:users(id, email, full_name, avatar_url, role)
      )
    `)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
  
  return (data || []) as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      members:project_members(
        *,
        user:users(id, email, full_name, avatar_url, role)
      )
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Project not found
    }
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
  
  return data as Project;
}

export async function createProject(projectData: CreateProjectData): Promise<Project> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Create the project
  const { data: newProject, error: projectError } = await supabase
    .from('projects')
    .insert({
      name: projectData.name,
      description: projectData.description,
      color: projectData.color || '#3B82F6',
      created_by: user.id
    })
    .select()
    .single();
    
  if (projectError) {
    throw new Error(`Failed to create project: ${projectError.message}`);
  }
  
  // Add project members (including creator as admin)
  const members: { project_id: string; user_id: string; role: 'admin' | 'member' }[] = [
    {
      project_id: newProject.id,
      user_id: user.id,
      role: 'admin' as const
    }
  ];
  
  // Add additional members if provided
  if (projectData.member_ids) {
    projectData.member_ids.forEach(userId => {
      members.push({
        project_id: newProject.id,
        user_id: userId,
        role: 'member' as const
      });
    });
  }
  
  const { error: membersError } = await supabase
    .from('project_members')
    .insert(members);
    
  if (membersError) {
    throw new Error(`Failed to add project members: ${membersError.message}`);
  }
  
  // Log activity
  await logActivity('created', 'project', newProject.id, user.id, {
    name: projectData.name
  });
  
  // Return the complete project with members
  const createdProject = await getProjectById(newProject.id);
  if (!createdProject) {
    throw new Error('Failed to retrieve created project');
  }
  
  return createdProject;
}

export async function updateProject(id: string, updates: UpdateProjectData): Promise<Project> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get current project for change tracking
  const currentProject = await getProjectById(id);
  if (!currentProject) {
    throw new Error('Project not found');
  }
  
  // Update the project details
  const { name, description, color, member_ids } = updates;
  const { error: projectError } = await supabase
    .from('projects')
    .update({
      name,
      description,
      color,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
    
  if (projectError) {
    throw new Error(`Failed to update project: ${projectError.message}`);
  }
  
  // Update project members if provided
  if (member_ids !== undefined) {
    const existingMemberIds = currentProject.members?.map(m => m.user?.id).filter(Boolean) as string[] || [];
    const adminUser = currentProject.members?.find(m => m.role === 'admin')?.user;
    const adminId = adminUser?.id;
    
    // Members to add
    const toAdd = member_ids
      .filter(id => !existingMemberIds.includes(id))
      .map(userId => ({ project_id: id, user_id: userId, role: 'member' as const }));
      
    // Members to remove
    const toRemove = existingMemberIds.filter(id => 
      !member_ids.includes(id) && id !== adminId
    );
    
    if (toAdd.length > 0) {
      await supabase.from('project_members').insert(toAdd);
    }
    if (toRemove.length > 0) {
      await supabase.from('project_members').delete().in('user_id', toRemove).eq('project_id', id);
    }
  }
  
  // Log activity with changes
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  const comparableUpdates = { name, description, color };

  (Object.keys(comparableUpdates) as Array<keyof typeof comparableUpdates>).forEach(key => {
    if (currentProject[key] !== comparableUpdates[key] && comparableUpdates[key] !== undefined) {
      changes[key] = { from: currentProject[key], to: comparableUpdates[key] };
    }
  });
  
  if (Object.keys(changes).length > 0) {
    await logActivity('updated', 'project', id, user.id, changes);
  }
  
  // Return the updated project with members
  const updatedProject = await getProjectById(id);
  if (!updatedProject) {
    throw new Error('Failed to retrieve updated project');
  }
  
  return updatedProject;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get project info for logging
  const project = await getProjectById(id);
  if (!project) {
    throw new Error('Project not found');
  }
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
  
  // Log activity
  await logActivity('deleted', 'project', id, user.id, {
    name: project.name
  });
}

export async function addProjectMember(projectId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('project_members')
    .insert({
      project_id: projectId,
      user_id: userId,
      role
    });
    
  if (error) {
    throw new Error(`Failed to add project member: ${error.message}`);
  }
  
  // Log activity
  await logActivity('added_member', 'project', projectId, user.id, {
    member_id: userId,
    role
  });
}

export async function removeProjectMember(projectId: string, userId: string): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);
    
  if (error) {
    throw new Error(`Failed to remove project member: ${error.message}`);
  }
  
  // Log activity
  await logActivity('removed_member', 'project', projectId, user.id, {
    member_id: userId
  });
}

export async function updateProjectMemberRole(projectId: string, userId: string, role: 'admin' | 'member'): Promise<void> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('project_members')
    .update({ role })
    .eq('project_id', projectId)
    .eq('user_id', userId);
    
  if (error) {
    throw new Error(`Failed to update project member role: ${error.message}`);
  }
  
  // Log activity
  await logActivity('updated_member_role', 'project', projectId, user.id, {
    member_id: userId,
    role
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
  
  await supabase
    .from('activity_log')
    .insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId,
      changes
    });
} 