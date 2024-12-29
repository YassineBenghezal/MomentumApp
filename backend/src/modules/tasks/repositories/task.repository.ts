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

    // Vérifie si la date sélectionnée est aujourd’hui ou une date passée
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isTodayOrPast = startOfDay.getTime() <= today.getTime();

    return prisma.task.findMany({
        where: {
            userId,
            OR: [
                {
                    deadline: {
                        gte: startOfDay,
                        lt: endOfDay, // Tâches pour la journée
                    },
                },
                // Tâches en retard uniquement si la date est aujourd’hui ou passée
                ...(isTodayOrPast
                    ? [
                          {
                              completed: false,
                              deadline: {
                                  lt: startOfDay, // Tâches en retard avant le début de la journée demandée
                              },
                          },
                      ]
                    : []),
            ],
        },
        orderBy: { deadline: 'asc' },
    });
};
