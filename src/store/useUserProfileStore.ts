import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  company_type: string | null; // 'individual' | 'company'
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  // Company specific fields
  tax_number: string | null; // PIB
  registration_number: string | null; // Matični broj
  bank_account: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<UserProfile | null>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile | null>;
  createProfile: (profileData: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<UserProfile | null>;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      const profile = data as UserProfile | null;
      set({ profile, isLoading: false });
      return profile;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  updateProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const updateData = {
        ...profileData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedProfile = data as UserProfile;
      set({ profile: updatedProfile, isLoading: false });
      return updatedProfile;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  createProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const newProfileData = {
        ...profileData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(newProfileData)
        .select()
        .single();

      if (error) throw error;

      const newProfile = data as UserProfile;
      set({ profile: newProfile, isLoading: false });
      return newProfile;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  }
}));