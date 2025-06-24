import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, UserCog, Clock, DollarSign, Building, MapPin, Phone, Mail, CreditCard, FileText, User, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useServicesStore, Service } from '../store/useServicesStore';
import { useUserProfileStore, UserProfile } from '../store/useUserProfileStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { services, fetchServices, addService, updateService, deleteService, isLoading: isServicesLoading, error: servicesError } = useServicesStore();
  const { profile, fetchProfile, updateProfile, createProfile, isLoading: isProfileLoading, error: profileError } = useUserProfileStore();
  const { user } = useAuthStore();
  
  // Service form state
  const [serviceFormData, setServiceFormData] = useState<{
    id?: string;
    name: string;
    description: string;
    duration: number;
    price: number;
  }>({
    name: '',
    description: '',
    duration: 60,
    price: 0
  });
  
  // Profile form state
  const [profileFormData, setProfileFormData] = useState<Partial<UserProfile>>({
    full_name: '',
    company_name: '',
    company_type: 'individual',
    address: '',
    city: '',
    postal_code: '',
    country: 'Srbija',
    phone: '',
    email: '',
    tax_number: '',
    registration_number: '',
    bank_account: ''
  });
  
  const [isEditingService, setIsEditingService] = useState(false);
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  
  useEffect(() => {
    fetchServices();
    fetchProfile();
  }, [fetchServices, fetchProfile]);
  
  useEffect(() => {
    if (servicesError) {
      toast.error(servicesError);
    }
  }, [servicesError]);

  useEffect(() => {
    if (profileError) {
      toast.error(profileError);
    }
  }, [profileError]);

  // Initialize profile form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setProfileFormData({
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        company_type: profile.company_type || 'individual',
        address: profile.address || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || 'Srbija',
        phone: profile.phone || '',
        email: profile.email || user?.email || '',
        tax_number: profile.tax_number || '',
        registration_number: profile.registration_number || '',
        bank_account: profile.bank_account || ''
      });
    } else if (user) {
      // Initialize with user email if no profile exists
      setProfileFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [profile, user]);
  
  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setServiceFormData(prev => ({ 
      ...prev, 
      [name]: name === 'duration' || name === 'price' ? parseFloat(value) : value 
    }));
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({ ...prev, [name]: value }));
    setHasProfileChanges(true);
  };
  
  const handleEditService = (service: Service) => {
    setServiceFormData({
      id: service.id,
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price
    });
    setIsEditingService(true);
  };
  
  const handleCancelServiceEdit = () => {
    setServiceFormData({
      name: '',
      description: '',
      duration: 60,
      price: 0
    });
    setIsEditingService(false);
  };
  
  const handleDeleteService = async (id: string) => {
    if (confirm('Da li ste sigurni da želite da obrišete ovu uslugu?')) {
      const success = await deleteService(id);
      if (success) {
        toast.success('Usluga je uspešno obrisana');
      } else {
        toast.error('Greška prilikom brisanja usluge');
      }
    }
  };
  
  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditingService && serviceFormData.id) {
        const { id, ...updateData } = serviceFormData;
        const updated = await updateService(id, updateData);
        
        if (updated) {
          toast.success('Usluga je uspešno ažurirana');
          handleCancelServiceEdit();
        }
      } else {
        const added = await addService(serviceFormData);
        
        if (added) {
          toast.success('Usluga je uspešno dodana');
          setServiceFormData({
            name: '',
            description: '',
            duration: 60,
            price: 0
          });
        }
      }
    } catch (error) {
      toast.error('Greška prilikom čuvanja usluge');
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      if (profile) {
        result = await updateProfile(profileFormData);
      } else {
        result = await createProfile(profileFormData as Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
      }
      
      if (result) {
        toast.success('Podaci o profilu su uspešno sačuvani');
        setHasProfileChanges(false);
      } else {
        toast.error('Greška prilikom čuvanja profila');
      }
    } catch (error) {
      toast.error('Neočekivana greška prilikom čuvanja profila');
    }
  };

  const companyTypeOptions = [
    { value: 'individual', label: 'Preduzetnik / Fizičko lice' },
    { value: 'company', label: 'Pravno lice / Firma' }
  ];

  const countryOptions = [
    { value: 'Srbija', label: 'Srbija' },
    { value: 'Crna Gora', label: 'Crna Gora' },
    { value: 'Bosna i Hercegovina', label: 'Bosna i Hercegovina' },
    { value: 'Hrvatska', label: 'Hrvatska' },
    { value: 'Slovenija', label: 'Slovenija' },
    { value: 'Makedonija', label: 'Makedonija' }
  ];
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <SettingsIcon className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Podešavanja</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upravljanje podešavanjima naloga i preferencijama
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information Card */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <UserCog className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Lični i poslovni podaci</h3>
            </div>
            
            <form onSubmit={handleSubmitProfile} className="space-y-6">
              {/* Information Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      Podaci o profilu
                    </h4>
                    <p className="text-sm text-blue-700">
                      Ovi podaci će se koristiti za generisanje faktura i zvaničnu komunikaciju sa klijentima. 
                      Molimo unesite tačne informacije.
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Ime i prezime *
                  </label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={profileFormData.full_name || ''}
                    onChange={handleProfileInputChange}
                    placeholder="npr. Marko Petrović"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Vaše puno ime kako će se pojavljivati na fakturama
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email adresa *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileFormData.email || ''}
                    onChange={handleProfileInputChange}
                    placeholder="vas@email.com"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Glavna email adresa za komunikaciju
                  </p>
                </div>
              </div>

              {/* Company Information */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Podaci o firmi / preduzetništvu
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Tip poslovanja *
                    </label>
                    <Select
                      id="company_type"
                      name="company_type"
                      value={profileFormData.company_type || 'individual'}
                      onChange={handleProfileInputChange}
                      options={companyTypeOptions}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Odaberite da li ste preduzetnik ili firma
                    </p>
                  </div>

                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Naziv firme / preduzetništva
                    </label>
                    <Input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={profileFormData.company_name || ''}
                      onChange={handleProfileInputChange}
                      placeholder="npr. Marko Petrović PR ili DOO Moja Firma"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Zvanični naziv vašeg preduzetništva ili firme
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label htmlFor="tax_number" className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline h-4 w-4 mr-1" />
                      PIB (Poreski identifikacioni broj)
                    </label>
                    <Input
                      id="tax_number"
                      name="tax_number"
                      type="text"
                      value={profileFormData.tax_number || ''}
                      onChange={handleProfileInputChange}
                      placeholder="npr. 123456789"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Vaš PIB broj (opciono, ali preporučeno za fakturisanje)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline h-4 w-4 mr-1" />
                      Matični broj
                    </label>
                    <Input
                      id="registration_number"
                      name="registration_number"
                      type="text"
                      value={profileFormData.registration_number || ''}
                      onChange={handleProfileInputChange}
                      placeholder="npr. 12345678"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Matični broj preduzetništva ili firme (opciono)
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Kontakt informacije
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Broj telefona
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileFormData.phone || ''}
                      onChange={handleProfileInputChange}
                      placeholder="npr. +381 60 123 4567"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Kontakt telefon za klijente i poslovnu komunikaciju
                    </p>
                  </div>

                  <div>
                    <label htmlFor="bank_account" className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="inline h-4 w-4 mr-1" />
                      Broj računa
                    </label>
                    <Input
                      id="bank_account"
                      name="bank_account"
                      type="text"
                      value={profileFormData.bank_account || ''}
                      onChange={handleProfileInputChange}
                      placeholder="npr. 160-123456789-12"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Broj računa za prijem plaćanja (opciono)
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Adresa
                </h4>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Ulica i broj
                    </label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={profileFormData.address || ''}
                      onChange={handleProfileInputChange}
                      placeholder="npr. Knez Mihailova 42"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Adresa vašeg poslovnog prostora ili prebivališta
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        Grad
                      </label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={profileFormData.city || ''}
                        onChange={handleProfileInputChange}
                        placeholder="npr. Beograd"
                      />
                    </div>

                    <div>
                      <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                        Poštanski broj
                      </label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        type="text"
                        value={profileFormData.postal_code || ''}
                        onChange={handleProfileInputChange}
                        placeholder="npr. 11000"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Zemlja
                      </label>
                      <Select
                        id="country"
                        name="country"
                        value={profileFormData.country || 'Srbija'}
                        onChange={handleProfileInputChange}
                        options={countryOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {hasProfileChanges && (
                      <div className="flex items-center text-orange-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Imate nesačuvane promene
                      </div>
                    )}
                    {!hasProfileChanges && profile && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Podaci su sačuvani
                      </div>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    loading={isProfileLoading}
                    disabled={!hasProfileChanges}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sačuvaj promene
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Services Management Card */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-6">Usluge</h3>
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {isEditingService ? 'Uredi uslugu' : 'Dodaj novu uslugu'}
              </h4>
              
              <form onSubmit={handleSubmitService} className="space-y-4">
                <Input
                  label="Naziv usluge"
                  name="name"
                  value={serviceFormData.name}
                  onChange={handleServiceInputChange}
                  placeholder="npr. Šišanje, Konsultacija, Terapija"
                  required
                />
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Opis usluge
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={serviceFormData.description}
                    onChange={handleServiceInputChange}
                    placeholder="Detaljno opišite uslugu"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <Input
                      label="Trajanje (minuti)"
                      name="duration"
                      type="number"
                      min="15"
                      step="15"
                      value={serviceFormData.duration.toString()}
                      onChange={handleServiceInputChange}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                    <Input
                      label="Cena (RSD)"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={serviceFormData.price.toString()}
                      onChange={handleServiceInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button type="submit" loading={isServicesLoading}>
                    {isEditingService ? 'Ažuriraj uslugu' : 'Dodaj uslugu'}
                  </Button>
                  
                  {isEditingService && (
                    <Button type="button" variant="outline" onClick={handleCancelServiceEdit}>
                      Otkaži
                    </Button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Vaše usluge</h4>
              
              {isServicesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usluga
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trajanje
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cena
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Akcije
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            {service.description && (
                              <div className="text-sm text-gray-500">{service.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{service.duration} minuta</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{service.price.toFixed(2)} RSD</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              size="sm"
                              variant="outline"
                              className="mr-2"
                              onClick={() => handleEditService(service)}
                            >
                              Uredi
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              Obriši
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {services.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                            Još uvek nema dodanih usluga
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Notification Settings Card */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Podešavanja obaveštenja</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Email obaveštenja</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="new-appointment"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="new-appointment" className="ml-2 block text-sm text-gray-700">
                      Obaveštenja o novim terminima
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="appointment-reminder"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="appointment-reminder" className="ml-2 block text-sm text-gray-700">
                      Podsetnici za termine
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="payment-notification"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="payment-notification" className="ml-2 block text-sm text-gray-700">
                      Obaveštenja o plaćanjima
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button>
                  Sačuvaj podešavanja
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;