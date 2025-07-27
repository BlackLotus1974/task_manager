"use server";

import { createTask, updateTask, deleteTask, getTaskById } from "@/lib/database/tasks";
import { revalidatePath } from "next/cache";
import { 
  CustomStatus, 
  TraditionalStatus, 
  PriorityLevel
} from "@/lib/types";

export async function createTaskAction(formData: {
  title: string;
  description?: string;
  status?: CustomStatus;
  traditional_status?: TraditionalStatus;
  priority?: PriorityLevel;
  priority_level?: PriorityLevel;
  due_date?: string;
  project_id?: string;
  assignee_ids?: string[];
}) {
  try {
    const task = await createTask(formData);
    revalidatePath("/dashboard/tasks");
    return { success: true, task };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskAction(
  taskId: string,
  formData: {
    title?: string;
    description?: string;
    status?: CustomStatus;
    traditional_status?: TraditionalStatus;
    priority?: PriorityLevel;
    priority_level?: PriorityLevel;
    due_date?: string;
    project_id?: string;
  }
) {
  try {
    // Handle "done" status in both systems
    const isDoneCustom = formData.status === 'done';
    const isDoneTraditional = formData.traditional_status === 'done';
    
    if (isDoneCustom || isDoneTraditional) {
      await deleteTask(taskId);
      revalidatePath("/dashboard/tasks");
      return { success: true, deleted: true };
    }
    
    const task = await updateTask(taskId, formData);
    revalidatePath("/dashboard/tasks");
    return { success: true, task };
  } catch (error: unknown) {
    console.error("Failed to update task:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update task" };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    await deleteTask(taskId);
    revalidatePath("/dashboard/tasks");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function getTaskAction(taskId: string) {
  try {
    const task = await getTaskById(taskId);
    return { success: true, task };
  } catch (error) {
    console.error("Failed to get task:", error);
    return { success: false, error: "Failed to get task" };
  }
}

// New action for traditional status system compatibility
export async function updateTaskStatusAction(
  taskId: string,
  status: TraditionalStatus,
  priority?: PriorityLevel
) {
  try {
    if (status === 'done') {
      await deleteTask(taskId);
      revalidatePath("/dashboard/tasks");
      return { success: true, deleted: true };
    }
    
    const task = await updateTask(taskId, {
      traditional_status: status,
      priority_level: priority
    });
    revalidatePath("/dashboard/tasks");
    return { success: true, task };
  } catch (error: unknown) {
    console.error("Failed to update task status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update task status" };
  }
}

// New action for custom status system compatibility
export async function updateTaskCustomStatusAction(
  taskId: string,
  status: CustomStatus
) {
  try {
    if (status === 'done') {
      await deleteTask(taskId);
      revalidatePath("/dashboard/tasks");
      return { success: true, deleted: true };
    }
    
    const task = await updateTask(taskId, { status });
    revalidatePath("/dashboard/tasks");
    return { success: true, task };
  } catch (error: unknown) {
    console.error("Failed to update task custom status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update task custom status" };
  }
} 