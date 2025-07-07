-- Rollback Migration: Harmonize Status System
-- This migration safely reverts the status system harmonization
-- Date: 2024-01-XX
-- Purpose: Rollback harmonization changes if needed

-- Step 1: Drop the trigger first
DROP TRIGGER IF EXISTS sync_task_status_trigger ON public.tasks;

-- Step 2: Drop the synchronization function
DROP FUNCTION IF EXISTS sync_task_status_systems();

-- Step 3: Drop utility views
DROP VIEW IF EXISTS tasks_traditional_view;
DROP VIEW IF EXISTS tasks_custom_view;

-- Step 4: Drop helper functions
DROP FUNCTION IF EXISTS custom_status_to_traditional(TEXT);
DROP FUNCTION IF EXISTS traditional_to_custom_status(TEXT, INTEGER);

-- Step 5: Drop indexes for new columns
DROP INDEX IF EXISTS idx_tasks_traditional_status;
DROP INDEX IF EXISTS idx_tasks_priority_level;

-- Step 6: Remove new columns (with data preservation check)
-- Note: Only remove if no critical data depends on these columns
ALTER TABLE public.tasks 
DROP COLUMN IF EXISTS traditional_status,
DROP COLUMN IF EXISTS priority_level;

-- Step 7: Remove comments
COMMENT ON COLUMN public.tasks.status IS NULL;

-- Step 8: Verify original status system is intact
-- The original status column and constraints should remain unchanged 