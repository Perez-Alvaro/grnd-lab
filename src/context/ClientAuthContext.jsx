import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const ClientAuthContext = createContext({});

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error('useClientAuth must be used within ClientAuthProvider');
  }
  return context;
};

export const ClientAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Client auth event:', event);

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
    } catch (error) {
      console.error('❌ Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Only set profile if it's a customer
      if (data?.role === 'customer') {
        setProfile(data);
      } else {
        // If not a customer, clear the session
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setProfile(null);
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;

      // 2. Create profile (customer role by default)
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              role: 'customer',
              full_name: fullName,
            },
          ]);

        if (profileError) throw profileError;

        // 3. Log signup activity
        await supabase.from('activity_logs').insert([
          {
            user_id: authData.user.id,
            user_email: email,
            action_type: 'signup',
            action_details: { full_name: fullName },
          },
        ]);
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('❌ Error signing up:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Log login activity
      if (data.user) {
        await supabase.from('activity_logs').insert([
          {
            user_id: data.user.id,
            user_email: email,
            action_type: 'login',
            action_details: { method: 'email_password' },
          },
        ]);
      }

      return { data, error: null };
    } catch (error) {
      console.error('❌ Error signing in:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Log logout activity
      if (user) {
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            user_email: user.email,
            action_type: 'logout',
          },
        ]);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);

      return { error: null };
    } catch (error) {
      console.error('❌ Error signing out:', error);
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/client/reset-password`,
      });

      if (error) throw error;

      // Log password reset request
      await supabase.from('activity_logs').insert([
        {
          user_email: email,
          action_type: 'password_reset_request',
        },
      ]);

      return { error: null };
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      // Log password update
      if (user) {
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            user_email: user.email,
            action_type: 'password_update',
          },
        ]);
      }

      return { error: null };
    } catch (error) {
      console.error('❌ Error updating password:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};
