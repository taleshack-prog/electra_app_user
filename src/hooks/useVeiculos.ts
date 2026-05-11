import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Veiculo {
  id: string;
  user_id: string;
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from('veiculos')
      .select('*')
      .eq('user_id', user.id)
      .order('principal', { ascending: false });
    setVeiculos(data || []);
    setLoading(false);
  };

  const adicionar = async (modelo: string, placa: string, apelido: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const principal = veiculos.length === 0;
    const { data } = await supabase
      .from('veiculos')
      .insert({ user_id: user.id, modelo, placa, apelido, bateria: 0, principal })
      .select()
      .single();
    if (data) setVeiculos(v => [...v, data]);
  };

  const remover = async (id: string) => {
    await supabase.from('veiculos').delete().eq('id', id);
    setVeiculos(v => v.filter(x => x.id !== id));
  };

  const definirPrincipal = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('veiculos').update({ principal: false }).eq('user_id', user.id);
    await supabase.from('veiculos').update({ principal: true }).eq('id', id);
    setVeiculos(v => v.map(x => ({ ...x, principal: x.id === id })));
  };

  return { veiculos, loading, adicionar, remover, definirPrincipal, refetch: fetchVeiculos };
}
