import { useState, useEffect } from 'react';
import electraApi from '../lib/api';

export interface Station {
  id: string;
  nome: string;
  name?: string;
  endereco: string;
  address?: string;
  latitude: number;
  longitude: number;
  status: string;
  potencia_kw?: number;
  powerKw?: number;
  preco_kwh?: number;
  pricePerKwh?: number;
  tipo?: string;
  type?: string;
  conectores_livres?: number;
}

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStations(); }, []);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await electraApi.getEstacoes();
      if (data.stations) {
        setStations(data.stations.map((s: any) => ({
          ...s,
          nome: s.name || s.nome,
          endereco: s.address || s.endereco || '',
          potencia_kw: s.powerKw || s.potencia_kw,
          preco_kwh: s.pricePerKwh || s.preco_kwh,
          tipo: s.type || s.tipo || 'AC',
          conectores_livres: s.status === 'available' ? 1 : 0,
        })));
      }
    } catch(e) {
      console.error('useStations error:', e);
    }
    setLoading(false);
  };

  return { stations, loading, refetch: fetchStations };
}
