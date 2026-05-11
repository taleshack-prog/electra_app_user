import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  avatar_url?: string;
  nivel?: string;
  pontos?: number;
  total_recargas?: number;
  kwh_total?: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    } else {
      // fallback com dados do auth
      setProfile({
        id: user.id,
        nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
        email: user.email || '',
      });
    }
    setLoading(false);
  };

  return { profile, loading, refetch: fetchProfile };
}
