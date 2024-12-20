import * as TaskRepository from '../repositories/task.repository';

export const getTasksByUserId = async (userId: number) => {
    return TaskRepository.getTasksByUserId(userId);
};

export const getTasksByDate = async (userId: number, date: Date) => {
  return TaskRepository.getTasksByDate(userId, date);
};

export const createTask = async (data: any) => {
    return TaskRepository.createTask(data);
};

export const updateTask = async (id: number, data: any, userId: number) => {
    const updatedTask = await TaskRepository.updateTask(id, data, userId);
    if (!updatedTask) {
        throw new Error('Task not found or unauthorized');
    }
    return updatedTask;
};

export const deleteTask = async (id: number, userId: number) => {
    const deletedTask = await TaskRepository.deleteTask(id, userId);
    if (!deletedTask) {
        throw new Error('Task not found or unauthorized');
    }
};
