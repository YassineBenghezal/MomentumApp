import { Router } from 'express';
import { authenticateUser } from '../../auth/middlewares/auth.middleware';
import { getTasksAndHabitsForDay } from '../controllers/tasksAndHabits.controller';

const router = Router();

router.get('/day', authenticateUser, getTasksAndHabitsForDay);

export default router;
