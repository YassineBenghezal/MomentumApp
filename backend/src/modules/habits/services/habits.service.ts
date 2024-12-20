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
    const dayOfWeek = date.getDay();
    const currentDate = date.toISOString();

    const habits = await HabitRepository.getHabitsForDate(userId, dayOfWeek, date.getDate(), currentDate);

    const trackedHabits = await HabitRepository.getTrackedHabitsForDate(userId, currentDate);
    const trackedIds = trackedHabits.map((tracking) => tracking.habitId);

    return habits.filter((habit) => !trackedIds.includes(habit.id));
};
