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

interface AdminState {
  users: UserRole[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // First get all users from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Then get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Combine the data
      const users = authUsers.users.map(user => {
        const userRole = userRoles.find(role => role.user_id === user.id);
        return {
          id: userRole?.id || '',
          user_id: user.id,
          role: userRole?.role || 'user',
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
  
  updateUserRole: async (userId: string, role: string) => {
    try {
      set({ isLoading: true, error: null });
      
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
      
      // Refresh user list
      await set.getState().fetchUsers();
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));