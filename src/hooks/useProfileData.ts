
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const useProfileData = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = async (userIdToFetch: string) => {
    try {
      console.log('Fetching profile for user:', userIdToFetch);
      
      // First, try to get the profile with a simple query
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userIdToFetch)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }
      
      console.log('Profile data fetched:', profileData);

      // If we have a profile, try to get the organization data separately
      let organizationData = null;
      if (profileData.organizacao_id) {
        console.log('Fetching organization for id:', profileData.organizacao_id);
        const { data: orgData, error: orgError } = await supabase
          .from('organizacoes')
          .select('nome, cnpj')
          .eq('id', profileData.organizacao_id)
          .single();

        if (orgError) {
          console.warn('Error fetching organization:', orgError);
          // Don't throw here, just continue without organization data
        } else {
          organizationData = orgData;
          console.log('Organization data fetched:', organizationData);
        }
      }

      // Combine the data
      const completeProfile = {
        ...profileData,
        organizacoes: organizationData
      };

      console.log('Complete profile data:', completeProfile);
      setProfile(completeProfile);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log('useProfileData effect triggered for userId:', userId);
      // Use setTimeout to avoid concurrency issues
      setTimeout(() => {
        fetchProfile(userId);
      }, 100);
    } else {
      console.log('No userId provided, setting profile to null');
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
