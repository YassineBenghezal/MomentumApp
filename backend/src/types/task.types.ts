import { Priority } from "@prisma/client";

export interface Task {
    id: number;
    title: string;
    description?: string;
    priority: Priority;
    deadline: string;
    completed: boolean;
    userId: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export type CreateTaskDTO = Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>;
  
  export type UpdateTaskDTO = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;