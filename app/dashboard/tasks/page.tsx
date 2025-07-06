import { Suspense } from "react";
export const dynamic = 'force-dynamic';

import { getTasks } from "@/lib/database/tasks";
import { getProjects } from "@/lib/database/projects";
import { getAllUsers } from "@/lib/database/users";
import { TasksView } from "@/components/tasks/tasks-view";
import { TaskViewToggle } from "@/components/tasks/task-view-toggle";
import { TaskFilters } from "@/components/tasks/task-filters";
import { CreateTaskButton } from "@/components/tasks/create-task-button";
import { TaskFilters as TaskFiltersType } from "@/lib/types";

interface TasksPageProps {
  searchParams: {
    view?: 'list' | 'board';
    status?: string;
    priority?: string;
    assignee?: string;
    project?: string;
  };
}

async function TasksContent({ searchParams }: TasksPageProps) {
  const filters: TaskFiltersType = {
    status: searchParams.status === 'done' ? 'done' : undefined,
    priority: searchParams.priority ? parseInt(searchParams.priority, 10) as 1 | 2 | 3 | 4 : undefined,
    project: searchParams.project,
    assignee: searchParams.assignee,
  };

  const [tasksResult, projects, users] = await Promise.all([
    getTasks(filters),
    getProjects(),
    getAllUsers(),
  ]);

  const { tasks } = tasksResult;
  
  const view = searchParams.view || 'list';

  return (
    <div>
      <div className="content-header">
        <div className="title-section">
          <h1>My work</h1>
          <div className="view-options">
            <TaskViewToggle currentView={view} />
          </div>
        </div>
        
        <div className="actions-section">
          <div className="search-box">
            <i>🔍</i>
            <input type="text" placeholder="Search..." />
          </div>
          
          <CreateTaskButton 
            projects={projects} 
            users={users}
          />
        </div>
      </div>

      <div className="controls-section">
        <TaskFilters 
          users={users}
          projects={projects}
          currentFilters={filters}
        />
        
        <div className="view-dropdown">
          <button>
            <span>👤</span>
            <span>Person</span>
            <span>▼</span>
          </button>
        </div>
      </div>

      <div style={{marginTop: '20px'}}>
        <TasksView 
          tasks={tasks} 
          view={view}
          projects={projects}
          users={users}
        />
      </div>
    </div>
  );
}

export default function TasksPage({ searchParams }: TasksPageProps) {
  return (
    <Suspense fallback={<div style={{color: 'var(--text-secondary)'}}>Loading tasks...</div>}>
      <TasksContent searchParams={searchParams} />
    </Suspense>
  );
} 