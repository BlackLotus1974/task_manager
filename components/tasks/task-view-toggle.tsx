"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { List, Kanban } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskViewToggleProps {
  currentView: 'list' | 'board';
}

export function TaskViewToggle({ currentView }: TaskViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setView = (view: 'list' | 'board') => {
    const params = new URLSearchParams(searchParams);
    params.set('view', view);
    router.push(`/dashboard/tasks?${params.toString()}`);
  };

  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView('list')}
        className={cn(
          "rounded-r-none",
          currentView === 'list' && "bg-muted"
        )}
      >
        <List className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">List</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView('board')}
        className={cn(
          "rounded-l-none",
          currentView === 'board' && "bg-muted"
        )}
      >
        <Kanban className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Board</span>
      </Button>
    </div>
  );
} 