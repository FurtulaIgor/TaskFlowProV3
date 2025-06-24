import React, { useEffect, useState } from 'react';
import { FileText, Plus, Download, Search, DollarSign, User, Calendar, Receipt, AlertCircle, Edit2, RotateCcw, FileDown, Eye, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { useInvoicesStore } from '../store/useInvoicesStore';
import { useClientsStore } from '../store/useClientsStore';
import { useAppointmentsStore } from '../store/useAppointmentsStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Invoices: React.FC = () => {
  const { invoices, fetchInvoices, addInvoice, markAsPaid, markAsPending, updateInvoiceStatus, generatePdf, isLoading, error } = useInvoicesStore();
  const { clients, fetchClients } = useClientsStore();
  const { appointments, fetchAppointments } = useAppointmentsStore();
  const { profile, fetchProfile } = useUserProfileStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [currentInvoiceForPdf, setCurrentInvoiceForPdf] = useState<any>(null);
  
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
    fetchProfile();
  }, [fetchInvoices, fetchClients, fetchAppointments, fetchProfile]);
  
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

  const handleOpenStatusModal = (invoiceId: string, currentStatus: string) => {
    setSelectedInvoiceId(invoiceId);
    setNewStatus(currentStatus);
    setIsStatusModalOpen(true);
  };

  const handleGeneratePdf = async (invoice: any) => {
    setIsGeneratingPdf(invoice.id);
    
    try {
      const pdfData = await generatePdf(invoice, profile);
      
      if (pdfData) {
        // Create a blob from the PDF data
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Set up preview
        setPdfPreviewUrl(url);
        setCurrentInvoiceForPdf(invoice);
        setIsPdfPreviewOpen(true);
        
        toast.success('PDF faktura je uspešno generisana');
      } else {
        toast.error('Greška prilikom generisanja PDF fakture');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Neočekivana greška prilikom generisanja PDF-a');
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfPreviewUrl && currentInvoiceForPdf) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.download = `faktura-${currentInvoiceForPdf.id.substring(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('PDF faktura je preuzeta');
    }
  };

  const handleClosePdfPreview = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    setPdfPreviewUrl(null);
    setCurrentInvoiceForPdf(null);
    setIsPdfPreviewOpen(false);
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

  const handleStatusUpdate = async () => {
    if (!selectedInvoiceId || !newStatus) return;

    try {
      const updated = await updateInvoiceStatus(selectedInvoiceId, newStatus);
      if (updated) {
        const statusText = newStatus === 'paid' ? 'plaćeno' : 
                          newStatus === 'pending' ? 'na čekanju' : 
                          newStatus === 'cancelled' ? 'otkazano' : 
                          newStatus === 'overdue' ? 'neplaćeno' : newStatus;
        toast.success(`Status fakture je promenjen na "${statusText}"`);
        setIsStatusModalOpen(false);
        setSelectedInvoiceId(null);
        setNewStatus('');
      } else {
        toast.error('Greška prilikom ažuriranja statusa fakture');
      }
    } catch (error) {
      toast.error('Neočekivana greška prilikom ažuriranja statusa');
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

  const handleMarkAsPending = async (id: string) => {
    const updated = await markAsPending(id);
    if (updated) {
      toast.success('Faktura je vraćena na status "na čekanju"');
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

  // Get badge variant for status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'overdue':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Plaćeno';
      case 'pending':
        return 'Na čekanju';
      case 'cancelled':
        return 'Otkazano';
      case 'overdue':
        return 'Neplaćeno';
      default:
        return status;
    }
  };
  
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
              { value: 'paid', label: 'Plaćeno' },
              { value: 'cancelled', label: 'Otkazano' },
              { value: 'overdue', label: 'Neplaćeno' }
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
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {getStatusDisplayText(invoice.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Generate PDF Button */}
                        <button
                          onClick={() => handleGeneratePdf(invoice)}
                          disabled={isGeneratingPdf === invoice.id}
                          className="text-purple-600 hover:text-purple-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Prikaži PDF fakturu"
                        >
                          {isGeneratingPdf === invoice.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        {/* Edit Status Button */}
                        <button
                          onClick={() => handleOpenStatusModal(invoice.id, invoice.status)}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          title="Promeni status"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        {/* PDF Download */}
                        {invoice.pdf_url && (
                          <a
                            href={invoice.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Preuzmi PDF"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                        
                        {/* Quick Actions */}
                        {invoice.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Označi kao plaćeno"
                          >
                            <DollarSign className="h-4 w-4" />
                          </button>
                        )}

                        {invoice.status === 'paid' && (
                          <button
                            onClick={() => handleMarkAsPending(invoice.id)}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                            title="Vrati na čekanje"
                          >
                            <RotateCcw className="h-4 w-4" />
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
              <li>• Možete kasnije promeniti status fakture</li>
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

      {/* Status Change Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Promeni status fakture"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={handleStatusUpdate} loading={isLoading}>
              Sačuvaj promenu
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Information Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  Promena statusa fakture
                </h4>
                <p className="text-sm text-yellow-700">
                  Promena statusa fakture će ažurirati datum plaćanja i druge povezane informacije. 
                  Ova akcija se može poništiti kasnije.
                </p>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Novi status fakture
            </label>
            <Select
              id="newStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={[
                { value: 'pending', label: 'Na čekanju - faktura čeka plaćanje' },
                { value: 'paid', label: 'Plaćeno - faktura je plaćena' },
                { value: 'cancelled', label: 'Otkazano - faktura je otkazana' },
                { value: 'overdue', label: 'Neplaćeno - faktura nije plaćena na vreme' }
              ]}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Odaberite novi status za fakturu. Datum plaćanja će se automatski ažurirati.
            </p>
          </div>

          {/* Status Explanations */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Objašnjenje statusa</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li><strong>Na čekanju:</strong> Faktura je kreirana i čeka plaćanje</li>
              <li><strong>Plaćeno:</strong> Faktura je plaćena (automatski se postavlja datum plaćanja)</li>
              <li><strong>Otkazano:</strong> Faktura je otkazana i neće biti naplaćena</li>
              <li><strong>Neplaćeno:</strong> Faktura nije plaćena na vreme ili je označena kao neplaćena</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        isOpen={isPdfPreviewOpen}
        onClose={handleClosePdfPreview}
        title={`PDF Faktura #${currentInvoiceForPdf?.id?.substring(0, 8) || ''}`}
        size="xl"
        footer={
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-600">
              {currentInvoiceForPdf && (
                <>
                  Klijent: {currentInvoiceForPdf.client?.name} | 
                  Iznos: {currentInvoiceForPdf.amount?.toFixed(2)} RSD | 
                  Status: {getStatusDisplayText(currentInvoiceForPdf.status)}
                </>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClosePdfPreview}>
                <X className="h-4 w-4 mr-2" />
                Zatvori
              </Button>
              <Button onClick={handleDownloadPdf}>
                <Download className="h-4 w-4 mr-2" />
                Preuzmi PDF
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* PDF Preview Container */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded shadow-lg" style={{ minHeight: '600px' }}>
              {pdfPreviewUrl ? (
                <iframe
                  src={pdfPreviewUrl}
                  className="w-full h-[600px] rounded"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Učitavanje PDF pregleda...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PDF Actions Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  PDF Faktura
                </h4>
                <p className="text-sm text-blue-700">
                  Možete pregledati fakturu u PDF formatu. Kliknite na "Preuzmi PDF" da sačuvate fakturu na vaš računar, 
                  ili "Zatvori" da se vratite na listu faktura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Invoices;