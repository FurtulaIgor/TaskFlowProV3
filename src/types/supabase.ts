export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          client_id: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          service_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          client_id: string
          start_time: string
          end_time: string
          status?: string
          notes?: string | null
          service_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          client_id?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          service_id?: string
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          email: string
          phone: string
          notes: string | null
          last_interaction: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          email: string
          phone: string
          notes?: string | null
          last_interaction?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          notes?: string | null
          last_interaction?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          created_at: string
          user_id: string
          client_id: string
          appointment_id: string | null
          amount: number
          status: string
          due_date: string | null
          paid_date: string | null
          pdf_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          client_id: string
          appointment_id?: string | null
          amount: number
          status?: string
          due_date?: string | null
          paid_date?: string | null
          pdf_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          client_id?: string
          appointment_id?: string | null
          amount?: number
          status?: string
          due_date?: string | null
          paid_date?: string | null
          pdf_url?: string | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          description: string | null
          duration: number
          price: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          description?: string | null
          duration: number
          price: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
        }
      }
      user_roles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          role: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          role?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}