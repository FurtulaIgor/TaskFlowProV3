import React, { useEffect, useState } from 'react';
import { FileText, Plus, Download, Search, DollarSign } from 'lucide-react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { useInvoicesStore } from '../store/useInvoicesStore';
import { useClientsStore } from '../store/useClientsStore';
import { useAppointmentsStore } from '../store/useAppointmentsStore';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Invoices: React.FC = () => {
  const { invoices, fetchInvoices, addInvoice, markAsPaid, isLoading, error } = useInvoicesStore();
  const { clients, fetchClients } = useClientsStore();
  const { appointments, fetchAppointments } = useAppointmentsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    client_id: '',
    appointment_id: '',
    amount: '',
    due_date: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  });
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    fetchInvoices();
    fetchClients();
    fetchAppointments();
  }, [fetchInvoices, fetchClients, fetchAppointments]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleOpenModal = () => {
    setFormData({
      client_id: '',
      appointment_id: '',
      amount: '',
      due_date: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    });
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If changing client, reset appointment selection
    if (name === 'client_id') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        appointment_id: ''
      }));
      
      // If appointment is selected, set its amount
    } else if (name === 'appointment_id' && value) {
      const selectedAppointment = appointments.find(a => a.id === value);
      if (selectedAppointment?.service?.price) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          amount: selectedAppointment.service!.price.toString()
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newInvoice = {
        client_id: formData.client_id,
        appointment_id: formData.appointment_id || null,
        amount: parseFloat(formData.amount),
        due_date: formData.due_date,
        status: 'pending'
      };
      
      const added = await addInvoice(newInvoice);
      if (added) {
        toast.success('Invoice created successfully');
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Error creating invoice');
    }
  };
  
  const handleMarkAsPaid = async (id: string) => {
    const updated = await markAsPaid(id);
    if (updated) {
      toast.success('Invoice marked as paid');
    } else {
      toast.error('Failed to update invoice');
    }
  };
  
  // Filter invoices by search query and status
  const filteredInvoices = invoices.filter(invoice => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = invoice.client?.name?.toLowerCase().includes(searchLower) || 
                        invoice.id.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get appointments for selected client
  const clientAppointments = appointments.filter(
    appointment => appointment.client_id === formData.client_id
  );
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <FileText className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your client invoices
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search invoices..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select
            className="w-full md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' }
            ]}
          />
        </div>
        
        <Button onClick={handleOpenModal}>
          <Plus className="h-5 w-5 mr-1" />
          New Invoice
        </Button>
      </div>
      
      <Card>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{invoice.id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {invoice.client?.name || 'Unknown Client'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${invoice.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={invoice.status === 'paid' ? 'success' : 'warning'}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {invoice.pdf_url && (
                          <a
                            href={invoice.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                        )}
                        
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <DollarSign className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      {invoices.length === 0 
                        ? 'No invoices created yet' 
                        : 'No invoices match your search'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Invoice"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline\" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Create Invoice
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Select
              label="Client"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              options={clients.map(client => ({
                value: client.id,
                label: client.name
              }))}
              placeholder="Select a client"
              required
            />
            
            <Select
              label="Appointment (Optional)"
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleInputChange}
              options={clientAppointments.map(appointment => ({
                value: appointment.id,
                label: `${new Date(appointment.start_time).toLocaleDateString()} - ${appointment.service?.name || 'Service'}`
              }))}
              placeholder="Select an appointment"
              disabled={!formData.client_id}
            />
            
            <Input
              label="Amount ($)"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Due Date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Invoices;