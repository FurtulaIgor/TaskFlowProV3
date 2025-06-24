import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  roles: string[];
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  getSession: () => Promise<User | null>;
  getUserRoles: (userId: string) => Promise<string[]>;
  checkRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  roles: [],

  initialize: async () => {
    if (get().isInitialized) return;
    
    set({ isLoading: true, error: null });
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session) {
        // Fetch user roles from database
        const roles = await get().getUserRoles(session.user.id);
        set({ 
          user: session.user, 
          session, 
          roles,
          isLoading: false, 
          isInitialized: true 
        });
      } else {
        set({ 
          user: null, 
          session: null, 
          roles: [],
          isLoading: false, 
          isInitialized: true 
        });
      }
    } catch (error: any) {
      set({ 
        user: null, 
        session: null, 
        roles: [],
        isLoading: false, 
        isInitialized: true, 
        error: error.message 
      });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Fetch user roles from database
      const roles = await get().getUserRoles(data.user.id);
      
      // Create default user role if none exists
      if (roles.length === 0) {
        try {
          await supabase
            .from('user_roles')
            .insert([{ user_id: data.user.id, role: 'user' }]);
          roles.push('user');
        } catch (roleError) {
          console.warn('Could not create default user role:', roleError);
        }
      }
      
      set({ 
        user: data.user, 
        session: data.session, 
        roles,
        isLoading: false,
        error: null
      });
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

      if (data.user) {
        // Create default user role for new users
        try {
          await supabase
            .from('user_roles')
            .insert([{ user_id: data.user.id, role: 'user' }]);
        } catch (roleError) {
          console.warn('Could not create default user role:', roleError);
        }

        set({ 
          user: data.user, 
          session: data.session, 
          roles: ['user'], // Default role for new users
          isLoading: false,
          error: null
        });
      } else {
        set({ 
          user: null, 
          session: null, 
          roles: [],
          isLoading: false,
          error: null
        });
      }
      
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

      set({ 
        user: null, 
        session: null, 
        roles: [],
        isLoading: false 
      });
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

      if (session) {
        // Update store if session exists but user is not set
        const currentState = get();
        if (!currentState.user || currentState.user.id !== session.user.id) {
          const roles = await get().getUserRoles(session.user.id);
          set({ 
            user: session.user, 
            session, 
            roles,
            error: null 
          });
        }
        return session.user;
      } else {
        // Clear user data if no session
        const currentState = get();
        if (currentState.user) {
          set({ 
            user: null, 
            session: null, 
            roles: [],
            error: null 
          });
        }
        return null;
      }
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  getUserRoles: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }
      
      return data?.map(item => item.role) || [];
    } catch (error) {
      console.error('Error in getUserRoles:', error);
      return [];
    }
  },

  checkRole: (role: string) => {
    const { roles } = get();
    return roles.includes(role);
  }
}));