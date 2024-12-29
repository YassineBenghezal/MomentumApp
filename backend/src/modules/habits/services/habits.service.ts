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
    const dayOfWeek = date.getDay(); // Numéro du jour de la semaine (0-6)
    const dayOfMonth = date.getDate(); // Numéro du jour dans le mois
    const currentDate = date.toISOString().split('T')[0]; // YYYY-MM-DD

    console.log(`Fetching habits for userId: ${userId}, date: ${currentDate}`);

    // Récupère toutes les habitudes actives pour la date
    const habits = await HabitRepository.getHabitsForDate(userId, dayOfWeek, dayOfMonth, currentDate);
    console.log(`Found active habits: ${habits.length}`);

    // Retourne directement toutes les habitudes actives
    return habits;
};

