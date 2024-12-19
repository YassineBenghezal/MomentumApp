import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/routes/auth.routes';
import habitsRoutes from './modules/habits/routes/habits.route';
import userRoutes from './modules/user/routes/user.routes';
import tasksRoutes from './modules/tasks/routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS
app.use(cors());

// Middleware pour gérer JSON
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', tasksRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
