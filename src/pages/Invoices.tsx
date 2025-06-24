import React, { useEffect, useState } from 'react';
import { FileText, Plus, Download, Search, DollarSign, User, Calendar, Receipt, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
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
        toast.success('Faktura je uspešno kreirana');
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Greška prilikom kreiranja fakture');
    }
  };
  
  const handleMarkAsPaid = async (id: string) => {
    const updated = await markAsPaid(id);
    if (updated) {
      toast.success('Faktura je označena kao plaćena');
    } else {
      toast.error('Greška prilikom ažuriranja fakture');
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
          <h1 className="text-2xl font-bold text-gray-900">Fakture</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upravljanje fakturama i naplatom
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
              placeholder="Pretražite fakture..."
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
              { value: 'all', label: 'Svi statusi' },
              { value: 'pending', label: 'Na čekanju' },
              { value: 'paid', label: 'Plaćeno' }
            ]}
          />
        </div>
        
        <Button onClick={handleOpenModal}>
          <Plus className="h-5 w-5 mr-1" />
          Nova faktura
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
                    Broj fakture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klijent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum kreiranja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum dospeća
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Iznos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcije
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
                        {invoice.client?.name || 'Nepoznat klijent'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(invoice.created_at).toLocaleDateString('sr-RS')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('sr-RS') : 'Nije definisan'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.amount.toFixed(2)} RSD
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={invoice.status === 'paid' ? 'success' : 'warning'}
                      >
                        {invoice.status === 'paid' ? 'Plaćeno' : 'Na čekanju'}
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
                            title="Preuzmi PDF"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                        )}
                        
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Označi kao plaćeno"
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
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      {invoices.length === 0 
                        ? 'Još uvek nema kreiranih faktura' 
                        : 'Nema faktura koje odgovaraju pretrazi'}
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
        title="Kreiraj novu fakturu"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={handleSubmit} loading={isLoading}>
              Kreiraj fakturu
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Information Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Kreiranje nove fakture
                </h4>
                <p className="text-sm text-blue-700">
                  Popunite potrebne informacije za kreiranje fakture. Možete povezati fakturu sa postojećim terminom ili kreirati nezavisnu fakturu.
                </p>
              </div>
            </div>
          </div>

          {/* Client Selection */}
          <div>
            <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Klijent *
            </label>
            <Select
              id="client_id"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              options={clients.map(client => ({
                value: client.id,
                label: `${client.name} (${client.email})`
              }))}
              placeholder="Izaberite klijenta za fakturu"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Odaberite klijenta kome želite da ispošaljete fakturu
            </p>
          </div>
          
          {/* Appointment Selection */}
          <div>
            <label htmlFor="appointment_id" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Povezani termin (opciono)
            </label>
            <Select
              id="appointment_id"
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleInputChange}
              options={clientAppointments.map(appointment => ({
                value: appointment.id,
                label: `${new Date(appointment.start_time).toLocaleDateString('sr-RS')} - ${appointment.service?.name || 'Usluga'} (${appointment.service?.price || 0} RSD)`
              }))}
              placeholder="Izaberite termin (opciono)"
              disabled={!formData.client_id}
            />
            <p className="mt-1 text-xs text-gray-500">
              {!formData.client_id 
                ? 'Prvo izaberite klijenta da biste videli dostupne termine'
                : 'Opcionalno - izaberite termin da se automatski popuni iznos na osnovu cene usluge'
              }
            </p>
          </div>
          
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Iznos (RSD) *
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="npr. 5000.00"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Unesite iznos fakture u dinarima. Ako ste izabrali termin, iznos će se automatski popuniti na osnovu cene usluge.
            </p>
          </div>
          
          {/* Due Date */}
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
              <Receipt className="inline h-4 w-4 mr-1" />
              Datum dospeća *
            </label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Odaberite datum do kada faktura treba da bude plaćena. Podrazumevano je postavljen na 7 dana od danas.
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Dodatne informacije</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Faktura će automatski dobiti jedinstveni broj</li>
              <li>• Status fakture će biti postavljen na "Na čekanju"</li>
              <li>• Možete kasnije označiti fakturu kao plaćenu</li>
              <li>• PDF verzija fakture će biti dostupna nakon kreiranja</li>
            </ul>
          </div>

          {/* Required fields note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Napomena:</span> Polja označena sa * su obavezna za popunjavanje.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Invoices;