import axios from 'axios';
import { getBaseURL } from './api.config';

const API_URL = getBaseURL();

export const fetchTasksAndHabits = async (date: string, token: string) => {
    console.log('Fetching tasks and habits for date:', date);
    const response = await axios.get(`${API_URL}/tasks-and-habits/day`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: { date },
    });
    console.log('Data:', response.data);
    return response.data;
};
