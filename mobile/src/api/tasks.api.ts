import axios from 'axios';
import { getBaseURL } from './api.config';
import { Task } from '../types/task.types';

const API_URL = getBaseURL();

export const createTask = async (taskData: any, token: string) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchTasks = async (token: string): Promise<Task []> => {
    try {
        const response = await axios.get(`${API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        throw error;
    }
};

export const toggleTaskComplete = async (taskId: number, token: string, completedAt?: string): Promise<Task> => {
    try {
        const response = await axios.patch(
            `${API_URL}/tasks/${taskId}/toggle-completion`,
            { date: completedAt },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to toggle task completion:', error);
        throw error;
    }
};

export const deleteTask = async (taskId: number, token: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Failed to delete task:', error);
        throw error;
    }
};

export const updateTask = async (taskId: number, taskData: any, token: string): Promise<Task> => {
    try {
        const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update task:', error);
        throw error;
    }
};
