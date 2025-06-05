import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export interface Appointment {
  id: string;
  created_at: string;
  user_id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  service_id: string;
  client?: {
    name: string;
    email: string;
    phone: string;
  };
  service?: {
    name: string;
    price: number;
  };
}

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: (startDate?: Date, endDate?: Date) => Promise<void>;
  getAppointment: (id: string) => Appointment | undefined;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'created_at' | 'user_id' | 'client' | 'service'>) => Promise<Appointment | null>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<Appointment | null>;
  deleteAppointment: (id: string) => Promise<boolean>;
  isTimeSlotAvailable: (startTime: string, endTime: string, excludeId?: string) => boolean;
}

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,
  
  fetchAppointments: async (startDate, endDate) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase
        .from('appointments')
        .select(`
          *,
          client:clients(name, email, phone),
          service:services(name, price)
        `)
        .order('start_time');
      
      if (startDate) {
        const formattedStartDate = format(startDate, "yyyy-MM-dd'T'00:00:00'Z'");
        query = query.gte('start_time', formattedStartDate);
      }
      
      if (endDate) {
        const formattedEndDate = format(endDate, "yyyy-MM-dd'T'23:59:59'Z'");
        query = query.lte('start_time', formattedEndDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ appointments: data as Appointment[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  getAppointment: (id: string) => {
    return get().appointments.find(appointment => appointment.id === id);
  },
  
  addAppointment: async (appointment) => {
    try {
      // Check if time slot is available
      if (!get().isTimeSlotAvailable(appointment.start_time, appointment.end_time)) {
        throw new Error('This time slot is already booked');
      }
      
      set({ isLoading: true, error: null });
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ ...appointment, user_id: userData.user.id }])
        .select(`
          *,
          client:clients(name, email, phone),
          service:services(name, price)
        `)
        .single();
      
      if (error) throw error;
      
      set(state => ({ 
        appointments: [...state.appointments, data as Appointment],
        isLoading: false 
      }));
      
      return data as Appointment;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  updateAppointment: async (id: string, appointmentData) => {
    try {
      // Check if new time slot is available
      if (appointmentData.start_time && appointmentData.end_time) {
        if (!get().isTimeSlotAvailable(appointmentData.start_time, appointmentData.end_time, id)) {
          throw new Error('This time slot is already booked');
        }
      }
      
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .select(`
          *,
          client:clients(name, email, phone),
          service:services(name, price)
        `)
        .single();
      
      if (error) throw error;
      
      set(state => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...data } as Appointment : a),
        isLoading: false
      }));
      
      return data as Appointment;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  deleteAppointment: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        appointments: state.appointments.filter(a => a.id !== id),
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  isTimeSlotAvailable: (startTime: string, endTime: string, excludeId?: string) => {
    const appointments = get().appointments;
    
    // Exclude the current appointment if we're updating
    const relevantAppointments = excludeId 
      ? appointments.filter(a => a.id !== excludeId)
      : appointments;
    
    // Check for conflicts
    return !relevantAppointments.some(a => {
      return (
        (startTime >= a.start_time && startTime < a.end_time) ||
        (endTime > a.start_time && endTime <= a.end_time) ||
        (startTime <= a.start_time && endTime >= a.end_time)
      );
    });
  }
}));