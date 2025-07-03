import { Suspense } from "react";
import { getTasks } from "@/lib/database/tasks";
import { getProjects } from "@/lib/database/projects";
import { getAllUsers } from "@/lib/database/users";
import { TasksView } from "@/components/tasks/tasks-view";
import { TaskFilters } from "@/components/tasks/task-filters";
import { CreateTaskButton } from "@/components/tasks/create-task-button";
import { TaskViewToggle } from "@/components/tasks/task-view-toggle";

interface TasksPageProps {
  searchParams: Promise<{
    view?: 'list' | 'board';
    status?: 'todo' | 'in_progress' | 'done';
    priority?: '1' | '2' | '3' | '4';
    assignee?: string;
    project?: string;
    search?: string;
  }>;
}

async function TasksContent({ searchParams }: TasksPageProps) {
  const resolvedSearchParams = await searchParams;
  const view = resolvedSearchParams.view || 'list';
  
  // Build filters from search params
  const filters = {
    status: resolvedSearchParams.status,
    priority: resolvedSearchParams.priority ? parseInt(resolvedSearchParams.priority) as 1 | 2 | 3 | 4 : undefined,
    assignee: resolvedSearchParams.assignee,
    project: resolvedSearchParams.project,
    search: resolvedSearchParams.search,
  };

  const [tasksResult, projects, users] = await Promise.all([
    getTasks(filters),
    getProjects(),
    getAllUsers()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Manage and track your team&apos;s tasks
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TaskViewToggle currentView={view} />
          <CreateTaskButton projects={projects} users={users} />
        </div>
      </div>

      <TaskFilters
        projects={projects}
        users={users}
        currentFilters={filters}
      />

      <TasksView
        tasks={tasksResult.tasks}
        view={view}
        projects={projects}
        users={users}
      />
    </div>
  );
}

export default function TasksPage({ searchParams }: TasksPageProps) {
  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      <TasksContent searchParams={searchParams} />
    </Suspense>
  );
} 