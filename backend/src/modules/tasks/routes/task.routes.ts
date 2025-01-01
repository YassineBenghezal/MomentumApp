import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask, toggleTaskCompletion } from '../controllers/task.controller';
import { authenticateUser } from '../../auth/middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateUser, getTasks);
router.post('/', authenticateUser, createTask);
router.put('/:id', authenticateUser, updateTask);
router.delete('/:id', authenticateUser, deleteTask);
router.patch('/:id/toggle-completion', authenticateUser, toggleTaskCompletion);

export default router;
