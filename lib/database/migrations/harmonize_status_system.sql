-- Migration: Harmonize Status System
-- This migration adds support for both status systems while maintaining backward compatibility
-- Date: 2024-01-XX
-- Purpose: Enable gradual migration from custom status system to traditional status + priority system

-- Step 1: Add new columns to tasks table to support both systems
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS traditional_status TEXT CHECK (traditional_status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
ADD COLUMN IF NOT EXISTS priority_level INTEGER CHECK (priority_level IN (1, 2, 3, 4)) DEFAULT 2;

-- Step 2: Create function to sync between status systems
CREATE OR REPLACE FUNCTION sync_task_status_systems()
RETURNS TRIGGER AS $$
BEGIN
    -- When custom status is updated, sync to traditional status + priority
    IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
        CASE NEW.status
            WHEN 'urgent' THEN
                NEW.traditional_status := 'todo';
                NEW.priority_level := 4;
            WHEN 'priority_2' THEN
                NEW.traditional_status := 'todo';
                NEW.priority_level := 3;
            WHEN 'priority_3' THEN
                NEW.traditional_status := 'todo';
                NEW.priority_level := 2;
            WHEN 'done' THEN
                NEW.traditional_status := 'done';
                NEW.priority_level := COALESCE(NEW.priority_level, 2);
            ELSE
                -- Default case
                NEW.traditional_status := 'todo';
                NEW.priority_level := 2;
        END CASE;
    END IF;
    
    -- When traditional status + priority is updated, sync to custom status
    IF TG_OP = 'UPDATE' AND (OLD.traditional_status IS DISTINCT FROM NEW.traditional_status OR OLD.priority_level IS DISTINCT FROM NEW.priority_level) THEN
        IF NEW.traditional_status = 'done' THEN
            NEW.status := 'done';
        ELSE
            CASE NEW.priority_level
                WHEN 4 THEN NEW.status := 'urgent';
                WHEN 3 THEN NEW.status := 'priority_2';
                WHEN 2 THEN NEW.status := 'priority_3';
                WHEN 1 THEN NEW.status := 'priority_3';
                ELSE NEW.status := 'priority_3';
            END CASE;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger to maintain synchronization
DROP TRIGGER IF EXISTS sync_task_status_trigger ON public.tasks;
CREATE TRIGGER sync_task_status_trigger
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION sync_task_status_systems();

-- Step 4: Initialize new columns based on existing data
UPDATE public.tasks SET 
    traditional_status = CASE 
        WHEN status = 'done' THEN 'done'
        ELSE 'todo'
    END,
    priority_level = CASE status
        WHEN 'urgent' THEN 4
        WHEN 'priority_2' THEN 3
        WHEN 'priority_3' THEN 2
        WHEN 'done' THEN COALESCE(priority, 2)
        ELSE 2
    END
WHERE traditional_status IS NULL OR priority_level IS NULL;

-- Step 5: Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_tasks_traditional_status ON public.tasks(traditional_status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority_level ON public.tasks(priority_level);

-- Step 6: Create utility views for both systems
CREATE OR REPLACE VIEW tasks_traditional_view AS
SELECT 
    id,
    title,
    description,
    traditional_status as status,
    priority_level as priority,
    due_date,
    project_id,
    created_by,
    created_at,
    updated_at
FROM public.tasks;

CREATE OR REPLACE VIEW tasks_custom_view AS
SELECT 
    id,
    title,
    description,
    status,
    priority,
    due_date,
    project_id,
    created_by,
    created_at,
    updated_at
FROM public.tasks;

-- Step 7: Create helper functions for status conversion
CREATE OR REPLACE FUNCTION custom_status_to_traditional(custom_status TEXT)
RETURNS TABLE(status TEXT, priority INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN custom_status = 'done' THEN 'done'::TEXT
            ELSE 'todo'::TEXT
        END as status,
        CASE custom_status
            WHEN 'urgent' THEN 4
            WHEN 'priority_2' THEN 3
            WHEN 'priority_3' THEN 2
            WHEN 'done' THEN 2
            ELSE 2
        END as priority;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION traditional_to_custom_status(trad_status TEXT, priority_val INTEGER)
RETURNS TEXT AS $$
BEGIN
    IF trad_status = 'done' THEN
        RETURN 'done';
    ELSE
        CASE priority_val
            WHEN 4 THEN RETURN 'urgent';
            WHEN 3 THEN RETURN 'priority_2';
            WHEN 2 THEN RETURN 'priority_3';
            WHEN 1 THEN RETURN 'priority_3';
            ELSE RETURN 'priority_3';
        END CASE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Add comments for documentation
COMMENT ON COLUMN public.tasks.status IS 'Custom status system: urgent, priority_2, priority_3, done';
COMMENT ON COLUMN public.tasks.traditional_status IS 'Traditional status system: todo, in_progress, done';
COMMENT ON COLUMN public.tasks.priority_level IS 'Priority level: 1=Low, 2=Medium, 3=High, 4=Urgent';
COMMENT ON FUNCTION sync_task_status_systems() IS 'Maintains synchronization between custom and traditional status systems';
COMMENT ON VIEW tasks_traditional_view IS 'Tasks using traditional status + priority system';
COMMENT ON VIEW tasks_custom_view IS 'Tasks using custom status system (current master)'; 