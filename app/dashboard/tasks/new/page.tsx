import { getProjects } from "@/lib/database/projects";
import { getAllUsers } from "@/lib/database/users";
import { CreateTaskForm } from "@/components/tasks/create-task-form";

export default async function NewTaskPage() {
  const [projects, users] = await Promise.all([
    getProjects(),
    getAllUsers()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Task</h2>
        <p className="text-muted-foreground">
          Add a new task to your workflow
        </p>
      </div>

      <CreateTaskForm projects={projects} users={users} />
    </div>
  );
} 