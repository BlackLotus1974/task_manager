-- Task Management Tool Database Schema
-- This schema supports the PRD requirements for Atchalta's task management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects/Workspaces table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
    priority INTEGER CHECK (priority IN (1, 2, 3, 4)) DEFAULT 2, -- 1=Low, 2=Medium, 3=High, 4=Urgent
    due_date TIMESTAMP WITH TIME ZONE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task assignments (many-to-many relationship between tasks and users)
CREATE TABLE IF NOT EXISTS public.task_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task attachments
CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task tags (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.task_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(task_id, tag_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL, -- 'task_assigned', 'task_due', 'comment_added', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project members (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Activity log
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'assigned', etc.
    entity_type TEXT NOT NULL, -- 'task', 'project', 'comment', etc.
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    changes JSONB, -- Store what changed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id ON public.task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_user_id ON public.task_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON public.comments(task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON public.activity_log(entity_type, entity_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own profile and other users' basic info
CREATE POLICY "Users can view profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Project access policies
CREATE POLICY "Users can view projects they're members of" ON public.projects FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.project_members 
        WHERE project_id = id AND user_id = auth.uid()
    )
);

CREATE POLICY "Admins can create projects" ON public.projects FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Task access policies
CREATE POLICY "Users can view tasks in their projects" ON public.tasks FOR SELECT USING (
    project_id IS NULL OR EXISTS (
        SELECT 1 FROM public.project_members 
        WHERE project_id = tasks.project_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create tasks in their projects" ON public.tasks FOR INSERT WITH CHECK (
    project_id IS NULL OR EXISTS (
        SELECT 1 FROM public.project_members 
        WHERE project_id = tasks.project_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can update tasks they created or are assigned to" ON public.tasks FOR UPDATE USING (
    created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.task_assignments 
        WHERE task_id = id AND user_id = auth.uid()
    )
);

-- Task assignment policies
CREATE POLICY "Users can view task assignments" ON public.task_assignments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        LEFT JOIN public.project_members pm ON t.project_id = pm.project_id
        WHERE t.id = task_id AND (pm.user_id = auth.uid() OR t.project_id IS NULL)
    )
);

-- Comment policies
CREATE POLICY "Users can view comments on accessible tasks" ON public.comments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.tasks t
        LEFT JOIN public.project_members pm ON t.project_id = pm.project_id
        WHERE t.id = task_id AND (pm.user_id = auth.uid() OR t.project_id IS NULL)
    )
);

CREATE POLICY "Users can create comments on accessible tasks" ON public.comments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tasks t
        LEFT JOIN public.project_members pm ON t.project_id = pm.project_id
        WHERE t.id = task_id AND (pm.user_id = auth.uid() OR t.project_id IS NULL)
    )
);

-- Notification policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 