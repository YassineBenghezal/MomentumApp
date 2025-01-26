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

    const habits = await prisma.habit.findMany({
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
            tracking: true, // Inclure tous les suivis pour filtrer plus tard
        },
    });

    // Filter out habits that have already been completed the required number of times for the current period
    const filteredHabits = habits.filter(habit => {
        if (habit.frequency === 'CUSTOM') {
            const period = habit.period;
            const occurrences = habit.occurrences ?? 0;
            let periodStartDate = new Date(startOfDay);

            if (period === 'week') {
                // Adjust to start the week on Monday
                const day = periodStartDate.getDay();
                const diff = periodStartDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
                periodStartDate.setDate(diff);
            } else if (period === 'month') {
                periodStartDate.setDate(1);
            } else if (period === 'year') {
                periodStartDate.setMonth(0, 1);
            }

            const periodEndDate = new Date(periodStartDate);
            if (period === 'week') {
                periodEndDate.setDate(periodStartDate.getDate() + 6);
            } else if (period === 'month') {
                periodEndDate.setMonth(periodStartDate.getMonth() + 1, 0);
            } else if (period === 'year') {
                periodEndDate.setFullYear(periodStartDate.getFullYear() + 1, 0, 0);
            }

            const completedCount = habit.tracking.filter(track => {
                const trackDate = new Date(track.date);
                return trackDate >= periodStartDate && trackDate <= periodEndDate;
            }).length;

            // Ensure habits are visible on the day they are completed
            const isCompletedToday = habit.tracking.some(track => {
                const trackDate = new Date(track.date);
                return trackDate.getTime() === startOfDay.getTime();
            });
            
            return (completedCount < occurrences) || isCompletedToday;
        }
        return true;
    });

    return filteredHabits;
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
            const period = habit.period;
            const occurrences = habit.occurrences ?? 0;
            if (period === 'week') {
                while (currentDate <= today) {
                    expectedCompletions += occurrences;
                    currentDate.setDate(currentDate.getDate() + 7);
                }
            } else if (period === 'month') {
                while (currentDate <= today) {
                    expectedCompletions += occurrences;
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }
            } else if (period === 'year') {
                while (currentDate <= today) {
                    expectedCompletions += occurrences;
                    currentDate.setFullYear(currentDate.getFullYear() + 1);
                }
            }
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

const MILLISECONDS_IN_A_DAY = 86400000;

