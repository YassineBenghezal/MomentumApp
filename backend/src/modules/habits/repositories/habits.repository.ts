import prisma from '../../../config/prisma.client';

export const getUserHabits = async (userId: number) => {
    return prisma.habit.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
};

export const createHabit = async (data: any) => {
    return prisma.habit.create({ data });
};

export const updateHabit = async (id: number, data: any, userId: number) => {
    return prisma.habit.updateMany({ where: { id, userId }, data });
};

export const deleteHabit = async (id: number, userId: number) => {
    return prisma.habit.deleteMany({ where: { id, userId } });
};

export const getHabitsForDate = async (userId: number, dayOfWeek: number, dayOfMonth: number, date: string) => {
    return prisma.habit.findMany({
        where: {
            userId,
            startDate: { lte: date }, // Habitude doit avoir commencé
            OR: [
                { endDate: null }, // Pas de date de fin
                { endDate: { gte: date } }, // Toujours valide
            ],
            AND: [
                {
                    OR: [
                        { frequency: 'daily' },
                        { frequency: 'weekly', days: { has: dayOfWeek.toString() } },
                        { frequency: 'monthly', days: { has: dayOfMonth.toString() } },
                    ],
                },
            ],
        },
    });
};

export const getTrackedHabitsForDate = async (userId: number, date: string) => {
    return prisma.habitTracking.findMany({ where: { userId, date } });
};
