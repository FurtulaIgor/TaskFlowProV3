import React, { useEffect, useState } from 'react';
import { format, addDays, startOfWeek, addMinutes } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Edit, User, Clock, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAppointmentsStore } from '../store/useAppointmentsStore';
import { useClientsStore } from '../store/useClientsStore';
import { useServicesStore } from '../store/useServicesStore';
import { toast } from 'sonner';

const Appointments: React.FC = () => {
  const { appointments, fetchAppointments, addAppointment, updateAppointment, deleteAppointment, isLoading } = useAppointmentsStore();
  const { clients, fetchClients } = useClientsStore();
  const { services, fetchServices } = useServicesStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    client_id: '',
    service_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: 60,
    notes: '',
    status: 'pending'
  });
  
  useEffect(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = addDays(startDate, 6);
    
    fetchAppointments(startDate, endDate);
    fetchClients();
    fetchServices();
  }, [fetchAppointments, fetchClients, fetchServices, currentDate]);
  
  const handlePreviousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  
  const handleOpenModal = () => {
    setIsEditMode(false);
    setSelectedAppointment(null);
    setFormData({
      client_id: '',
      service_id: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      duration: 60,
      notes: '',
      status: 'pending'
    });
    setIsModalOpen(true);
  };
  
  const handleEditAppointment = (id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;
    
    const date = format(new Date(appointment.start_time), 'yyyy-MM-dd');
    const time = format(new Date(appointment.start_time), 'HH:mm');
    
    // Calculate duration in minutes
    const start = new Date(appointment.start_time);
    const end = new Date(appointment.end_time);
    const durationInMs = end.getTime() - start.getTime();
    const durationInMinutes = Math.round(durationInMs / (1000 * 60));
    
    setFormData({
      client_id: appointment.client_id,
      service_id: appointment.service_id,
      date,
      time,
      duration: durationInMinutes,
      notes: appointment.notes || '',
      status: appointment.status
    });
    
    setSelectedAppointment(id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  
  const handleDeleteAppointment = async (id: string) => {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj termin?')) {
      const success = await deleteAppointment(id);
      if (success) {
        toast.success('Termin je uspešno obrisan');
      } else {
        toast.error('Greška prilikom brisanja termina');
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create date objects
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = addMinutes(startDateTime, formData.duration);
      
      const appointmentData = {
        client_id: formData.client_id,
        service_id: formData.service_id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        notes: formData.notes,
        status: formData.status
      };
      
      if (isEditMode && selectedAppointment) {
        const updated = await updateAppointment(selectedAppointment, appointmentData);
        if (updated) {
          toast.success('Termin je uspešno ažuriran');
          setIsModalOpen(false);
        }
      } else {
        const added = await addAppointment(appointmentData);
        if (added) {
          toast.success('Termin je uspešno kreiran');
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      toast.error('Greška prilikom čuvanja termina');
    }
  };
  
  // Generate week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Create time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  
  // Group appointments by day and time
  const appointmentsByDayAndTime: Record<string, Record<string, any[]>> = {};
  
  weekDays.forEach(day => {
    const dateKey = format(day, 'yyyy-MM-dd');
    appointmentsByDayAndTime[dateKey] = {};
    
    timeSlots.forEach(timeSlot => {
      appointmentsByDayAndTime[dateKey][timeSlot] = [];
    });
    
    appointments
      .filter(appointment => appointment.start_time.includes(dateKey))
      .forEach(appointment => {
        const startTime = format(new Date(appointment.start_time), 'HH:00');
        if (appointmentsByDayAndTime[dateKey][startTime]) {
          appointmentsByDayAndTime[dateKey][startTime].push(appointment);
        }
      });
  });
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Calendar className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Termini</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upravljanje terminima sa klijentima
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <span className="font-medium text-gray-700">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </span>
          
          <Button variant="outline" onClick={handleNextWeek}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <Button onClick={handleOpenModal}>
          <Plus className="h-5 w-5 mr-1" />
          Novi termin
        </Button>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vreme
                </th>
                {weekDays.map((day) => (
                  <th key={day.toString()} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div>{format(day, 'EEE')}</div>
                    <div className="font-bold">{format(day, 'd')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {timeSlot}
                  </td>
                  {weekDays.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const appointments = appointmentsByDayAndTime[dateKey]?.[timeSlot] || [];
                    
                    return (
                      <td key={dateKey} className="px-2 py-4">
                        {appointments.map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-xs"
                          >
                            <div className="font-medium text-blue-700">
                              {appointment.client?.name}
                            </div>
                            <div className="text-blue-600">
                              {appointment.service?.name}
                            </div>
                            <div className="mt-1 flex space-x-1">
                              <button 
                                onClick={() => handleEditAppointment(appointment.id)}
                                className="text-gray-500 hover:text-blue-600"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAppointment(appointment.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Uredi termin' : 'Kreiraj novi termin'}
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Otkaži
            </Button>
            <Button onClick={handleSubmit} loading={isLoading}>
              {isEditMode ? 'Sačuvaj izmene' : 'Kreiraj termin'}
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
                  Kreiranje novog termina
                </h4>
                <p className="text-sm text-blue-700">
                  Popunite sva potrebna polja da biste zakazali termin sa klijentom. Sva polja označena sa * su obavezna.
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
              placeholder="Izaberite klijenta za termin"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Odaberite klijenta sa kojim želite da zakažete termin
            </p>
          </div>
          
          {/* Service Selection */}
          <div>
            <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Usluga *
            </label>
            <Select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={handleInputChange}
              options={services.map(service => ({
                value: service.id,
                label: `${service.name} - ${service.price} RSD (${service.duration} min)`
              }))}
              placeholder="Izaberite uslugu"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Odaberite uslugu koju ćete pružiti klijentu tokom termina
            </p>
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Datum termina *
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Odaberite datum kada će se termin održati
              </p>
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Vreme početka *
              </label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Unesite vreme kada termin počinje
              </p>
            </div>
          </div>
          
          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Trajanje (minuti) *
            </label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="15"
              step="15"
              value={formData.duration.toString()}
              onChange={handleInputChange}
              placeholder="npr. 60"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Unesite koliko minuta će termin trajati (minimum 15 minuta, korak od 15 minuta)
            </p>
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status termina *
            </label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'pending', label: 'Na čekanju - termin još nije potvrđen' },
                { value: 'confirmed', label: 'Potvrđen - termin je potvrđen' },
                { value: 'cancelled', label: 'Otkazan - termin je otkazan' }
              ]}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Odaberite trenutni status termina
            </p>
          </div>
          
          {/* Notes */}
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
              placeholder="npr. Klijent je alergičan na određene proizvode, posebni zahtevi, priprema pre termina..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Opcionalno - dodajte važne informacije o terminu, posebne zahteve ili napomene
            </p>
          </div>

          {/* Required fields note */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-800">
              <span className="font-medium">Napomena:</span> Polja označena sa * su obavezna za popunjavanje. 
              Trajanje termina će se automatski izračunati na osnovu odabrane usluge.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;