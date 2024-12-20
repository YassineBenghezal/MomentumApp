import { Response } from 'express';
import { AuthenticatedRequest } from '../../../types/extendedRequest.types';
import * as HabitService from '../services/habits.service';

export const getHabits = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const habits = await HabitService.fetchUserHabits(req.user.id);
        res.status(200).json(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
        res.status(500).json({ message: 'Failed to fetch habits' });
    }
};

export const createHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const habit = await HabitService.createHabit(req.body, req.user.id);
        res.status(201).json(habit);
    } catch (error) {
        console.error('Error creating habit:', error);
        res.status(400).json({ message: 'Failed to create habit' });
    }
};

export const updateHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const updatedHabit = await HabitService.updateHabit(parseInt(id, 10), req.body, req.user.id);
        res.status(200).json(updatedHabit);
    } catch (error) {
        console.error('Error updating habit:', error);
        res.status(500).json({ message: 'Error updating habit' });
    }
};

export const deleteHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        await HabitService.deleteHabit(parseInt(id, 10), req.user.id);
        res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (error) {
        console.error('Error deleting habit:', error);
        res.status(500).json({ message: 'Error deleting habit' });
    }
};

export const getVisibleHabits = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { date } = req.query;

    if (!req.user || !date) {
        res.status(400).json({ error: 'Invalid request. Date is required.' });
        return;
    }

    try {
        const visibleHabits = await HabitService.getVisibleHabits(req.user.id, new Date(date as string));
        res.status(200).json(visibleHabits);
    } catch (error) {
        console.error('Error fetching visible habits:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
