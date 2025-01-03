import axios from 'axios';
import { getAuthBaseURL } from './api.config';

const API_URL = getAuthBaseURL();

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data; // Retourne le token ou les données de l'utilisateur
};

export const signup = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/signup`, { username, password });
    return response.data;
};

export const getUserProfile = async (token: string) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
