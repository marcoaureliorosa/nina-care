
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const useProfileData = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = async (userIdToFetch: string) => {
    try {
      console.log('Fetching profile for user:', userIdToFetch);
      const { data, error } = await supabase
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

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile data:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    if (userId) {
      // Use setTimeout to avoid concurrency issues
      setTimeout(() => {
        fetchProfile(userId);
      }, 100);
    } else {
      setProfile(null);
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
  };
};
