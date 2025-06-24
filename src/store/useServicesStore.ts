import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Service {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<Service[]>;
  getService: (id: string) => Service | undefined;
  addService: (service: Omit<Service, 'id' | 'created_at' | 'user_id'>) => Promise<Service | null>;
  updateService: (id: string, service: Partial<Service>) => Promise<Service | null>;
  deleteService: (id: string) => Promise<boolean>;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,
  
  fetchServices: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      const services = data as Service[];
      set({ services, isLoading: false });
      return services;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  getService: (id: string) => {
    return get().services.find(service => service.id === id);
  },
  
  addService: async (service) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...service,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newService = data as Service;
      set(state => ({ 
        services: [...state.services, newService],
        isLoading: false 
      }));
      
      return newService;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  updateService: async (id, service) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedService = data as Service;
      set(state => ({
        services: state.services.map(s => 
          s.id === id ? updatedService : s
        ),
        isLoading: false
      }));
      
      return updatedService;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  deleteService: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        services: state.services.filter(s => s.id !== id),
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));