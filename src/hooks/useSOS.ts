import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import electraApi from '../lib/api';

export function useSOS() {
  const [loading, setLoading] = useState(false);

  const criarSOS = async (latitude: number, longitude: number, address?: string, description?: string) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('electra_token');
      const data = await electraApi.createSOS(token || '', { latitude, longitude, address, description });
      setLoading(false);
      return data;
    } catch(e) {
      setLoading(false);
      return { error: 'Erro ao criar SOS' };
    }
  };

  return { criarSOS, loading };
}
