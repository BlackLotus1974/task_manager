"use client";

import { useState } from "react";
import { updateTaskCustomStatusAction } from "@/lib/actions/tasks";
import { Task, CustomStatus } from "@/lib/types";
import { useUndo } from "@/contexts/undo-context";
import { getStatusLabel, getStatusOptions } from "@/lib/utils/status-system";

interface InlineStatusEditorProps {
  task: Task;
  onStatusChange?: (taskId: string, deleted: boolean) => void;
}

export function InlineStatusEditor({ task, onStatusChange }: InlineStatusEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { addUndoAction } = useUndo();

  // Get status options using the utility function
  const statusOptions = getStatusOptions('custom');

  const currentStatus = statusOptions.find(option => option.value === task.status);

  const handleStatusChange = async (newStatus: CustomStatus) => {
    setIsUpdating(true);
    setIsEditing(false);

    const previousState = { status: task.status };

    try {
      const result = await updateTaskCustomStatusAction(task.id, newStatus);
      
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
      <div className="status" style={{ 
        backgroundColor: currentStatus?.color || '#888', 
        opacity: 0.6,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
        color: 'white'
      }}>
        Updating...
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="status-editor" style={{ position: 'relative' }}>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as CustomStatus)}
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
        backgroundColor: currentStatus?.color || '#888',
        cursor: 'pointer'
      }}
      title="Click to change status"
    >
      {getStatusLabel(task.status)}
    </div>
  );
} 