import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Edit, Trash2, Search, Mail, Phone, User, FileText, Calendar, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { useClientsStore, Client } from '../store/useClientsStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

const Clients: React.FC = () => {
  const { clients, fetchClients, addClient, updateClient, deleteClient, isLoading, error } = useClientsStore();
  const { checkRole } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  // Check if current user is admin
  const isAdmin = checkRole('admin');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      phone: ''
    };

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Ime i prezime je obavezno';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Ime mora imati najmanje 2 karaktera';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email adresa je obavezna';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Unesite validnu email adresu';
    }

    // Validate phone
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Broj telefona je obavezan';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Unesite validan broj telefona';
    }

    setFormErrors(errors);
    return !errors.name && !errors.email && !errors.phone;
  };
  
  const handleOpenModal = () => {
    setIsEditMode(false);
    setSelectedClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      notes: ''
    });
    setFormErrors({
      name: '',
      email: '',
      phone: ''
    });
    setIsModalOpen(true);
  };
  
  const handleEditClient = (client: Client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      notes: client.notes || ''
    });
    setFormErrors({
      name: '',
      email: '',
      phone: ''
    });
    setSelectedClient(client.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  
  const handleDeleteClient = async (id: string) => {
    if (confirm('Da li ste sigurni da želite da obrišete ovog klijenta?')) {
      const success = await deleteClient(id);
      if (success) {
        toast.success('Klijent je uspešno obrisan');
      } else {
        toast.error('Greška prilikom brisanja klijenta');
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Molimo ispravite greške u formi');
      return;
    }
    
    try {
      if (isEditMode && selectedClient) {
        const updated = await updateClient(selectedClient, formData);
        if (updated) {
          toast.success('Podaci o klijentu su uspešno ažurirani');
          setIsModalOpen(false);
        } else {
          toast.error('Greška prilikom ažuriranja podataka o klijentu');
        }
      } else {
        const added = await addClient(formData);
        if (added) {
          toast.success('Novi klijent je uspešno dodat');
          setIsModalOpen(false);
        } else {
          toast.error('Greška prilikom dodavanja novog klijenta');
        }
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Neočekivana greška prilikom čuvanja podataka');
    }
  };
  
  // Filter clients by search query
  const filteredClients = clients.filter(client => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchQuery) ||
      (isAdmin && client.user?.email?.toLowerCase().includes(searchLower))
    );
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Users className="h-8 w-8 text-blue-600 mr-3" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Klijenti</h1>
            {isAdmin && (
              <Badge variant="primary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin pogled
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {isAdmin 
              ? 'Upravljanje svim klijentima u sistemu (admin pogled)'
              : 'Upravljanje informacijama o klijentima'
            }
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder={isAdmin ? "Pretražite klijente ili korisnike..." : "Pretražite klijente..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={handleOpenModal}>
          <UserPlus className="h-5 w-5 mr-1" />
          Dodaj klijenta
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
                    Ime i prezime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uneo korisnik
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isAdmin ? 'Datum unosa' : 'Poslednji kontakt'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcije
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{client.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{client.phone}</div>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {client.user?.email || 'Nepoznat korisnik'}
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {isAdmin 
                            ? formatDate(client.created_at)
                            : (client.last_interaction 
                                ? new Date(client.last_interaction).toLocaleDateString('sr-RS') 
                                : 'Nikad')
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Uredi klijenta"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Obriši klijenta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-sm text-gray-500">
                      {clients.length === 0 
                        ? 'Još uvek nema dodanih klijenata' 
                        : 'Nema klijenata koji odgovaraju pretrazi'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Uredi podatke o klijentu' : 'Dodaj novog klijenta'}
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Otkaži
            </Button>
            <Button 
              onClick={handleSubmit} 
              loading={isLoading}
              disabled={isLoading}
            >
              {isEditMode ? 'Sačuvaj izmene' : 'Dodaj klijenta'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Ime i prezime *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="npr. Marko Petrović"
              className={`${formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              required
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Unesite puno ime i prezime klijenta
            </p>
          </div>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email adresa *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="npr. marko@example.com"
              className={`${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              required
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Email adresa za komunikaciju i slanje faktura
            </p>
          </div>
          
          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Broj telefona *
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="npr. +381 60 123 4567"
              className={`${formErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              required
            />
            {formErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Kontakt telefon za hitne slučajeve i potvrde termina
            </p>
          </div>
          
          {/* Notes Field */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Dodatne napomene
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 resize-none"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="npr. Preferencije za termine, alergije, posebni zahtevi..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Opcionalno - dodajte važne informacije o klijentu
            </p>
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

export default Clients;