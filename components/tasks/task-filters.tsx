"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Project, User, TaskFilters as TaskFiltersType } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TaskFiltersProps {
  projects: Project[];
  users: User[];
  currentFilters?: Partial<TaskFiltersType>;
}

export function TaskFilters({ 
  projects, 
  users, // eslint-disable-line @typescript-eslint/no-unused-vars
  currentFilters = {}
}: TaskFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard/tasks?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get('view')) {
      params.set('view', searchParams.get('view')!);
    }
    router.push(`/dashboard/tasks?${params.toString()}`);
  };

  const hasActiveFilters = Object.values(currentFilters).some(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={currentFilters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || null)}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-completed"
            checked={searchParams.get('status') === 'done'}
            onCheckedChange={(checked: boolean) => updateFilter('status', checked ? 'done' : null)}
          />
          <Label htmlFor="show-completed">Show Completed</Label>
        </div>
        
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {currentFilters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {currentFilters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('status', null)}
              />
            </Badge>
          )}
          {currentFilters.project && (
            <Badge variant="secondary" className="gap-1">
              Project: {projects.find(p => p.id === currentFilters.project)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('project', null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
} 