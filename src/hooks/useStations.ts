import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Station {
  id: string;
  nome: string;
  endereco: string;
  tipo: string;
  potencia_kw: number;
  preco_kwh: number;
  conectores_total: number;
  conectores_livres: number;
  status: string;
  latitude: number;
  longitude: number;
}

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    fetchStations();

    // Realtime — atualiza quando status muda
    const channel = supabase
      .channel('stations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'charging_stations' }, () => {
        fetchStations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchStations = async () => {
    const { data, error } = await supabase
      .from('charging_stations')
      .select('*')
      .order('nome');

    if (error) setError(error.message);
    if (data)  setStations(data);
    setLoading(false);
  };

  return { stations, loading, error, refresh: fetchStations };
}
