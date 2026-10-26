import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthUser = {
  id: number;
  email: string;
  name?: string;
  [key: string]: unknown;
};

export type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

const AUTH_STORAGE_KEY = '@auth_store';

export const loadAuth = async (): Promise<AuthState> => {
  try {
    const saved = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(saved) as Partial<AuthState>;
    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null,
    };
  } catch (error) {
    return { token: null, user: null };
  }
};

export const saveAuth = async (auth: AuthState): Promise<void> => {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearAuth = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
};