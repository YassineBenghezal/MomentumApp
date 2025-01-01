export interface HabitTracking {
    id: number;
    date: Date; // Date when the habit was validated
    habitId: number;
    userId: number | null; // Aligné avec le schéma Prisma
    completed: boolean; // Champ pour indiquer si l'habitude a été complétée
    value?: number | null; // Optionnel, pour les habitudes quantifiables
    createdAt: Date; // Automatique
    updatedAt?: Date; // Automatique, géré par Prisma
}