import { Frequency, Status } from "@prisma/client";

export interface Habit {
    id: number;
    name: string;
    description?: string | null; // Facultatif
    frequency: Frequency;
    status: Status;
    reminderTime?: string | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateHabitDTO = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateHabitDTO = Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>;