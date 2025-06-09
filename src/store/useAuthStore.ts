import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
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

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        const isAdmin = session.user?.email === 'admin@mojadomena.com';
        set({ user: session.user, session, isAdmin, isLoading: false });
      } else {
        set({ user: null, session: null, isAdmin: false, isLoading: false });
      }
    } catch (error: any) {
      set({ user: null, session: null, isAdmin: false, isLoading: false, error: error.message });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const isAdmin = data.user?.email === 'admin@mojadomena.com';
      set({ user: data.user, session: data.session, isAdmin, isLoading: false });
      return data.user;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  signUp: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const isAdmin = data.user?.email === 'admin@mojadomena.com';
      set({ user: data.user, session: data.session, isAdmin, isLoading: false });
      return data.user;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
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
      set({ isLoading: true, error: null });
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        const isAdmin = session.user?.email === 'admin@mojadomena.com';
        set({ user: session.user, session, isAdmin, isLoading: false });
        return session.user;
      } else {
        set({ user: null, session: null, isAdmin: false, isLoading: false });
        return null;
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  }
}));
