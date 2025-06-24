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
  markAsPending: (id: string) => Promise<Invoice | null>;
  updateInvoiceStatus: (id: string, status: string) => Promise<Invoice | null>;
  generatePdf: (invoice: Invoice, profile?: any) => Promise<Uint8Array | null>;
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
      
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }
      
      // Include the user_id in the invoice data
      const invoiceWithUserId = {
        ...invoice,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceWithUserId)
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
  
  markAsPending: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('invoices')
        .update({ 
          status: 'pending',
          paid_date: null // Clear paid date when marking as pending
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
  
  updateInvoiceStatus: async (id: string, status: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const updateData: any = { status };
      
      // Set paid_date if marking as paid, clear it if marking as pending
      if (status === 'paid') {
        updateData.paid_date = new Date().toISOString();
      } else if (status === 'pending') {
        updateData.paid_date = null;
      }
      
      const { data, error } = await supabase
        .from('invoices')
        .update(updateData)
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
  
  generatePdf: async (invoice: Invoice, profile?: any) => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Set up Serbian font support (using default fonts for now)
      doc.setFont('helvetica');
      
      // Header section
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text('FAKTURA', 105, 25, { align: 'center' });
      
      // Company info (if profile exists)
      if (profile) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        let yPos = 45;
        if (profile.company_name) {
          doc.setFontSize(14);
          doc.text(profile.company_name, 20, yPos);
          yPos += 8;
        }
        
        if (profile.full_name) {
          doc.setFontSize(10);
          doc.text(profile.full_name, 20, yPos);
          yPos += 6;
        }
        
        if (profile.address) {
          doc.text(profile.address, 20, yPos);
          yPos += 6;
        }
        
        if (profile.city && profile.postal_code) {
          doc.text(`${profile.postal_code} ${profile.city}`, 20, yPos);
          yPos += 6;
        }
        
        if (profile.country) {
          doc.text(profile.country, 20, yPos);
          yPos += 6;
        }
        
        if (profile.tax_number) {
          doc.text(`PIB: ${profile.tax_number}`, 20, yPos);
          yPos += 6;
        }
        
        if (profile.registration_number) {
          doc.text(`Matični broj: ${profile.registration_number}`, 20, yPos);
          yPos += 6;
        }
      }
      
      // Invoice details box
      doc.setDrawColor(200, 200, 200);
      doc.rect(120, 45, 70, 40);
      
      doc.setFontSize(10);
      doc.text('Broj fakture:', 125, 55);
      doc.setFontSize(12);
      doc.text(`#${invoice.id.substring(0, 8)}`, 125, 62);
      
      doc.setFontSize(10);
      doc.text('Datum izdavanja:', 125, 72);
      doc.text(new Date(invoice.created_at).toLocaleDateString('sr-RS'), 125, 78);
      
      if (invoice.due_date) {
        doc.text('Datum dospeća:', 125, 88);
        doc.text(new Date(invoice.due_date).toLocaleDateString('sr-RS'), 125, 94);
      }
      
      // Client info section
      doc.setFontSize(14);
      doc.text('RAČUN ZA:', 20, 110);
      
      doc.setFontSize(12);
      if (invoice.client) {
        doc.text(invoice.client.name, 20, 120);
        doc.text(invoice.client.email, 20, 128);
      }
      
      // Services table header
      const tableStartY = 150;
      doc.setFillColor(240, 240, 240);
      doc.rect(20, tableStartY, 170, 10, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('OPIS USLUGE', 25, tableStartY + 7);
      doc.text('KOLIČINA', 120, tableStartY + 7);
      doc.text('CENA', 140, tableStartY + 7);
      doc.text('UKUPNO', 165, tableStartY + 7);
      
      // Service row
      const rowY = tableStartY + 15;
      doc.text('Usluga', 25, rowY);
      doc.text('1', 125, rowY);
      doc.text(`${invoice.amount.toFixed(2)} RSD`, 140, rowY);
      doc.text(`${invoice.amount.toFixed(2)} RSD`, 165, rowY);
      
      // Total section
      doc.setFillColor(250, 250, 250);
      doc.rect(120, rowY + 10, 70, 20, 'F');
      
      doc.setFontSize(12);
      doc.text('UKUPNO ZA NAPLATU:', 125, rowY + 20);
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246);
      doc.text(`${invoice.amount.toFixed(2)} RSD`, 125, rowY + 28);
      
      // Payment info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      let paymentY = rowY + 45;
      
      if (profile?.bank_account) {
        doc.text(`Broj računa: ${profile.bank_account}`, 20, paymentY);
        paymentY += 8;
      }
      
      // Status
      doc.setFontSize(12);
      const statusText = invoice.status === 'paid' ? 'PLAĆENO' : 
                        invoice.status === 'pending' ? 'NA ČEKANJU' : 
                        invoice.status === 'cancelled' ? 'OTKAZANO' : 
                        invoice.status === 'overdue' ? 'NEPLAĆENO' : 
                        invoice.status.toUpperCase();
      
      const statusColor = invoice.status === 'paid' ? [34, 197, 94] : 
                         invoice.status === 'pending' ? [251, 191, 36] : 
                         [239, 68, 68];
      
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(`STATUS: ${statusText}`, 20, paymentY + 10);
      
      if (invoice.status === 'paid' && invoice.paid_date) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Plaćeno: ${new Date(invoice.paid_date).toLocaleDateString('sr-RS')}`, 20, paymentY + 20);
      }
      
      // Footer
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(8);
      doc.text('Ova faktura je generisana automatski putem TaskFlowPro sistema.', 105, 280, { align: 'center' });
      
      // Return PDF as Uint8Array
      return new Uint8Array(doc.output('arraybuffer'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  }
}));