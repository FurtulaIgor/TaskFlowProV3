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
import { Calendar, Users, FileText, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
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
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [revenueToday, setRevenueToday] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  
  // Use React Query for data fetching with proper cache invalidation
  const { data: appointments = [], isLoading: isLoadingAppointments, refetch: refetchAppointments } = useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: () => fetchAppointments(),
    staleTime: 1 * 60 * 1000, // 1 minute - shorter for more frequent updates
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  
  const { data: clients = [], isLoading: isLoadingClients, refetch: refetchClients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => fetchClients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  
  const { data: invoices = [], isLoading: isLoadingInvoices, refetch: refetchInvoices } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: () => fetchInvoices(),
    staleTime: 1 * 60 * 1000, // 1 minute - shorter for more frequent updates
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Listen for data changes and refresh when needed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refetch data when user returns to the tab
        refetchAppointments();
        refetchInvoices();
        refetchClients();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetchAppointments, refetchInvoices, refetchClients]);

  // Set up automatic refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [queryClient]);
  
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
  
  // Generate data for charts - last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, 'yyyy-MM-dd');
  }).reverse();
  
  // Revenue chart data
  const revenueData = {
    labels: last7Days.map(date => format(new Date(date), 'dd.MM')),
    datasets: [
      {
        label: t.dashboard.revenueChart,
        data: last7Days.map(date => {
          return invoices
            .filter((inv: Invoice) => inv.created_at.includes(date) && inv.status === 'paid')
            .reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };
  
  // Appointments chart data
  const appointmentData = {
    labels: last7Days.map(date => format(new Date(date), 'dd.MM')),
    datasets: [
      {
        label: t.dashboard.appointmentsChart,
        data: last7Days.map(date => {
          return appointments.filter((appt: Appointment) => appt.start_time.includes(date)).length;
        }),
        backgroundColor: 'rgba(20, 184, 166, 0.8)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // Chart options
  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${t.dashboard.todaysRevenue}: ${context.parsed.y.toFixed(2)} RSD`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(0) + ' RSD';
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const appointmentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${t.nav.appointments}: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            return Number.isInteger(value) ? value : '';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.dashboard.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {t.dashboard.businessOverview} {format(new Date(), 'dd.MM.yyyy')}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
          }}
          className="flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          {t.dashboard.refreshData}
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t.dashboard.todaysAppointments}</p>
                <p className="text-3xl font-bold text-gray-900">{todayAppointments}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {todayAppointments === 0 ? t.dashboard.noAppointmentsToday : 
                   todayAppointments === 1 ? t.dashboard.appointmentToday : 
                   t.dashboard.appointmentsToday}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/app/appointments')}
                className="w-full"
              >
                {t.dashboard.viewAppointments}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t.dashboard.totalClients}</p>
                <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalClients === 0 ? t.dashboard.noRegisteredClients :
                   totalClients === 1 ? t.dashboard.registeredClient :
                   t.dashboard.registeredClients}
                </p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/app/clients')}
                className="w-full"
              >
                {t.dashboard.manageClients}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t.dashboard.todaysRevenue}</p>
                <p className="text-3xl font-bold text-gray-900">{revenueToday.toFixed(2)} RSD</p>
                <p className="text-xs text-gray-500 mt-1">
                  {revenueToday === 0 ? t.dashboard.noRevenueToday : t.dashboard.fromPaidInvoices}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/app/invoices')}
                className="w-full"
              >
                {t.dashboard.viewInvoices}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t.dashboard.pendingInvoices}</p>
                <p className="text-3xl font-bold text-gray-900">{pendingInvoices}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {pendingInvoices === 0 ? t.dashboard.allInvoicesPaid :
                   pendingInvoices === 1 ? t.dashboard.invoicePending :
                   t.dashboard.invoicesPending}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate('/app/invoices')}
                className="w-full"
              >
                {t.dashboard.viewInvoices}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t.dashboard.revenueChart}</h3>
                <p className="text-sm text-gray-600">{t.dashboard.dailyRevenueOverview}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <Line data={revenueData} options={revenueChartOptions} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t.dashboard.appointmentsChart}</h3>
                <p className="text-sm text-gray-600">{t.dashboard.appointmentsByDay}</p>
              </div>
              <div className="bg-teal-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <Bar data={appointmentData} options={appointmentChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">{t.dashboard.quickActions}</h3>
            <p className="text-sm text-gray-600">{t.dashboard.mostUsedFeatures}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/app/appointments')}
                className="flex items-center justify-center gap-2 h-12"
              >
                <Calendar className="h-5 w-5" />
                {t.dashboard.newAppointment}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/app/clients')}
                className="flex items-center justify-center gap-2 h-12"
              >
                <Users className="h-5 w-5" />
                {t.dashboard.addClient}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/app/invoices')}
                className="flex items-center justify-center gap-2 h-12"
              >
                <FileText className="h-5 w-5" />
                {t.dashboard.newInvoice}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/app/settings')}
                className="flex items-center justify-center gap-2 h-12"
              >
                <DollarSign className="h-5 w-5" />
                {t.dashboard.addService}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;