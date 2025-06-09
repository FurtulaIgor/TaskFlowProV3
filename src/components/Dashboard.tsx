import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppointmentsStore } from '../store/useAppointmentsStore';
import { useClientsStore } from '../store/useClientsStore';
import { useServicesStore } from '../store/useServicesStore';
import { format } from 'date-fns';
import { LoadingSpinner } from './common/LoadingSpinner';

export const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { fetchAppointments } = useAppointmentsStore();
  const { fetchClients } = useClientsStore();
  const { fetchServices } = useServicesStore();
  
  const { data: appointments, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['appointments', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => fetchAppointments(selectedDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
  
  const { data: clients, isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
  
  const { data: services, isLoading: isServicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
  
  const isLoading = isAppointmentsLoading || isClientsLoading || isServicesLoading;
  
  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
          {appointments && appointments.length > 0 ? (
            <ul className="space-y-4">
              {appointments.map(appointment => (
                <li key={appointment.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{appointment.client?.name}</span>
                    <span>{format(new Date(appointment.start_time), 'HH:mm')}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.service?.name} - ${appointment.service?.price}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No appointments scheduled for today</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Clients</h2>
          {clients && clients.length > 0 ? (
            <ul className="space-y-4">
              {clients.slice(0, 5).map(client => (
                <li key={client.id} className="border-b pb-2">
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-gray-600">{client.email}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No clients found</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          {services && services.length > 0 ? (
            <ul className="space-y-4">
              {services.map(service => (
                <li key={service.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{service.name}</span>
                    <span>${service.price}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration: {service.duration} minutes
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No services found</p>
          )}
        </div>
      </div>
    </div>
  );
}; 