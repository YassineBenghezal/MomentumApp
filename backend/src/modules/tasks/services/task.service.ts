import * as TaskRepository from '../repositories/task.repository';
import { CreateTaskDTO, UpdateTaskDTO } from '../../../types/task.types';

export const createTask = (data: CreateTaskDTO) => {
  return TaskRepository.createTask(data);
};

export const getTasksByUserId = (userId: number) => {
  return TaskRepository.getTasksByUserId(userId);
};

export const updateTask = async (id: number, data: UpdateTaskDTO, userId: number) => {
  const task = await TaskRepository.updateTask(id, data, userId);
  if (task.count === 0) throw new Error('Task not found or unauthorized');
  return task;
};

export const deleteTask = async (id: number, userId: number) => {
  const task = await TaskRepository.deleteTask(id, userId);
  if (task.count === 0) throw new Error('Task not found or unauthorized');
};
