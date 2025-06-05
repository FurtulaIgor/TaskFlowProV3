import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  session: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  checkAdmin: (userId: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  isLoading: true,
  error: null,
  session: null,
  
  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        user: data.user,
        session: data.session,
        isLoading: false 
      });
      
      if (data.user) {
        const isAdmin = await get().checkAdmin(data.user.id);
        set({ isAdmin });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        user: data.user,
        session: data.session,
        isLoading: false,
        isAdmin: false
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
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
  
  loadUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: { user, session } } = await supabase.auth.getUser();
      
      set({ 
        user,
        session,
        isLoading: false
      });
      
      if (user) {
        const isAdmin = await get().checkAdmin(user.id);
        set({ isAdmin });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  checkAdmin: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) return false;
      return data?.role === 'admin';
    } catch (error) {
      return false;
    }
  }
}));