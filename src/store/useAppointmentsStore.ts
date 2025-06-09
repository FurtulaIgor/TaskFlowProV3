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
  fetchAppointments: (startDate?: Date, endDate?: Date) => Promise<Appointment[]>;
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
      
      const appointments = data as Appointment[];
      set({ appointments, isLoading: false });
      return appointments;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  getAppointment: (id: string) => {
    return get().appointments.find(appointment => appointment.id === id);
  },
  
  addAppointment: async (appointment) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select(`
          *,
          client:clients(name, email, phone),
          service:services(name, price)
        `)
        .single();
      
      if (error) throw error;
      
      const newAppointment = data as Appointment;
      set(state => ({ 
        appointments: [...state.appointments, newAppointment],
        isLoading: false 
      }));
      
      return newAppointment;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  updateAppointment: async (id, appointment) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('appointments')
        .update(appointment)
        .eq('id', id)
        .select(`
          *,
          client:clients(name, email, phone),
          service:services(name, price)
        `)
        .single();
      
      if (error) throw error;
      
      const updatedAppointment = data as Appointment;
      set(state => ({
        appointments: state.appointments.map(a => 
          a.id === id ? updatedAppointment : a
        ),
        isLoading: false
      }));
      
      return updatedAppointment;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  deleteAppointment: async (id) => {
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
  
  isTimeSlotAvailable: (startTime, endTime, excludeId) => {
    const appointments = get().appointments;
    return !appointments.some(appointment => {
      if (excludeId && appointment.id === excludeId) return false;
      
      const appointmentStart = new Date(appointment.start_time);
      const appointmentEnd = new Date(appointment.end_time);
      const newStart = new Date(startTime);
      const newEnd = new Date(endTime);
      
      return (
        (newStart >= appointmentStart && newStart < appointmentEnd) ||
        (newEnd > appointmentStart && newEnd <= appointmentEnd) ||
        (newStart <= appointmentStart && newEnd >= appointmentEnd)
      );
    });
  }
}));