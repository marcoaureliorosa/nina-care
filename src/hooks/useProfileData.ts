
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const useProfileData = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userIdToFetch: string) => {
    try {
      console.log('Fetching profile for user:', userIdToFetch);
      setError(null);
      
      // Buscar o perfil com join para organização
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organizacoes (
            nome,
            cnpj
          )
        `)
        .eq('id', userIdToFetch)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setError(profileError.message);
        setProfile(null);
        return;
      }
      
      console.log('Profile data fetched successfully:', profileData);
      setProfile(profileData);
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      setError(error.message || 'Erro ao carregar perfil');
      setProfile(null);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log('useProfileData effect triggered for userId:', userId);
      // Usar setTimeout para evitar problemas de concorrência
      const timeoutId = setTimeout(() => {
        fetchProfile(userId);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log('No userId provided, setting profile to null');
      setProfile(null);
      setError(null);
    }
  }, [userId]);

  const updateProfileData = (updates: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  return {
    profile,
    setProfile,
    fetchProfile,
    updateProfileData,
    error,
  };
};
