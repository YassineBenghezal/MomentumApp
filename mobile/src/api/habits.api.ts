import axios from 'axios';
import { getBaseURL } from './api.config';
import { Habit } from '../types/habit.types';

const API_URL = getBaseURL();

export const createHabit = async (habitData: any, token: string) => {
    const response = await axios.post(`${API_URL}/habits`, habitData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchHabits = async (token: string): Promise<Habit[]> => {
    try {
        const response = await axios.get(`${API_URL}/habits`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des habitudes :', error);
        throw error;
    }
};

export const trackHabit = async (habitId: number, token: string, date: string, value?: number): Promise<void> => {
    try {
        await axios.patch(
            `${API_URL}/habits/${habitId}/track`,
            { date, value },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    } catch (error) {
        console.error('Failed to track habit:', error);
        throw error;
    }
};