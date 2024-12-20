import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
  baseURL: `http://${Constants.manifest.extra.expoGoDebugHost}:3000/api`,
});

export const fetchTasksAndHabits = async (date: string) => {
  const response = await api.get('/tasks-and-habits', { params: { date } });
  return response.data;
};
