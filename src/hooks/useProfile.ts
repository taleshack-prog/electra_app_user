import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import electraApi from '../lib/api';

export interface Profile {
  id: string;
  nome: string;
  name?: string;
  email: string;
  telefone?: string;
  phone?: string;
  nivel?: string;
  level?: string;
  pontos?: number;
  points?: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('electra_token');
      const savedUser = await AsyncStorage.getItem('electra_user');
      if (token && savedUser) {
        const user = JSON.parse(savedUser);
        setProfile({
          id: user.id,
          nome: user.name || user.nome || user.email?.split('@')[0] || 'Usuário',
          name: user.name,
          email: user.email || '',
          telefone: user.phone,
          phone: user.phone,
          nivel: user.level || 'Bronze',
          level: user.level,
          pontos: user.points || 0,
          points: user.points,
        });
      }
    } catch {}
    setLoading(false);
  };

  return { profile, loading, refetch: fetchProfile };
}
