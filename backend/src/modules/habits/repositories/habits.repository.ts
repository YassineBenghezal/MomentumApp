import { startOfDay } from 'date-fns';
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
            tracking: {
                create: data.tracking?.map((track) => ({
                    date: track.date,
                    value: track.value,
                    completed: track.completed,
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
    const { daysOfYear, tracking, ...habitData } = data; // Exclure `daysOfYear` et `tracking` pour éviter les erreurs

    // Mettre à jour le champ `tracking`
    if (tracking) {
        await prisma.habitTracking.deleteMany({
            where: { habitId: id },
        });

        await prisma.habitTracking.createMany({
            data: tracking.map((track) => ({
                habitId: id,
                date: track.date,
                value: track.value,
                completed: track.completed,
            })),
        });
    }

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

    // Determine the last day of the month
    const lastDayOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth() + 1, 0).getDate();

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
                            daysOfMonth: {
                                has: dayOfMonth === lastDayOfMonth ? "Dernier" : String(dayOfMonth),
                            },
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

export const toggleHabitCompletion = async (habitId: number, userId: number, date: Date, value?: number) => {

    const tracking = await prisma.habitTracking.findUnique({
        where: {
            habitId_date_userId: {
                habitId,
                date,
                userId,
            },
        },
    });

    if (tracking) {
        if (value !== undefined) {
            // Update the existing tracking entry with the new value
            await prisma.habitTracking.update({
                where: { id: tracking.id },
                data: { value },
            });
        } else {
            // Delete the tracking entry if no value is provided
            await prisma.habitTracking.delete({
                where: { id: tracking.id },
            });
        }
    } else {
        // Create a new tracking entry if it doesn't exist
        await prisma.habitTracking.create({
            data: {
                habitId,
                userId,
                date,
                completed: true,
                value: value || null,
            },
        });
    }

    return prisma.habit.findUnique({
        where: { id: habitId },
        include: { tracking: true },
    });
};

export const deleteHabitTracking = async (habitId: number, userId: number, date: Date) => {
    return prisma.habitTracking.deleteMany({
        where: {
            habitId,
            userId,
            date,
        },
    });
};

export const getTrackedHabitsForDate = async (userId: number, date: string) => {
    return prisma.habitTracking.findMany({ where: { userId, date } });
};

export const getHabitById = async (habitId: number, userId: number) => {
    return prisma.habit.findFirst({
        where: { id: habitId, userId },
        include: { tracking: true, daysOfYear: true }, // Include daysOfYear
    });
};

export const calculateHabitStats = async (habitId: number, userId: number) => {
    const habit = await getHabitById(habitId, userId);
    if (!habit) {
        throw new Error('Habit not found');
    }

    const startDate = new Date(habit.startDate);
    const today = new Date();
    const completedTracked = habit.tracking.length;
    let currentDate = new Date(startDate);

    let expectedCompletions = 0;

    switch (habit.frequency) {
        case 'DAILY':
            const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            expectedCompletions = totalDays;
            break;
        case 'WEEKLY':
            const dayOfWeekSet = new Set(habit.daysOfWeek.map(Number));        
            while (currentDate <= today) {
                if (dayOfWeekSet.has((currentDate.getDay() + 6) % 7)) {
                    expectedCompletions++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            console.log('expectedCompletions', expectedCompletions);
            
            break;
        case 'MONTHLY':
            const months = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
            expectedCompletions = months * habit.daysOfMonth.length;
            break;
        case 'YEARLY':
            const years = today.getFullYear() - startDate.getFullYear();
            expectedCompletions = years * habit.daysOfYear.length;
            break;
        case 'CUSTOM':
            expectedCompletions = habit.occurrences ?? 0;
            break;
        default:
            throw new Error('Unknown frequency');
    }

    const completionRate = (completedTracked / expectedCompletions) * 100;

    return {
        habit,
        completionRate,
    };
};
