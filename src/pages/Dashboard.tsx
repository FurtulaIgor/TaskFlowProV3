import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Calendar, Users, FileText, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAppointmentsStore, Appointment } from '@/store/useAppointmentsStore';
import { useClientsStore, Client } from '@/store/useClientsStore';
import { useInvoicesStore, Invoice } from '@/store/useInvoicesStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { fetchAppointments } = useAppointmentsStore();
  const { fetchClients } = useClientsStore();
  const { fetchInvoices } = useInvoicesStore();
  const navigate = useNavigate();
  
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [revenueToday, setRevenueToday] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  
  // Use React Query for data fetching
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: () => fetchAppointments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => fetchClients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: () => fetchInvoices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    // Count today's appointments
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const todayAppts = appointments.filter((appt: Appointment) => 
      appt.start_time.includes(todayStr)
    ).length;
    
    setTodayAppointments(todayAppts);
    
    // Count total clients
    setTotalClients(clients.length);
    
    // Calculate revenue for today
    const todayInvoices = invoices.filter((inv: Invoice) => 
      inv.created_at.includes(todayStr) && inv.status === 'paid'
    );
    
    const todayRevenue = todayInvoices.reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);
    setRevenueToday(todayRevenue);
    
    // Count pending invoices
    const pending = invoices.filter((inv: Invoice) => inv.status === 'pending').length;
    setPendingInvoices(pending);
    
  }, [appointments, clients, invoices]);
  
  // Generate data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, 'yyyy-MM-dd');
  }).reverse();
  
  const revenueData = {
    labels: last7Days.map(date => format(new Date(date), 'MMM dd')),
    datasets: [
      {
        label: 'Revenue',
        data: last7Days.map(date => {
          return invoices
            .filter((inv: Invoice) => inv.created_at.includes(date) && inv.status === 'paid')
            .reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const appointmentData = {
    labels: last7Days.map(date => format(new Date(date), 'MMM dd')),
    datasets: [
      {
        label: 'Appointments',
        data: last7Days.map(date => {
          return appointments.filter((appt: Appointment) => appt.start_time.includes(date)).length;
        }),
        backgroundColor: 'rgba(20, 184, 166, 0.7)',
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };
  
  const isLoading = isLoadingAppointments || isLoadingClients || isLoadingInvoices;
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Pregled poslovanja
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Današnji termini</p>
                <p className="text-2xl font-semibold">{todayAppointments}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/appointments')}
              >
                Pogledaj termine
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ukupno klijenata</p>
                <p className="text-2xl font-semibold">{totalClients}</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/clients')}
              >
                Upravljaj klijentima
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Današnji prihod</p>
                <p className="text-2xl font-semibold">${revenueToday.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/invoices')}
              >
                Pogledaj fakture
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Na čekanju</p>
                <p className="text-2xl font-semibold">{pendingInvoices}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/invoices')}
              >
                Upravljaj fakturama
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Prihod (poslednjih 7 dana)</h3>
          </CardHeader>
          <CardContent>
            <Line data={revenueData} options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Termini (poslednjih 7 dana)</h3>
          </CardHeader>
          <CardContent>
            <Bar data={appointmentData} options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;