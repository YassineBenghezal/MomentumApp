import prisma from '../../../config/prisma.client';
import { Habit } from '../../../types/habit.types';

export const getUserHabits = async (userId: number): Promise<Habit[]> => {
    return prisma.habit.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};

export const createHabit = async (data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> => {
    return prisma.habit.create({
        data,
    });
};
