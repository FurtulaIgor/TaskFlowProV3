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

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  actions: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // First, get all users from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        throw new Error('Greška prilikom preuzimanja korisnika iz autentifikacije');
      }
      
      // Then get user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw new Error('Greška prilikom preuzimanja uloga korisnika');
      }
      
      // Combine the data
      const users = authUsers.users.map(user => {
        const userRole = userRoles.find(role => role.user_id === user.id);
        return {
          id: userRole?.id || '',
          user_id: user.id,
          role: userRole?.role || 'pending', // Show 'pending' if no role is assigned yet
          created_at: userRole?.created_at || user.created_at,
          user: {
            email: user.email || ''
          }
        };
      });
      
      set({ users: users as UserRole[], isLoading: false });
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      set({ 
        error: error.message || 'Neočekivana greška prilikom preuzimanja korisnika', 
        isLoading: false 
      });
    }
  },
  
  fetchActions: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('admin_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limit to last 50 actions for performance
      
      if (error) {
        console.error('Error fetching admin actions:', error);
        throw new Error('Greška prilikom preuzimanja istorije akcija');
      }
      
      set({ actions: data as AdminAction[], isLoading: false });
    } catch (error: any) {
      console.error('Error in fetchActions:', error);
      set({ 
        error: error.message || 'Neočekivana greška prilikom preuzimanja istorije akcija', 
        isLoading: false 
      });
    }
  },
  
  updateUserRole: async (userId: string, role: string, notes?: string) => {
    try {
      set({ error: null });
      
      // Get current user (admin performing the action)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Niste autentifikovani');
      }
      
      // Check if user already has a role entry
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing role:', checkError);
        throw new Error('Greška prilikom provere postojeće uloge');
      }
      
      let result;
      let actionType;
      
      if (existingRole) {
        // Update existing role
        result = await supabase
          .from('user_roles')
          .update({ role })
          .eq('user_id', userId);
        actionType = 'update_role';
      } else {
        // Insert new role
        result = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role }]);
        actionType = 'assign_role';
      }
      
      if (result.error) {
        console.error('Error updating user role:', result.error);
        throw new Error('Greška prilikom ažuriranja uloge korisnika');
      }
      
      // Log the admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert([{
          admin_id: user.id,
          action_type: actionType,
          target_user_id: userId,
          notes: notes || null
        }]);
      
      if (actionError) {
        console.error('Error logging admin action:', actionError);
        // Don't throw here as the main operation succeeded
      }
      
      // Refresh data
      await Promise.all([
        get().fetchUsers(),
        get().fetchActions()
      ]);
      
      return true;
    } catch (error: any) {
      console.error('Error in updateUserRole:', error);
      set({ error: error.message || 'Neočekivana greška prilikom ažuriranja uloge' });
      return false;
    }
  }
}));