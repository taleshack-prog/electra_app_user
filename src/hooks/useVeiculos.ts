import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Veiculo {
  id: string;
  user_id?: string;
  modelo: string;
  placa: string;
  apelido: string;
  bateria: number;
  principal: boolean;
}

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchVeiculos(); }, []);

  const fetchVeiculos = async () => {
    setLoading(true);
    try {
      const saved = await AsyncStorage.getItem('electra_veiculos');
      if (saved) setVeiculos(JSON.parse(saved));
    } catch {}
    setLoading(false);
  };

  const adicionar = async (modelo: string, placa: string, apelido: string) => {
    const novo: Veiculo = { id: Date.now().toString(), modelo, placa, apelido, bateria: 0, principal: veiculos.length === 0 };
    const novos = [...veiculos, novo];
    setVeiculos(novos);
    await AsyncStorage.setItem('electra_veiculos', JSON.stringify(novos));
  };

  const remover = async (id: string) => {
    const novos = veiculos.filter(v => v.id !== id);
    setVeiculos(novos);
    await AsyncStorage.setItem('electra_veiculos', JSON.stringify(novos));
  };

  const definirPrincipal = async (id: string) => {
    const novos = veiculos.map(v => ({ ...v, principal: v.id === id }));
    setVeiculos(novos);
    await AsyncStorage.setItem('electra_veiculos', JSON.stringify(novos));
  };

  return { veiculos, loading, adicionar, remover, definirPrincipal, refetch: fetchVeiculos };
}
