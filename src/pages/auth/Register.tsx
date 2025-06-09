import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signUp, user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  // Redirect is now handled by ProtectedRoute, no need for manual redirect
  
  const validateForm = () => {
    if (password !== confirmPassword) {
      setPasswordError('Lozinke se ne podudaraju');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Lozinka mora imati najmanje 6 karaktera');
      return false;
    }
    
    setPasswordError('');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const user = await signUp(email, password);
      if (user) {
        toast.success('Uspešno ste se registrovali');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Došlo je do greške prilikom registracije');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <CardHeader>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Kreirajte svoj nalog
          </h2>
        </CardHeader>
        <CardContent>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 rounded-t-md"
                    placeholder="Email adresa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="pl-10"
                    placeholder="Lozinka"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="pl-10 rounded-b-md"
                    placeholder="Potvrdite lozinku"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {passwordError && (
              <div className="text-sm text-red-600">
                {passwordError}
              </div>
            )}

            <div>
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                Registrujte se
              </Button>
            </div>

            <div className="text-sm text-center">
              <p className="text-gray-600">
                Već imate nalog?{' '}
                <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Prijavite se
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;