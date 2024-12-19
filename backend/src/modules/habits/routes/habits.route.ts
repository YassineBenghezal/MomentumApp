import { Router } from 'express';
import { getHabits, createHabit, updateHabit, deleteHabit, completeHabit } from '../controllers/habits.controller';
import { authenticateUser } from '../../auth/middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateUser, getHabits);
router.post('/', authenticateUser, createHabit);
router.put('/:id', authenticateUser, updateHabit);
router.delete('/:id', authenticateUser, deleteHabit);
router.post('/:id/complete', authenticateUser, completeHabit);


export default router;
