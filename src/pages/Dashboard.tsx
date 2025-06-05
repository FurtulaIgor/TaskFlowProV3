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
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppointmentsStore } from '../store/useAppointmentsStore';
import { useClientsStore } from '../store/useClientsStore';
import { useInvoicesStore } from '../store/useInvoicesStore';

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
  const { appointments, fetchAppointments } = useAppointmentsStore();
  const { clients, fetchClients } = useClientsStore();
  const { invoices, fetchInvoices } = useInvoicesStore();
  const navigate = useNavigate();
  
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [revenueToday, setRevenueToday] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  
  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchInvoices();
  }, [fetchAppointments, fetchClients, fetchInvoices]);
  
  useEffect(() => {
    // Count today's appointments
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const todayAppts = appointments.filter(appt => 
      appt.start_time.includes(todayStr)
    ).length;
    
    setTodayAppointments(todayAppts);
    
    // Count total clients
    setTotalClients(clients.length);
    
    // Calculate revenue for today
    const todayInvoices = invoices.filter(inv => 
      inv.created_at.includes(todayStr) && inv.status === 'paid'
    );
    
    const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    setRevenueToday(todayRevenue);
    
    // Count pending invoices
    const pending = invoices.filter(inv => inv.status === 'pending').length;
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
            .filter(inv => inv.created_at.includes(date) && inv.status === 'paid')
            .reduce((sum, inv) => sum + inv.amount, 0);
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
          return appointments.filter(appt => appt.start_time.includes(date)).length;
        }),
        backgroundColor: 'rgba(20, 184, 166, 0.7)',
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your business activities
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Today's Appointments</p>
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
              View appointments
            </Button>
          </div>
        </Card>
        
        <Card className="border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Clients</p>
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
              Manage clients
            </Button>
          </div>
        </Card>
        
        <Card className="border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Revenue Today</p>
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
              View revenue
            </Button>
          </div>
        </Card>
        
        <Card className="border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Invoices</p>
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
              Manage invoices
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Weekly Revenue">
          <div className="h-64">
            <Line 
              data={revenueData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
        
        <Card title="Weekly Appointments">
          <div className="h-64">
            <Bar 
              data={appointmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
      </div>
      
      {/* Upcoming appointments */}
      <Card title="Today's Appointments">
        <div className="overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments
                .filter(appt => appt.start_time.includes(format(new Date(), 'yyyy-MM-dd')))
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(appointment.start_time), 'h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.client?.name || 'Unknown Client'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.service?.name || 'Unknown Service'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              {appointments.filter(appt => appt.start_time.includes(format(new Date(), 'yyyy-MM-dd'))).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No appointments scheduled for today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;