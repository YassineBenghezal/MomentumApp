import prisma from '../../../config/prisma.client';
import { CreateTaskDTO } from '../../../types/task.types';

export const getTasksByUserId = async (userId: number) => {
    return prisma.task.findMany({ where: { userId }, orderBy: { deadline: 'asc' } });
};

export const createTask = async (data: CreateTaskDTO) => {
    
    return prisma.task.create({
        data: {
            ...data,
        },
    });
};

export const updateTask = async (id: number, data: any, userId: number) => {
    return prisma.task.updateMany({ where: { id, userId }, data });
};

export const deleteTask = async (id: number, userId: number) => {
    return prisma.task.deleteMany({ where: { id, userId } });
};

export const getTasksByDate = async (userId: number, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
        where: {
            userId,
            OR: [
                // Tâches non complétées dont la deadline est aujourd'hui ou dans le passé
                {
                    completed: false,
                    deadline: { lte: endOfDay },
                },
                // Tâches complétées uniquement pour la date de leur complétion
                {
                    completed: true,
                    completedAt: { gte: startOfDay, lte: endOfDay },
                },
            ],
        },
    });
};

export const toggleTaskInRepository = async (taskId: number, userId: number, completedAt?: Date) => {
    const completedDate = completedAt || new Date();
    return prisma.task.update({
        where: { id: taskId, userId },
        data: {
            completed: true,
            completedAt: completedDate,
        },
    });
};
