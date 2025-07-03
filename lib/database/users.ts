import { createClient } from '@/lib/supabase/server';
import { User } from '@/lib/types';

export async function getCurrentUser(): Promise<User | null> {
  console.log("🔍 getCurrentUser: Starting");
  
  const supabase = await createClient();
  
  const { data: { user: authUser } } = await supabase.auth.getUser();
  console.log("🔍 getCurrentUser: Auth user:", authUser ? `${authUser.email} (${authUser.id})` : "null");
  
  if (!authUser) {
    console.log("❌ getCurrentUser: No auth user found");
    return null;
  }
  
  console.log("🔍 getCurrentUser: Querying users table for user:", authUser.id);
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();
    
  console.log("🔍 getCurrentUser: Database query result:", { data, error });
    
  if (error) {
    console.log("🔍 getCurrentUser: Database error:", error);
    if (error.code === 'PGRST116') {
      // User profile doesn't exist yet, create it
      console.log("🔍 getCurrentUser: User profile doesn't exist, creating it");
      return await createUserProfile(authUser.id, authUser.email!, authUser.user_metadata?.full_name);
    }
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
  
  console.log("✅ getCurrentUser: Successfully found user profile");
  return data as User;
}

export async function createUserProfile(id: string, email: string, fullName?: string): Promise<User> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      id,
      email,
      full_name: fullName,
      role: 'member' // Default role
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`);
  }
  
  return data as User;
}

export async function getAllUsers(): Promise<User[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('full_name', { ascending: true });
    
  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
  
  return (data || []) as User[];
}

export async function updateUserProfile(id: string, updates: Partial<Pick<User, 'full_name' | 'avatar_url'>>): Promise<User> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
  
  return data as User;
}

export async function updateUserRole(id: string, role: 'admin' | 'member'): Promise<User> {
  const supabase = await createClient();
  
  // Check if current user is admin
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Only admins can update user roles');
  }
  
  const { data, error } = await supabase
    .from('users')
    .update({
      role,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }
  
  return data as User;
}

export async function isUserAdmin(userId?: string): Promise<boolean> {
  const supabase = await createClient();
  
  let targetUserId = userId;
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    targetUserId = user.id;
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', targetUserId)
    .single();
    
  if (error || !data) {
    return false;
  }
  
  return data.role === 'admin';
} 