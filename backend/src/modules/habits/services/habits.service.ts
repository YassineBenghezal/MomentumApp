import { getUserHabits, createHabit } from '../repositories/habits.repository';

export const fetchUserHabits = async (userId: number) => {
    return await getUserHabits(userId);
};

export const addHabit = async (habitData: any) => {
    return await createHabit(habitData);
};
