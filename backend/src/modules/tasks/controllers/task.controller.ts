import { AuthenticatedRequest } from '../../../types/extendedRequest.types';
import { Response } from 'express';
import * as TaskService from '../services/task.service';

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const task = await TaskService.createTask({ ...req.body, userId: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const tasks = await TaskService.getTasksByUserId(req.user.id);
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
  
      const userId = req.user.id;
      const id = parseInt(req.params.id, 10);
      const updatedData = req.body;
  
      const task = await TaskService.updateTask(id, updatedData, userId);
  
      if (task.count === 0) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
  
      res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ error: 'Error updating task' });
    }
  };
  

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await TaskService.deleteTask(parseInt(req.params.id, 10), req.user.id);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
