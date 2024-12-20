import * as TaskRepository from '../repositories/task.repository';
import * as HabitRepository from '../../habits/repositories/habits.repository';

export class TasksAndHabitsService {
    async getTasksAndHabits(userId: number, date: string) {
        const tasks = await TaskRepository.getTasksByDate(userId, new Date(date));
        const habits = await HabitRepository.getHabitsForDate(
            userId,
            new Date(date).getDay(), // Jour de la semaine
            new Date(date).getDate(), // Jour du mois
            new Date(date).toISOString() // Date complète en format ISO
        );
        return { tasks, habits };
    }
}
