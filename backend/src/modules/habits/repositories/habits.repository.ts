import prisma from '../../../config/prisma.client';
import { CreateHabitDTO, UpdateHabitDTO } from '../../../types/habit.types';

export const getUserHabits = async (userId: number) => {
    return prisma.habit.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
};

export const createHabit = async (data: CreateHabitDTO) => {
    return prisma.habit.create({
        data: {
            ...data,
            daysOfYear: {
                create: data.daysOfYear?.map((day) => ({
                    month: day.month,
                    day: day.day,
                })),
            },
        },
    });
};

export const updateHabit = async (id: number, data: UpdateHabitDTO, userId: number) => {
    // Supprimer les anciens jours de l'année et ajouter les nouveaux
    if (data.daysOfYear) {
        await prisma.daysOfYear.deleteMany({
            where: { habitId: id },
        });

        await prisma.daysOfYear.createMany({
            data: data.daysOfYear.map((day) => ({
                habitId: id,
                month: Number(day.month),
                day: Number(day.day),
            })),
        });
    }

    // Mettre à jour les autres champs de l'habitude
    const { daysOfYear, ...habitData } = data; // Exclure `daysOfYear` pour éviter les erreurs
    return prisma.habit.update({
        where: { id },
        data: {
            ...habitData,
        },
    });
};

export const deleteHabit = async (id: number, userId: number) => {
    return prisma.habit.deleteMany({ where: { id, userId } });
};

export const getHabitsForDate = async (userId: number, dayOfWeek: number, dayOfMonth: number, date: string) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.habit.findMany({
        where: {
            userId,
            startDate: { lte: endOfDay },
            OR: [{ endDate: null }, { endDate: { gte: startOfDay } }],
            AND: [
                {
                    OR: [
                        { frequency: "DAILY" },
                        {
                            frequency: "WEEKLY",
                            daysOfWeek: { has: String(dayOfWeek) },
                        },
                        {
                            frequency: "MONTHLY",
                            daysOfMonth: { has: dayOfMonth === 31 ? "Dernier" : String(dayOfMonth) },
                        },
                        {
                            frequency: "YEARLY",
                            daysOfYear: {
                                some: {
                                    month: startOfDay.getMonth() + 1,
                                    day: startOfDay.getDate(),
                                },
                            },
                        },
                        {
                            frequency: "CUSTOM",
                            occurrences: { gt: 0 },
                        },
                    ],
                },
            ],
        },
        include: {
            daysOfYear: true, // Inclure les jours spécifiques de l'année
            tracking: {
                where: { date: { gte: startOfDay, lte: endOfDay } },
            },
        },
    });
};

export const trackHabit = async (habitId: number, userId: number, date: Date, value?: number) => {
    return prisma.habitTracking.upsert({
        where: {
            habitId_date_userId: {
                habitId,
                date: date.toISOString(),
                userId,
            },
        },
        update: {
            completed: value === undefined,
            value: value ?? null,
        },
        create: {
            habitId,
            userId,
            date: date.toISOString(),
            completed: value === undefined,
            value: value ?? null,
        },
    });
};

export const getTrackedHabitsForDate = async (userId: number, date: string) => {
    return prisma.habitTracking.findMany({ where: { userId, date } });
};
