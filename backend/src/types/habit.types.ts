import { Frequency, Category } from "@prisma/client";

export interface Habit {
    id: number;
    name: string;
    description?: string | null; // Optional
    category: Category; // Nouvelle propriété
    frequency: Frequency;
    occurrences?: number; // Nombre d'occurrences souhaitées dans la période
    days?: string[]; // Jours spécifiques pour weekly/monthly habits
    customDays?: Date[]; // Dates personnalisées
    startDate: Date;
    endDate?: Date; // Date de fin optionnelle
    reminderTime?: string | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    lastTrackedAt?: Date; // Dernière validation
}

export type CreateHabitDTO = Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'lastTrackedAt'>;
export type UpdateHabitDTO = Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>;