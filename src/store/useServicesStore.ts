import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Service {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
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
      
      set({ services: data as Service[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  getService: (id: string) => {
    return get().services.find(service => service.id === id);
  },
  
  addService: async (service) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('services')
        .insert([{ ...service, user_id: userData.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({ 
        services: [...state.services, data as Service],
        isLoading: false 
      }));
      
      return data as Service;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  updateService: async (id: string, serviceData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({
        services: state.services.map(s => s.id === id ? { ...s, ...data } as Service : s),
        isLoading: false
      }));
      
      return data as Service;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  deleteService: async (id: string) => {
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