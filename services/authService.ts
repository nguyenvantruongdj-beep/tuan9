import axios from 'axios';
import { Platform } from 'react-native';

export type AuthUser = {
  id: number;
  email: string;
  name?: string;
  [key: string]: unknown;
};

export type AuthResponse = {
  accessToken?: string;
  token?: string;
  user: AuthUser;
};

const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
});

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data as AuthResponse;
  } catch (error) {
    throw error;
  }
};

export const register = async (
  email: string,
  password: string,
  name?: string,
): Promise<AuthResponse> => {
  try {
    const response = await api.post('/register', {
      email,
      password,
      ...(name ? { name } : {}),
    });

    return response.data as AuthResponse;
  } catch (error) {
    throw error;
  }
};