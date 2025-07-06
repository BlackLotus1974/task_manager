"use client";

import { useState } from "react";
import { updateTaskAction } from "@/lib/actions/tasks";
import { STATUS_LABELS } from "@/lib/types";
import { Task } from "@/lib/types";
import { useUndo } from "@/contexts/undo-context";

interface InlineStatusEditorProps {
  task: Task;
  onStatusChange?: (taskId: string, deleted: boolean) => void;
}

export function InlineStatusEditor({ task, onStatusChange }: InlineStatusEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { addUndoAction } = useUndo();

  const statusOptions: Array<{ value: Task['status']; label: string; color: string }> = [
    { value: 'urgent', label: 'Urgent', color: 'var(--urgent-red)' },
    { value: 'priority_2', label: 'Priority 2', color: '#f59e0b' },
    { value: 'priority_3', label: 'Priority 3', color: '#3b82f6' },
    { value: 'done', label: 'Done', color: '#037f4c' }
  ];

  const currentStatus = statusOptions.find(option => option.value === task.status);

  const handleStatusChange = async (newStatus: Task['status']) => {
    setIsUpdating(true);
    setIsEditing(false);

    const previousState = { status: task.status };

    try {
      const result = await updateTaskAction(task.id, { status: newStatus });
      
      if (result.success) {
        if (result.deleted) {
          addUndoAction({ type: 'delete', task });
          onStatusChange?.(task.id, true);
        } else if (result.task) {
          addUndoAction({ type: 'update', task: result.task, previousState });
          onStatusChange?.(task.id, false);
        }
      } else {
        console.error('Failed to update task status:', result.error);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUpdating) {
    return (
      <div className="status" style={{ backgroundColor: currentStatus?.color, opacity: 0.6 }}>
        Updating...
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="status-editor" style={{ position: 'relative' }}>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
          onBlur={() => setIsEditing(false)}
          autoFocus
          style={{
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div
      className={`status ${task.status}`}
      onClick={() => setIsEditing(true)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
        color: 'white',
        backgroundColor: currentStatus?.color,
        cursor: 'pointer'
      }}
      title="Click to change status"
    >
      {currentStatus?.label || STATUS_LABELS[task.status]}
    </div>
  );
} 