import * as HabitRepository from '../repositories/habits.repository';

export const fetchUserHabits = async (userId: number) => {
    return HabitRepository.getUserHabits(userId);
};

export const createHabit = async (data: any, userId: number) => {
    return HabitRepository.createHabit({ ...data, userId });
};

export const updateHabit = async (id: number, data: any, userId: number) => {
    const updatedHabit = await HabitRepository.updateHabit(id, data, userId);
    if (!updatedHabit) {
        throw new Error('Habit not found or unauthorized');
    }
    return updatedHabit;
};

export const deleteHabit = async (id: number, userId: number) => {
    const deletedHabit = await HabitRepository.deleteHabit(id, userId);
    if (!deletedHabit) {
        throw new Error('Habit not found or unauthorized');
    }
};

export const getVisibleHabits = async (userId: number, date: Date) => {
    const dayOfWeek = (date.getDay() + 6) % 7; // Numéro du jour de la semaine (0-6)
    const dayOfMonth = date.getDate(); // Numéro du jour dans le mois
    const currentDate = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Récupère toutes les habitudes actives pour la date
    const habits = await HabitRepository.getHabitsForDate(userId, dayOfWeek, dayOfMonth, currentDate);

    // Retourne directement toutes les habitudes actives
    return habits;
};

export const trackHabit = async (habitId: number, userId: number, date: Date, value?: number) => {
    return HabitRepository.toggleHabitCompletion(habitId, userId, date, value);
};

export const getHabitStats = async (habitId: number, userId: number) => {
    const habit = await HabitRepository.getHabitById(habitId, userId);
    if (!habit) {
        throw new Error('Habit not found or unauthorized');
    }

    const stats = await HabitRepository.calculateHabitStats(habitId, userId);
    const streaks = await HabitRepository.calculateStreaks(habitId, userId);
    return { stats, tracking: habit.tracking, ...streaks };
};

