"use server";

import { createTask, updateTask, deleteTask, getTaskById } from "@/lib/database/tasks";
import { revalidatePath } from "next/cache";

export async function createTaskAction(formData: {
  title: string;
  description?: string;
  priority: 1 | 2 | 3 | 4;
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
    status?: "todo" | "in_progress" | "done";
    priority?: 1 | 2 | 3 | 4;
    due_date?: string;
    project_id?: string;
  }
) {
  try {
    const task = await updateTask(taskId, formData);
    revalidatePath("/dashboard/tasks");
    return { success: true, task };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { success: false, error: "Failed to update task" };
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