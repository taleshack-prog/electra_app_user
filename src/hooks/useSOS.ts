import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSOS() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const criarSOS = async (dados: {
    latitude: number;
    longitude: number;
    endereco: string;
    veiculo: string;
    bateria_nivel: number;
  }) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('rescue_requests')
      .insert([{
        latitude: dados.latitude,
        longitude: dados.longitude,
        endereco: dados.endereco,
        veiculo: dados.veiculo,
        bateria_nivel: dados.bateria_nivel,
        status: 'aguardando',
        valor: 85.00,
      }])
      .select()
      .single();

    setLoading(false);
    if (error) { setError(error.message); return null; }
    return data;
  };

  const cancelarSOS = async (id: string) => {
    await supabase
      .from('rescue_requests')
      .update({ status: 'cancelado' })
      .eq('id', id);
  };

  return { criarSOS, cancelarSOS, loading, error };
}
