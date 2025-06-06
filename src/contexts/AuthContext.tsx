
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from '@/types/auth';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useProfileData } from '@/hooks/useProfileData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { signIn, signOut: authSignOut, updateProfile: authUpdateProfile } = useAuthOperations();
  const { profile, setProfile, updateProfileData } = useProfileData(user?.id);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'User ID:', session?.user?.id);
        
        // Update session and user synchronously
        setSession(session);
        setUser(session?.user ?? null);
        
        // Clear profile if no session
        if (!session) {
          console.log('No session, clearing profile');
          setProfile(null);
        } else {
          console.log('Session exists, user ID:', session.user.id);
        }
        
        setLoading(false);
      }
    );

    // Check existing session
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Initializing auth state');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('Initial session check - User ID:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          console.log('No initial session found');
          setProfile(null);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, [setProfile]);

  // Log profile changes
  useEffect(() => {
    console.log('Profile state updated:', profile ? 'Profile loaded' : 'No profile');
    if (profile) {
      console.log('Profile details:', {
        id: profile.id,
        nome: profile.nome,
        email: profile.email,
        organizacao: profile.organizacoes?.nome || 'No organization'
      });
    }
  }, [profile]);

  const signOut = async () => {
    console.log('AuthProvider: Starting signOut');
    await authSignOut();
    // State will be cleared by the auth state change listener
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    const { data, error } = await authUpdateProfile(user, updates);
    
    if (!error && data) {
      updateProfileData(data);
    }

    return { error };
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
