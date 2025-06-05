import React, { useEffect, useState } from 'react';
import { format, addDays, startOfWeek, addMinutes } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Edit } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
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
    if (confirm('Are you sure you want to delete this appointment?')) {
      const success = await deleteAppointment(id);
      if (success) {
        toast.success('Appointment deleted successfully');
      } else {
        toast.error('Failed to delete appointment');
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
          toast.success('Appointment updated successfully');
          setIsModalOpen(false);
        }
      } else {
        const added = await addAppointment(appointmentData);
        if (added) {
          toast.success('Appointment created successfully');
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      toast.error('Error saving appointment');
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
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your client appointments
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
          New Appointment
        </Button>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
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
        title={isEditMode ? 'Edit Appointment' : 'New Appointment'}
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline\" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              {isEditMode ? 'Update' : 'Create'}
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
              label="Service"
              name="service_id"
              value={formData.service_id}
              onChange={handleInputChange}
              options={services.map(service => ({
                value: service.id,
                label: `${service.name} ($${service.price}) - ${service.duration} min`
              }))}
              placeholder="Select a service"
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Input
              label="Duration (minutes)"
              name="duration"
              type="number"
              min="15"
              step="15"
              value={formData.duration.toString()}
              onChange={handleInputChange}
              required
            />
            
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
              required
            />
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;