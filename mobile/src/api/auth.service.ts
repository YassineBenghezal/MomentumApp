import axios from 'axios';
import Constants from 'expo-constants';

// Configuration de l'instance Axios
const getBaseURL = () => {
  if (Constants.manifest2?.extra?.expoGoDebugHost) {
    return `http://${Constants.manifest2.extra.expoGoDebugHost}:3000/auth`;
  }
  if (Constants.manifest?.debuggerHost) {
    const host = Constants.manifest.debuggerHost.split(':').shift();
    return `http://${host}:3000/auth`;
  }
  // Fallback par défaut
  return 'http://192.168.48.140:3000/auth'; // Remplacez par votre IP locale
};

const api = axios.create({
  baseURL: getBaseURL(),
});

export const signup = async (username: string, password: string) => {
  try {
    const response = await api.post('/signup', { username, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
};

export const login = async (username: string, password: string) => {
  try {
    console.log('Login request:', { username, password });
    console.log('API:', api.defaults.baseURL);
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw error;
    }
  }
};
