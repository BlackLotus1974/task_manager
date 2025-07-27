"use client";

import { useState } from 'react';
import { useUndo } from '@/contexts/undo-context';
import { createTaskAction, deleteTaskAction, updateTaskAction } from '@/lib/actions/tasks';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function UndoToast() {
  const { undoStack } = useUndo();
  const [isUndoing, setIsUndoing] = useState(false);
  const router = useRouter();

  const handleUndo = async () => {
    if (undoStack.length === 0 || isUndoing) return;

    setIsUndoing(true);
    const lastAction = undoStack[undoStack.length - 1];

    try {
      switch (lastAction.type) {
        case 'create':
          await deleteTaskAction(lastAction.task.id);
          break;
        case 'delete':
          await createTaskAction({
            title: lastAction.task.title,
            description: lastAction.task.description,
            status: lastAction.task.status,
            traditional_status: lastAction.task.traditional_status,
            priority_level: lastAction.task.priority_level,
            due_date: lastAction.task.due_date,
            project_id: lastAction.task.project_id,
            assignee_ids: lastAction.task.assignees?.map(a => a.id) || [],
          });
          break;
        case 'update':
          if (lastAction.previousState) {
            await updateTaskAction(lastAction.task.id, lastAction.previousState);
          }
          break;
      }
      // This is a bit of a hack to remove the last action.
      // A proper implementation would have a `removeUndoAction` in the context.
      (undoStack as unknown[]).pop();
      router.refresh();
    } catch (error) {
      console.error('Failed to undo action:', error);
    } finally {
      setIsUndoing(false);
    }
  };
  
  if (undoStack.length === 0) {
    return null;
  }

  const lastAction = undoStack[undoStack.length - 1];
  const message = {
    create: `Created task "${lastAction.task.title}"`,
    delete: `Deleted task "${lastAction.task.title}"`,
    update: `Updated task "${lastAction.task.title}"`,
  }[lastAction.type];

  return (
    <div className="fixed bottom-5 left-5 bg-background border p-4 rounded-lg shadow-lg flex items-center gap-4 z-50">
      <p className="text-sm">{message}</p>
      <Button size="sm" onClick={handleUndo} disabled={isUndoing}>
        {isUndoing ? 'Undoing...' : 'Undo'}
      </Button>
    </div>
  );
} 