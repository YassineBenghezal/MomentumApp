import { Frequency, Category } from "@prisma/client";

export interface Habit {
    id: number;
    name: string;
    description?: string | null;
    category: Category;
    frequency: Frequency;
    occurrences?: number; // Nombre d'occurrences prévues
    period?: 'week' | 'month' | 'year'; // Période pour CUSTOM
    daysOfWeek?: string[]; // Jours spécifiques pour la semaine (0 = Dimanche, 6 = Samedi)
    daysOfMonth?: string[]; // Jours spécifiques pour le mois (1-31 ou "Dernier")
    daysOfYear?: { month: number; day: number }[]; // Jours spécifiques pour l'année
    customDays?: Date[]; // Dates personnalisées
    startDate: Date;
    endDate?: Date | null; // Date de fin optionnelle
    completionMode: 'BINARY' | 'NUMERIC'; // Mode de complétion
    unit?: string; // Unité pour les habitudes numériques
    reminderTime?: string | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    lastTrackedAt?: Date; // Dernière validation
}

export type CreateHabitDTO = Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'lastTrackedAt'>;
export type UpdateHabitDTO = Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>;