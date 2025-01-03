import axios from 'axios';
import { getBaseURL } from './api.config';
import { Habit, Tracking } from '../types/habit.types';

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

export const trackHabit = async (habitId: number, token: string, date: string, value?: number): Promise<Habit> => {
    try {
        const response = await axios.patch(
            `${API_URL}/habits/${habitId}/track`,
            { date, value },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to track habit:', error);
        throw error;
    }
};

export const deleteHabit = async (habitId: number, token: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/habits/${habitId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Failed to delete habit:', error);
        throw error;
    }
};

export const updateHabit = async (habitId: number, habitData: any, token: string): Promise<Habit> => {
    try {
        const response = await axios.put(`${API_URL}/habits/${habitId}`, habitData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update habit:', error);
        throw error;
    }
};

export const fetchHabitStats = async (token: string, habitId: number): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/habits/${habitId}/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Stats:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
        throw error;
    }
};