import { Router } from 'express';
import { getUserInfo } from '../controllers/user.controller';
import { authenticateUser } from '../../auth/middlewares/auth.middleware';

const router = Router();

router.get('/me', authenticateUser, getUserInfo);

export default router;
