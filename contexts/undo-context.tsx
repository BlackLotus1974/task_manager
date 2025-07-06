"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Task } from '@/lib/types';

export type UndoActionType = 'create' | 'update' | 'delete';

export interface UndoAction {
  type: UndoActionType;
  task: Task;
  previousState?: Partial<Task>;
  timestamp: number;
}

interface UndoContextType {
  addUndoAction: (action: Omit<UndoAction, 'timestamp'>) => void;
  undoStack: UndoAction[];
  executeUndo: () => void;
  isUndoing: boolean;
}

const UndoContext = createContext<UndoContextType | undefined>(undefined);

export const UndoProvider = ({ children }: { children: ReactNode }) => {
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [isUndoing, setIsUndoing] = useState(false);

  const addUndoAction = useCallback((action: Omit<UndoAction, 'timestamp'>) => {
    const newAction: UndoAction = { ...action, timestamp: Date.now() };
    setUndoStack(prev => [...prev.slice(-4), newAction]); // Keep last 5 actions
  }, []);

  const executeUndo = useCallback(async () => {
    // Logic to execute the undo will be in the UndoToast component
  }, []);

  // Auto-clear old undo actions
  useEffect(() => {
    if (undoStack.length > 0) {
      const timer = setTimeout(() => {
        setUndoStack(prev => prev.slice(1));
      }, 7000); // 7 seconds to undo
      return () => clearTimeout(timer);
    }
  }, [undoStack]);
  
  return (
    <UndoContext.Provider value={{ undoStack, addUndoAction, executeUndo, isUndoing }}>
      {children}
    </UndoContext.Provider>
  );
};

export const useUndo = (): UndoContextType => {
  const context = useContext(UndoContext);
  if (!context) {
    throw new Error('useUndo must be used within an UndoProvider');
  }
  return context;
}; 