import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import electraApi from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSession(); }, []);

  const loadSession = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('electra_token');
      const savedUser = await AsyncStorage.getItem('electra_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {}
    setLoading(false);
  };

  const signIn = async (email, password) => {
    const data = await electraApi.login(email, password);
    if (data.ok) {
      await AsyncStorage.setItem('electra_token', data.token);
      await AsyncStorage.setItem('electra_user', JSON.stringify(data.user));
      setToken(data.token); setUser(data.user);
      return { error: null };
    }
    return { error: data.error || 'Erro ao entrar' };
  };

  const signUp = async (name, email, password, phone) => {
    const data = await electraApi.register(name, email, password, phone);
    if (data.ok) {
      await AsyncStorage.setItem('electra_token', data.token);
      await AsyncStorage.setItem('electra_user', JSON.stringify(data.user));
      setToken(data.token); setUser(data.user);
      return { error: null };
    }
    return { error: data.error || 'Erro ao cadastrar' };
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('electra_token');
    await AsyncStorage.removeItem('electra_user');
    setToken(null); setUser(null);
  };

  return { user, token, loading, signIn, signUp, signOut, session: user ? { user } : null };
}
