import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  user?: {
    email: string;
  };
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_user_id: string;
  notes: string | null;
  created_at: string;
}

interface AdminState {
  users: UserRole[];
  actions: AdminAction[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchActions: () => Promise<void>;
  updateUserRole: (userId: string, role: string, notes?: string) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  actions: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      const users = authUsers.users.map(user => {
        const userRole = userRoles.find(role => role.user_id === user.id);
        return {
          id: userRole?.id || '',
          user_id: user.id,
          role: userRole?.role || 'pending',
          created_at: userRole?.created_at || user.created_at,
          user: {
            email: user.email || ''
          }
        };
      });
      
      set({ users: users as UserRole[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchActions: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('admin_actions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ actions: data as AdminAction[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  updateUserRole: async (userId: string, role: string, notes?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      let result;
      
      if (existingRole) {
        // Update existing role
        result = await supabase
          .from('user_roles')
          .update({ role })
          .eq('user_id', userId);
      } else {
        // Insert new role
        result = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role }]);
      }
      
      if (result.error) throw result.error;
      
      // Log the action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert([{
          admin_id: user.id,
          action_type: existingRole ? 'update_role' : 'assign_role',
          target_user_id: userId,
          notes
        }]);
      
      if (actionError) throw actionError;
      
      // Refresh user list
      await set.getState().fetchUsers();
      await set.getState().fetchActions();
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));