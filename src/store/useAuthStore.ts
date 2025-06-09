import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  getSession: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: false,
  error: null,
  hasInitialized: false,

  initialize: async () => {
    const state = get();
    if (state.hasInitialized) return;
    
    try {
      set({ isLoading: true, error: null });
      
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        // Check if user is admin by checking user_roles table
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        const isAdmin = roleData?.role === 'admin';
        set({ 
          user: session.user, 
          session, 
          isAdmin, 
          isLoading: false, 
          hasInitialized: true 
        });
      } else {
        set({ 
          user: null, 
          session: null, 
          isAdmin: false, 
          isLoading: false, 
          hasInitialized: true 
        });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          set({ user: null, session: null, isAdmin: false });
        } else if (event === 'SIGNED_IN' && session?.user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          const isAdmin = roleData?.role === 'admin';
          set({ user: session.user, session, isAdmin });
        }
      });
      
    } catch (error: any) {
      set({ 
        user: null, 
        session: null, 
        isAdmin: false, 
        isLoading: false, 
        error: error.message, 
        hasInitialized: true 
      });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        // Check if user is admin by checking user_roles table
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        const isAdmin = roleData?.role === 'admin';
        set({ user: data.user, session: data.session, isAdmin, isLoading: false });
      }
      
      return data.user;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signUp: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: undefined // Disable email confirmation
        }
      });
      if (error) throw error;

      if (data.user) {
        // Create user role entry
        await supabase
          .from('user_roles')
          .insert([{ user_id: data.user.id, role: 'user' }]);
        
        set({ user: data.user, session: data.session, isAdmin: false, isLoading: false });
      }
      
      return data.user;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ user: null, session: null, isAdmin: false, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  resetPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updatePassword: async (password) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        // Check if user is admin by checking user_roles table
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        const isAdmin = roleData?.role === 'admin';
        
        // Only update state if it's different
        const currentState = get();
        if (currentState.user?.id !== session.user.id || currentState.isAdmin !== isAdmin) {
          set({ user: session.user, session, isAdmin });
        }
        
        return session.user;
      } else {
        // Only update state if it's different
        const currentState = get();
        if (currentState.user !== null) {
          set({ user: null, session: null, isAdmin: false });
        }
        return null;
      }
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  }
}));