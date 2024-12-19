import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticateUser } from '../../auth/middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateUser, getTasks);
router.post('/', authenticateUser, createTask);
router.put('/:id', authenticateUser, updateTask);
router.delete('/:id', authenticateUser, deleteTask);

export default router;