export const calculateStreaks = async (habitId: number, userId: number) => {
    const habit = await getHabitById(habitId, userId);
    if (!habit) {
        throw new Error('Habit not found');
    }

    const tracking = habit.tracking.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let bestStreak = 0;
    let currentStreak = 0;
    let streak = 0;
    let lastDate: Date | null = null; // Explicitly define the type of lastDate

    tracking.forEach((track, index) => {
        const trackDate = new Date(track.date);
        let isConsecutive = false;

        if (index === 0) {
            lastDate = trackDate; // Initialize lastDate with the first tracking date
        }

        switch (habit.frequency) {
            case 'DAILY':
                // Quotidienne : vérifie si la différence est exactement d'un jour
                isConsecutive = !!lastDate && (trackDate.getTime() - lastDate.getTime()) === MILLISECONDS_IN_A_DAY;
                break;
            case 'WEEKLY':
                if (lastDate) {
                    const dayDifference = (trackDate.getTime() - lastDate.getTime()) / MILLISECONDS_IN_A_DAY;
                    const daysOfWeekSet = new Set(habit.daysOfWeek.map(Number));
                    const lastDayOfWeek = (lastDate.getDay() + 6) % 7;
                    const currentDayOfWeek = (trackDate.getDay() + 6) % 7;
                    // Hebdomadaire : vérifie si la différence est d'au plus 7 jours et si les jours de la semaine sont dans les jours spécifiés
                    isConsecutive = dayDifference <= 7 && daysOfWeekSet.has(lastDayOfWeek) && daysOfWeekSet.has(currentDayOfWeek);
                }
                break;
            case 'MONTHLY':
                if (lastDate) {
                    const lastMonth = lastDate.getMonth();
                    const currentMonth = trackDate.getMonth();
                    const lastYear = lastDate.getFullYear();
                    const currentYear = trackDate.getFullYear();
                    // Mensuelle : vérifie si les mois et les années sont consécutifs
                    isConsecutive = (currentYear === lastYear && currentMonth === lastMonth) ||
                                    (currentYear === lastYear && currentMonth === lastMonth + 1) ||
                                    (currentYear === lastYear + 1 && currentMonth === 0 && lastMonth === 11);

                    if (isConsecutive) {
                        // Vérifie si toutes les dates spécifiées dans daysOfMonth sont complétées
                        const daysOfMonthSet = new Set(habit.daysOfMonth.map(Number));
                        const completedDays = habit.tracking.filter(track => {
                            const trackDate = new Date(track.date);
                            return trackDate.getMonth() === currentMonth && trackDate.getFullYear() === currentYear && daysOfMonthSet.has(trackDate.getDate());
                        }).length;
                        isConsecutive = completedDays === daysOfMonthSet.size;
                    }
                }
                break;
            case 'YEARLY':
                if (lastDate) {
                    const lastYear = lastDate.getFullYear();
                    const currentYear = trackDate.getFullYear();
                    // Annuelle : vérifie si l'année est consécutive
                    isConsecutive = currentYear === lastYear + 1;
                }
                break;
            case 'CUSTOM':
                // Personnalisée : vérifie si l'habitude a été complétée le nombre requis de fois dans la période
                const period = habit.period;
                const occurrences = habit.occurrences ?? 0;
                let periodStartDate = new Date(lastDate || trackDate);

                if (period === 'week') {
                    const day = periodStartDate.getDay();
                    const diff = periodStartDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
                    periodStartDate.setDate(diff);
                } else if (period === 'month') {
                    periodStartDate.setDate(1);
                } else if (period === 'year') {
                    periodStartDate.setMonth(0, 1);
                }

                const periodEndDate = new Date(periodStartDate);
                if (period === 'week') {
                    periodEndDate.setDate(periodStartDate.getDate() + 6);
                } else if (period === 'month') {
                    periodEndDate.setMonth(periodStartDate.getMonth() + 1, 0);
                } else if (period === 'year') {
                    periodEndDate.setFullYear(periodStartDate.getFullYear() + 1, 0, 0);
                }

                const completedCount = habit.tracking.filter(track => {
                    const trackDate = new Date(track.date);
                    return trackDate >= periodStartDate && trackDate <= periodEndDate;
                }).length;

                isConsecutive = completedCount >= occurrences;
                break;
            default:
                throw new Error('Unknown frequency');
        }

        if (isConsecutive) {
            streak++;
        } else {
            streak = 1; // Reset streak to 1 when interrupted
        }

        if (streak > bestStreak) {
            bestStreak = streak;
        }

        lastDate = trackDate;
    });

    // Vérifie si la dernière date de suivi est trop ancienne
    if (lastDate) {
        const today = new Date();
        let maxAllowedGap = 0;

        switch (habit.frequency) {
            case 'DAILY':
                maxAllowedGap = MILLISECONDS_IN_A_DAY;
                break;
            case 'WEEKLY':
                maxAllowedGap = 7 * MILLISECONDS_IN_A_DAY;
                break;
            case 'MONTHLY':
                maxAllowedGap = 31 * MILLISECONDS_IN_A_DAY; // Approximation pour un mois
                break;
            case 'YEARLY':
                maxAllowedGap = 366 * MILLISECONDS_IN_A_DAY; // Approximation pour une année
                break;
            case 'CUSTOM':
                const period = habit.period;
                if (period === 'week') {
                    maxAllowedGap = 7 * MILLISECONDS_IN_A_DAY;
                } else if (period === 'month') {
                    maxAllowedGap = 31 * MILLISECONDS_IN_A_DAY;
                } else if (period === 'year') {
                    maxAllowedGap = 366 * MILLISECONDS_IN_A_DAY;
                }
                break;
            default:
                throw new Error('Unknown frequency');
        }

        if ((today.getTime() - new Date(lastDate).getTime()) > maxAllowedGap) {
            currentStreak = 0; // Reset current streak to 0 if the last tracking date is too old
        } else {
            currentStreak = streak; // Update current streak if the last tracking date is recent enough
        }
    }

    // Diviser la série par le nombre d'entrées dans daysOfWeek, daysOfMonth, daysOfYear, ou occurrences pour CUSTOM
    switch (habit.frequency) {
        case 'WEEKLY':  
            currentStreak = Math.floor(currentStreak / habit.daysOfWeek.length);
            bestStreak = Math.floor(bestStreak / habit.daysOfWeek.length);
            break;
        case 'MONTHLY':   
            currentStreak = Math.floor(currentStreak / habit.daysOfMonth.length);
            bestStreak = Math.floor(bestStreak / habit.daysOfMonth.length);
            break;
        case 'YEARLY':
            currentStreak = Math.floor(currentStreak / habit.daysOfYear.length);
            bestStreak = Math.floor(bestStreak / habit.daysOfYear.length);
            break;
        case 'CUSTOM':
            currentStreak = Math.floor(currentStreak / (habit.occurrences ?? 1));
            bestStreak = Math.floor(bestStreak / (habit.occurrences ?? 1));
            break;
        default:
            break;
    }

    return { currentStreak, bestStreak };
};
