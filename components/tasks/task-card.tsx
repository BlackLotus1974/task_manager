"use client";

import Link from "next/link";
import { Task } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MessageSquare, Paperclip } from "lucide-react";
import { InlineStatusEditor } from "./inline-status-editor";
import { InlineDateEditor } from "./inline-date-editor";

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, deleted: boolean) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

  const handleStatusChange = (taskId: string, deleted: boolean) => {
    onStatusChange?.(taskId, deleted);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Link 
            href={`/dashboard/tasks/${task.id}`}
            className="font-medium hover:underline line-clamp-2 flex-1"
          >
            {task.title}
          </Link>
          <div className="flex items-center space-x-1 ml-2">
            <InlineStatusEditor task={task} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            {task.due_date && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
                <Calendar className="h-3 w-3" />
                <InlineDateEditor task={task} />
              </div>
            )}
            
            {!task.due_date && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <InlineDateEditor task={task} />
              </div>
            )}
            
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{task.assignees.length}</span>
              </div>
            )}
            
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments.length}</span>
              </div>
            )}
            
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>
          
          {task.project && (
            <Badge variant="outline" className="text-xs">
              {task.project.name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 