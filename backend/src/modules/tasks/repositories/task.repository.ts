import prisma from "../../../config/prisma.client";
import { CreateTaskDTO, UpdateTaskDTO } from "../../../types/task.types";

export const createTask = (data: CreateTaskDTO) => {
  return prisma.task.create({ data });
};

export const getTasksByUserId = (userId: number) => {
  return prisma.task.findMany({ where: { userId } });
};

export const updateTask = (id: number, data: UpdateTaskDTO, userId: number) => {
  return prisma.task.updateMany({
    where: { id, userId },
    data,
  });
};

export const deleteTask = (id: number, userId: number) => {
  return prisma.task.deleteMany({
    where: { id, userId },
  });
};
