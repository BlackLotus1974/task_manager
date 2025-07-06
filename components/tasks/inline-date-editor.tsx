"use client";

import { useState } from "react";
import { updateTaskAction } from "@/lib/actions/tasks";
import { Task } from "@/lib/types";
import { useUndo } from "@/contexts/undo-context";
import { formatDate } from "@/lib/utils";

interface InlineDateEditorProps {
  task: Task;
  color?: string;
}

export function InlineDateEditor({ task, color }: InlineDateEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { addUndoAction } = useUndo();

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDueDate = e.target.value;
    setIsUpdating(true);
    setIsEditing(false);

    const previousState = { due_date: task.due_date };

    try {
      const result = await updateTaskAction(task.id, { due_date: newDueDate });
      
      if (result.success && result.task) {
        addUndoAction({ type: 'update', task: result.task, previousState });
        // Optionally, trigger a refresh or use state to show new date
        window.location.reload(); // Simple refresh for now
      } else {
        console.error('Failed to update task due date:', result.error);
      }
    } catch (error) {
      console.error('Error updating task due date:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Format YYYY-MM-DD for the input
  const dateForInput = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';

  if (isUpdating) {
    return <div style={{ color: color || 'var(--text-secondary)' }}>Saving...</div>;
  }

  if (isEditing) {
    return (
      <input
        type="date"
        defaultValue={dateForInput}
        onChange={handleDateChange}
        onBlur={() => setIsEditing(false)}
        autoFocus
        style={{
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-content)',
          border: '1px solid var(--primary-blue)',
          borderRadius: '4px',
          padding: '2px 4px',
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{ 
        color: color || 'var(--text-secondary)',
        cursor: 'pointer' 
      }}
      title="Click to change due date"
    >
      {task.due_date ? formatDate(task.due_date) : '-'}
    </div>
  );
} 