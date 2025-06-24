import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Client {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  last_interaction?: string | null;
  // Admin view fields
  user?: {
    email: string;
  };
}

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<Client[]>;
  getClient: (id: string) => Client | undefined;
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'user_id'>) => Promise<Client | null>;
  updateClient: (id: string, client: Partial<Client>) => Promise<Client | null>;
  deleteClient: (id: string) => Promise<boolean>;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,
  
  fetchClients: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user to check if admin
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }
      
      // Check if user is admin
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const isAdmin = userRoles?.some(role => role.role === 'admin') || false;
      
      let query = supabase.from('clients');
      
      if (isAdmin) {
        // Admin can see all clients with user information
        query = query.select(`
          *,
          user:user_id (
            email
          )
        `);
      } else {
        // Regular users see only their own clients
        query = query.select('*').eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const clients = data as Client[];
      set({ clients, isLoading: false });
      return clients;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  getClient: (id: string) => {
    return get().clients.find(client => client.id === id);
  },
  
  addClient: async (client) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }
      
      // Include the user_id in the client data
      const clientData = {
        ...client,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();
      
      if (error) throw error;
      
      const newClient = data as Client;
      set(state => ({ 
        clients: [newClient, ...state.clients],
        isLoading: false 
      }));
      
      return newClient;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  updateClient: async (id, client) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedClient = data as Client;
      set(state => ({
        clients: state.clients.map(c => 
          c.id === id ? updatedClient : c
        ),
        isLoading: false
      }));
      
      return updatedClient;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  deleteClient: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        clients: state.clients.filter(c => c.id !== id),
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));