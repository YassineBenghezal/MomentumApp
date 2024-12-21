import { AuthenticatedRequest } from '../../../types/extendedRequest.types';
import { Response } from 'express';
import * as TaskService from '../services/task.service';
import * as HabitService from '../../habits/services/habits.service';

export const getTasksAndHabitsForDay = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { date } = req.query;

    if (!req.user || !date) {
        res.status(400).json({ error: 'Invalid request. Date is required.' });
        return;
    }

    try {
        const userId = req.user.id;
        const selectedDate = new Date(date as string);

        const tasks = await TaskService.getTasksByDate(userId, selectedDate);
        const visibleHabits = await HabitService.getVisibleHabits(userId, selectedDate);

        res.status(200).json({ tasks, habits: visibleHabits });
    } catch (error) {
        console.error('Error fetching tasks and habits:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
