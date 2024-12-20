export interface HabitTracking {
    id: number;
    date: Date; // Date when the habit was validated
    lastTrackedAt?: Date; // Optional, for optimization
    habitId: number;
    userId: number;
    createdAt: Date;
}
