import prisma from '../../../config/prisma.client';
import { CreateTaskDTO } from '../../../types/task.types';
import { startOfDay, endOfDay } from 'date-fns';

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
    const today = startOfDay(new Date()); // Début de la journée actuelle
    const start = startOfDay(date); // Début de la journée sélectionnée
    const end = endOfDay(date); // Fin de la journée sélectionnée

    const isToday = today.getTime() === start.getTime(); // Vérifie si la date sélectionnée est aujourd'hui

    return prisma.task.findMany({
        where: {
            userId,
            OR: [
                {
                    // Tâches prévues pour la journée sélectionnée
                    completed: false,
                    deadline: {
                        gte: start,
                        lte: end,
                    },
                },
                {
                    // Tâches complétées pour la journée sélectionnée
                    completedAt: {
                        gte: start,
                        lte: end,
                    },
                },
                ...(isToday
                    ? [
                          {
                              // Aujourd'hui uniquement : tâches en retard non complétées
                              AND: [
                                  { deadline: { lt: start } },
                                  { completed: false },
                              ],
                          },
                      ]
                    : []),
            ],
        },
    });
};

export const toggleTaskCompletion = async (taskId: number, date: Date) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
    });

    if (!task) throw new Error('Task not found.');

    const selectedDate = date instanceof Date ? date : new Date(date);

    const isCompletedToday =
        task.completedAt?.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];

    return prisma.task.update({
        where: { id: taskId },
        data: {
            completed: !task.completed || !isCompletedToday, // Passe à false si déjà complétée aujourd'hui
            completedAt: task.completed && isCompletedToday ? null : date, // Supprime completedAt si décoché
        },
    });
};
;
