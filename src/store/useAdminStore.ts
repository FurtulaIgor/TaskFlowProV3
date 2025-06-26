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
  deleteUser: (userId: string, notes?: string) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  actions: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Use the new RPC function instead of supabase.auth.admin.listUsers()
      const { data, error: rpcError } = await supabase.rpc('get_all_users_with_roles');
      
      if (rpcError) {
        console.error('Error calling get_all_users_with_roles RPC:', rpcError);
        throw new Error('Greška prilikom preuzimanja korisnika i uloga');
      }
      
      // Map the data from RPC call to UserRole format
      const users = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        role: item.role,
        created_at: item.created_at,
        user: {
          email: item.email
        }
      }));
      
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
  },

  deleteUser: async (userId: string, notes?: string) => {
    try {
      set({ error: null });
      
      // Get current user (admin performing the action)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Niste autentifikovani');
      }

      // Prevent admin from deleting themselves
      if (user.id === userId) {
        throw new Error('Ne možete obrisati svoj vlastiti nalog');
      }
      
      // First, delete all related data for the user
      // Delete user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (roleError) {
        console.error('Error deleting user roles:', roleError);
        throw new Error('Greška prilikom brisanja uloga korisnika');
      }

      // Delete user_profiles if exists
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);
      
      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        // Don't throw here as profile might not exist
      }

      // Delete user's clients
      const { error: clientsError } = await supabase
        .from('clients')
        .delete()
        .eq('user_id', userId);
      
      if (clientsError) {
        console.error('Error deleting user clients:', clientsError);
        throw new Error('Greška prilikom brisanja klijenata korisnika');
      }

      // Delete user's services
      const { error: servicesError } = await supabase
        .from('services')
        .delete()
        .eq('user_id', userId);
      
      if (servicesError) {
        console.error('Error deleting user services:', servicesError);
        throw new Error('Greška prilikom brisanja usluga korisnika');
      }

      // Delete user's appointments
      const { error: appointmentsError } = await supabase
        .from('appointments')
        .delete()
        .eq('user_id', userId);
      
      if (appointmentsError) {
        console.error('Error deleting user appointments:', appointmentsError);
        throw new Error('Greška prilikom brisanja termina korisnika');
      }

      // Delete user's invoices
      const { error: invoicesError } = await supabase
        .from('invoices')
        .delete()
        .eq('user_id', userId);
      
      if (invoicesError) {
        console.error('Error deleting user invoices:', invoicesError);
        throw new Error('Greška prilikom brisanja faktura korisnika');
      }

      // Finally, delete the user from auth.users using admin API
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
      
      if (deleteUserError) {
        console.error('Error deleting user from auth:', deleteUserError);
        throw new Error('Greška prilikom brisanja korisničkog naloga');
      }
      
      // Log the admin action
      const { error: actionError } = await supabase
        .from('admin_actions')
        .insert([{
          admin_id: user.id,
          action_type: 'delete_user',
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
      console.error('Error in deleteUser:', error);
      set({ error: error.message || 'Neočekivana greška prilikom brisanja korisnika' });
      return false;
    }
  }
}));