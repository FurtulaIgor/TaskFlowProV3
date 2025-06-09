import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, UserCog, Clock, DollarSign } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useServicesStore, Service } from '../store/useServicesStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Settings: React.FC = () => {
  const { services, fetchServices, addService, updateService, deleteService, isLoading, error } = useServicesStore();
  
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
  
  const [isEditingService, setIsEditingService] = useState(false);
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setServiceFormData(prev => ({ 
      ...prev, 
      [name]: name === 'duration' || name === 'price' ? parseFloat(value) : value 
    }));
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
    if (confirm('Are you sure you want to delete this service?')) {
      const success = await deleteService(id);
      if (success) {
        toast.success('Service deleted successfully');
      } else {
        toast.error('Failed to delete service');
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
          toast.success('Service updated successfully');
          handleCancelServiceEdit();
        }
      } else {
        const added = await addService(serviceFormData);
        
        if (added) {
          toast.success('Service added successfully');
          setServiceFormData({
            name: '',
            description: '',
            duration: 60,
            price: 0
          });
        }
      }
    } catch (error) {
      toast.error('Error saving service');
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <SettingsIcon className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Services" className="col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            
            <form onSubmit={handleSubmitService} className="space-y-4">
              <Input
                label="Service Name"
                name="name"
                value={serviceFormData.name}
                onChange={handleServiceInputChange}
                placeholder="e.g., Haircut, Consultation, Therapy Session"
                required
              />
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={serviceFormData.description}
                  onChange={handleServiceInputChange}
                  placeholder="Describe the service in detail"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <Input
                    label="Duration (minutes)"
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
                    label="Price ($)"
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
                <Button type="submit" isLoading={isLoading}>
                  {isEditingService ? 'Update Service' : 'Add Service'}
                </Button>
                
                {isEditingService && (
                  <Button type="button" variant="outline" onClick={handleCancelServiceEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Services</h3>
            
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
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
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
                          <div className="text-sm text-gray-900">{service.duration} minutes</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${service.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            size="sm"
                            variant="outline"
                            className="mr-2"
                            onClick={() => handleEditService(service)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No services added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
        
        <Card title="Account Settings">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <UserCog className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            
            <Input
              label="Full Name"
              defaultValue=""
              placeholder="John Doe"
            />
            
            <Input
              label="Business Name"
              defaultValue=""
              placeholder="My Business"
            />
            
            <Input
              label="Email Address"
              type="email"
              defaultValue=""
              placeholder="john@example.com"
              disabled
              className="bg-gray-100"
            />
            
            <div className="pt-4">
              <Button>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
        
        <Card title="Notification Settings">
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Email Notifications</h3>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="new-appointment"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="new-appointment" className="ml-2 block text-sm text-gray-700">
                    New appointment notifications
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
                    Appointment reminders
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
                    Payment notifications
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button>
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;