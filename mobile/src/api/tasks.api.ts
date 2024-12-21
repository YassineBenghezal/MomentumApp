import axios from 'axios';
import { getBaseURL } from './api.config';

const API_URL = getBaseURL();

export const createTask = async (taskData: any, token: string) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const fetchTasksByDate = async (date: string, token: string) => {
    const response = await axios.get(`${API_URL}/tasks?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
