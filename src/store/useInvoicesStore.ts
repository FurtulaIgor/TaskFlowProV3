import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { jsPDF } from 'jspdf';

export interface Invoice {
  id: string;
  created_at: string;
  user_id: string;
  client_id: string;
  appointment_id: string | null;
  amount: number;
  status: string;
  due_date: string | null;
  paid_date: string | null;
  pdf_url: string | null;
  notes: string | null;
  client?: {
    name: string;
    email: string;
  };
}

interface InvoicesState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<Invoice[]>;
  getInvoice: (id: string) => Invoice | undefined;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'user_id' | 'pdf_url' | 'client'>) => Promise<Invoice | null>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<Invoice | null>;
  deleteInvoice: (id: string) => Promise<boolean>;
  markAsPaid: (id: string) => Promise<Invoice | null>;
  generatePdf: (invoice: Invoice) => Promise<string | null>;
}

export const useInvoicesStore = create<InvoicesState>((set, get) => ({
  invoices: [],
  isLoading: false,
  error: null,
  
  fetchInvoices: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const invoices = data as Invoice[];
      set({ invoices, isLoading: false });
      return invoices;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return []; // Return empty array instead of undefined
    }
  },
  
  getInvoice: (id: string) => {
    return get().invoices.find(invoice => invoice.id === id);
  },
  
  addInvoice: async (invoice) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice)
        .select(`
          *,
          client:clients(name, email)
        `)
        .single();
      
      if (error) throw error;
      
      const newInvoice = data as Invoice;
      set(state => ({ 
        invoices: [...state.invoices, newInvoice],
        isLoading: false 
      }));
      
      return newInvoice;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  updateInvoice: async (id, invoice) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('invoices')
        .update(invoice)
        .eq('id', id)
        .select(`
          *,
          client:clients(name, email)
        `)
        .single();
      
      if (error) throw error;
      
      const updatedInvoice = data as Invoice;
      set(state => ({
        invoices: state.invoices.map(i => 
          i.id === id ? updatedInvoice : i
        ),
        isLoading: false
      }));
      
      return updatedInvoice;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  deleteInvoice: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        invoices: state.invoices.filter(i => i.id !== id),
        isLoading: false
      }));
      
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  markAsPaid: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const today = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          paid_date: today
        })
        .eq('id', id)
        .select(`
          *,
          client:clients(name, email)
        `)
        .single();
      
      if (error) throw error;
      
      set(state => ({
        invoices: state.invoices.map(i => i.id === id ? { ...i, ...data } as Invoice : i),
        isLoading: false
      }));
      
      return data as Invoice;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
  
  generatePdf: async (invoice: Invoice) => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('INVOICE', 105, 20, { align: 'center' });
      
      // Add invoice details
      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.id.substring(0, 8)}`, 20, 40);
      doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 20, 50);
      doc.text(`Due Date: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}`, 20, 60);
      
      // Add client details
      doc.text('Bill To:', 20, 80);
      if (invoice.client) {
        doc.text(`${invoice.client.name}`, 20, 90);
        doc.text(`${invoice.client.email}`, 20, 100);
      }
      
      // Add amount details
      doc.text('Amount Due:', 140, 80);
      doc.text(`$${invoice.amount.toFixed(2)}`, 140, 90);
      
      // Add status
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 140, 100);
      
      // Add payment details if paid
      if (invoice.status === 'paid' && invoice.paid_date) {
        doc.text(`Paid on: ${new Date(invoice.paid_date).toLocaleDateString()}`, 140, 110);
      }
      
      // Get the PDF as base64
      const pdfOutput = doc.output('datauristring');
      
      // For a real implementation, you would upload this to a storage service
      // Here, we'll just return the data URI as a placeholder
      return pdfOutput;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  }
}));