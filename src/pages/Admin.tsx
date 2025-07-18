import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { Shield, UserCog, History, AlertCircle, Trash2, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Admin: React.FC = () => {
  const { users, actions, fetchUsers, fetchActions, updateUserRole, deleteUser, isLoading, error } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [notes, setNotes] = useState('');
  const [deleteNotes, setDeleteNotes] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  
  useEffect(() => {
    fetchUsers();
    fetchActions();
  }, [fetchUsers, fetchActions]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleOpenModal = (userId: string, currentRole: string) => {
    setSelectedUser(userId);
    // Set the actual role, treating 'pending' as 'user' for UI purposes
    setSelectedRole(currentRole === 'pending' ? 'user' : currentRole);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (userId: string, userEmail: string) => {
    setSelectedUser(userId);
    setSelectedUserEmail(userEmail);
    setDeleteNotes('');
    setIsDeleteModalOpen(true);
  };
  
  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    setIsUpdatingRole(true);
    
    try {
      const success = await updateUserRole(selectedUser, selectedRole, notes);
      
      if (success) {
        toast.success('Uloga korisnika je uspešno ažurirana');
        setIsModalOpen(false);
        setSelectedUser(null);
        setSelectedRole('user');
        setNotes('');
      } else {
        toast.error('Greška prilikom ažuriranja uloge korisnika');
      }
    } catch (error) {
      toast.error('Neočekivana greška prilikom ažuriranja uloge');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsDeletingUser(true);
    
    try {
      const success = await deleteUser(selectedUser, deleteNotes);
      
      if (success) {
        toast.success('Korisnik je uspešno obrisan');
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        setSelectedUserEmail('');
        setDeleteNotes('');
      } else {
        toast.error('Greška prilikom brisanja korisnika');
      }
    } catch (error) {
      toast.error('Neočekivana greška prilikom brisanja korisnika');
    } finally {
      setIsDeletingUser(false);
    }
  };
  
  const roleOptions = [
    { value: 'user', label: 'Korisnik' },
    { value: 'admin', label: 'Administrator' },
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'pending':
        return 'Na čekanju';
      default:
        return 'Korisnik';
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Shield className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administracija</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upravljanje ulogama korisnika i dozvolama
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* User Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCog className="h-5 w-5 mr-2" />
              Upravljanje korisnicima
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nema registrovanih korisnika</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Korisnik
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uloga
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum registracije
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcije
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.user?.email?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {user.user?.email || 'Nepoznat email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {format(new Date(user.created_at), 'dd.MM.yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => handleOpenModal(user.user_id, user.role)}
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <UserCog className="h-4 w-4 mr-1" />
                              Upravljaj ulogom
                            </Button>
                            <Button
                              onClick={() => handleOpenDeleteModal(user.user_id, user.user?.email || 'Nepoznat email')}
                              variant="destructive"
                              size="sm"
                              className="hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Obriši
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Admin Actions Log Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Istorija admin akcija
            </CardTitle>
          </CardHeader>
          <CardContent>
            {actions.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nema zabeleženih akcija</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum i vreme
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tip akcije
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ciljni korisnik
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beleške
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {actions.map((action) => (
                      <tr key={action.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(action.created_at), 'dd.MM.yyyy HH:mm')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={action.action_type === 'delete_user' ? 'danger' : 'info'}>
                            {action.action_type === 'update_role' ? 'Ažuriranje uloge' : 
                             action.action_type === 'assign_role' ? 'Dodeljivanje uloge' :
                             action.action_type === 'delete_user' ? 'Brisanje korisnika' :
                             action.action_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {users.find(u => u.user_id === action.target_user_id)?.user?.email || 
                             action.target_user_id.substring(0, 8) + '...'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {action.notes || '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Role Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ažuriranje uloge korisnika"
        footer={
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              disabled={isUpdatingRole}
            >
              Otkaži
            </Button>
            <Button 
              onClick={handleUpdateRole} 
              loading={isUpdatingRole}
              disabled={isUpdatingRole}
            >
              {isUpdatingRole ? 'Ažuriranje...' : 'Sačuvaj promene'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Važna napomena
                </h4>
                <p className="text-sm text-blue-700">
                  Administratori imaju potpun pristup svim funkcijama aplikacije, uključujući upravljanje korisnicima. 
                  Korisnici imaju pristup samo svojim podacima i osnovnim funkcijama.
                </p>
              </div>
            </div>
          </div>
          
          <Select
            label="Uloga"
            options={roleOptions}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={isUpdatingRole}
          />
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Beleške (opciono)
            </label>
            <textarea
              id="notes"
              rows={3}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Dodajte beleške o ovoj promeni uloge..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isUpdatingRole}
            />
          </div>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Brisanje korisnika"
        footer={
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeletingUser}
            >
              Otkaži
            </Button>
            <Button 
              onClick={handleDeleteUser} 
              loading={isDeletingUser}
              disabled={isDeletingUser}
              variant="destructive"
            >
              {isDeletingUser ? 'Brisanje...' : 'Obriši korisnika'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <UserX className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Upozorenje - Nepovratna akcija
                </h4>
                <p className="text-sm text-red-700">
                  Ova akcija će trajno obrisati korisnika i sve povezane podatke (klijente, termine, fakture, usluge). 
                  Ova akcija se ne može poništiti!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Korisnik koji će biti obrisan:</h4>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-red-600">
                  {selectedUserEmail[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{selectedUserEmail}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Šta će biti obrisano:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Korisnički nalog i profil</li>
              <li>• Svi klijenti korisnika</li>
              <li>• Sve usluge korisnika</li>
              <li>• Svi termini korisnika</li>
              <li>• Sve fakture korisnika</li>
              <li>• Sve uloge i dozvole</li>
            </ul>
          </div>
          
          <div>
            <label htmlFor="deleteNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Razlog brisanja (opciono)
            </label>
            <textarea
              id="deleteNotes"
              rows={3}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Unesite razlog za brisanje korisnika..."
              value={deleteNotes}
              onChange={(e) => setDeleteNotes(e.target.value)}
              disabled={isDeletingUser}
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-800">
              <span className="font-medium">Potvrda:</span> Da biste nastavili sa brisanjem, kliknite na dugme "Obriši korisnika". 
              Ova akcija je nepovratna i svi podaci će biti trajno uklonjeni.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;