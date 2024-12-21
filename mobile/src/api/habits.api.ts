import axios from 'axios';
import { getBaseURL } from './api.config';

const API_URL = getBaseURL();

export const createHabit = async (habitData: any, token: string) => {
    const response = await axios.post(`${API_URL}/habits`, habitData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchHabitsByDate = async (date: string, token: string) => {
    const response = await axios.get(`${API_URL}/habits?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
