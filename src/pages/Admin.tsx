import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { Shield, UserCog } from 'lucide-react';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { users, fetchUsers, updateUserRole, isLoading, error } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('user');
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleOpenModal = (userId: string, currentRole: string) => {
    setSelectedUser(userId);
    setSelectedRole(currentRole);
    setIsModalOpen(true);
  };
  
  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    const success = await updateUserRole(selectedUser, selectedRole);
    
    if (success) {
      toast.success('User role updated successfully');
      setIsModalOpen(false);
    } else {
      toast.error('Failed to update user role');
    }
  };
  
  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Shield className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage user roles and permissions
          </p>
        </div>
      </div>
      
      <Card title="User Management">
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        onClick={() => handleOpenModal(user.user_id, user.role)}
                        variant="outline"
                        size="sm"
                      >
                        <UserCog className="h-4 w-4 mr-1" />
                        Manage Role
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Role Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update User Role"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline\" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Change the role for the selected user. Admins have full access to all features, including user management.
          </p>
          
          <Select
            label="Role"
            options={roleOptions}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Admin;