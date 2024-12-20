import { AuthenticatedRequest } from '../../../types/extendedRequest.types';
import { Response } from 'express';
import * as TaskService from '../services/task.service';

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const tasks = await TaskService.getTasksByUserId(req.user.id);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const task = await TaskService.createTask({ ...req.body, userId: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: 'Failed to create task' });
    }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const updatedTask = await TaskService.updateTask(parseInt(id, 10), req.body, req.user.id);
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        await TaskService.deleteTask(parseInt(id, 10), req.user.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
};
