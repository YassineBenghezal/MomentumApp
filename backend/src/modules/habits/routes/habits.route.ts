import { Router } from 'express';
import { getHabits, createHabit, updateHabit, deleteHabit, getVisibleHabits, trackHabitCompletion, getHabitStats } from '../controllers/habits.controller';
import { authenticateUser } from '../../auth/middlewares/auth.middleware';

const router = Router();

router.get('/visible', authenticateUser, getVisibleHabits);
router.get('/', authenticateUser, getHabits);
router.post('/', authenticateUser, createHabit);
router.put('/:id', authenticateUser, updateHabit);
router.delete('/:id', authenticateUser, deleteHabit);
router.patch('/:id/track', authenticateUser, trackHabitCompletion);
router.get('/:id/stats', authenticateUser, getHabitStats);

export default router;
