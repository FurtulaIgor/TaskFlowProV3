import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  last_interaction: string | null;
  created_at: string;
  user_id: string;
}

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
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
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      set({ clients: data as Client[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  getClient: (id: string) => {
    return get().clients.find(client => client.id === id);
  },
  
  addClient: async (client) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: userData.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({ 
        clients: [...state.clients, data as Client],
        isLoading: false 
      }));
      
      return data as Client;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  updateClient: async (id: string, clientData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...data } as Client : c),
        isLoading: false
      }));
      
      return data as Client;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  deleteClient: async (id: string) => {
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