import { Response } from 'express';
import { AuthenticatedRequest } from '../../../types/extendedRequest.types';
import { fetchUserHabits, addHabit } from '../services/habits.service';
import prisma from '../../../config/prisma.client';

const xpLevels = [0, 100, 200, 400, 800, 1600];
// Récupérer les habitudes de l'utilisateur connecté
export const getHabits = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const habits = await fetchUserHabits(userId);
        res.status(200).json(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
        res.status(500).json({ message: 'Failed to fetch habits' });
    }
};

// Ajouter une nouvelle habitude pour l'utilisateur connecté
export const createHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const habitData = {
            ...req.body,
            userId,
            reminderTime: req.body.reminderTime || null, // Nouveau champ
        };

        const newHabit = await prisma.habit.create({ data: habitData });

        res.status(201).json(newHabit);
    } catch (error) {
        console.error('Error creating habit:', error);
        res.status(400).json({ message: 'Failed to create habit' });
    }
};

// Mettre à jour une habitude existante
export const updateHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const updatedData = req.body;

        const habit = await prisma.habit.updateMany({
            where: { id: Number(id), userId },
            data: updatedData,
        });

        if (habit.count === 0) {
            res.status(404).json({ message: 'Habit not found or unauthorized' });
            return;
        }

        res.status(200).json({ message: 'Habit updated successfully' });
    } catch (error) {
        console.error('Error updating habit:', error);
        res.status(500).json({ message: 'Error updating habit' });
    }
};

// Supprimer une habitude existante
export const deleteHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;

        const habit = await prisma.habit.deleteMany({
            where: { id: Number(id), userId },
        });

        if (habit.count === 0) {
            res.status(404).json({ message: 'Habit not found or unauthorized' });
            return;
        }

        res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (error) {
        console.error('Error deleting habit:', error);
        res.status(500).json({ message: 'Error deleting habit' });
    }
};

export const completeHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Vérifier si l'habitude existe et appartient à l'utilisateur
        const habit = await prisma.habit.findFirst({
            where: { id: Number(id), userId },
        });

        if (!habit) {
            res.status(404).json({ error: "Habitude non trouvée" });
            return;
        }

        // Mettre à jour le statut de l'habitude
        await prisma.habit.update({
            where: { id: Number(id) },
            data: { status: "COMPLETÉ" },
        });

        // Ajouter 10 XP et mettre à jour le niveau utilisateur
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: "Utilisateur non trouvé" });
            return;
        }

        let newXp = user.xp + 10;
        let newLevel = user.level;

        if (newXp >= xpLevels[newLevel]) {
            newLevel += 1;
        }

        await prisma.user.update({
            where: { id: userId },
            data: { xp: newXp, level: newLevel },
        });

        res.json({ message: "Habitude complétée !", xp: newXp, level: newLevel });
    } catch (error) {
        console.error("Error completing habit:", error);
        res.status(500).json({ error: "Erreur interne" });
    }
};


