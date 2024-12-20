import prisma from '../../../config/prisma.client';

export const getTasksByUserId = async (userId: number) => {
    return prisma.task.findMany({ where: { userId }, orderBy: { deadline: 'asc' } });
};

export const createTask = async (data: any) => {
    return prisma.task.create({ data });
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
          deadline: {
              gte: startOfDay,
              lt: endOfDay,
          },
      },
      orderBy: { deadline: 'asc' },
  });
};
