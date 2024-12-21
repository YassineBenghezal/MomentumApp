import { Category, Priority,  } from "@prisma/client";

export interface Task {
  id: number;
  title: string;
  description?: string;
  category: Category; // Nouvelle propriété
  priority: Priority;
  deadline: string;
  completed: boolean;
  archived: boolean; // Already present
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskDTO = Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskDTO = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;