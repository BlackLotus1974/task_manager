"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";
import { Project, User } from "@/lib/types";

interface CreateTaskButtonProps {
  projects: Project[];
  users: User[];
}

export function CreateTaskButton({ projects, users }: CreateTaskButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
      
      <CreateTaskDialog
        open={open}
        onOpenChange={setOpen}
        projects={projects}
        users={users}
      />
    </>
  );
} 