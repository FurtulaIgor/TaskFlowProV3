import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { signIn, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signIn(email, password);
      console.log('Login result:', user); // Debug log
      if (user) {
        toast.success('Uspešno ste se prijavili');
        // Invalidate the session cache so ProtectedRoute sees the updated state
        queryClient.invalidateQueries({ queryKey: ['session'] });
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          navigate('/');
        }, 100);
      } else {
        toast.error('Neispravni podaci za prijavu');
      }
    } catch (error: any) {
      console.error('Login error:', error); // Debug log
      toast.error(error.message || 'Došlo je do greške prilikom prijave');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <CardHeader>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Prijavite se na svoj nalog
          </h2>
        </CardHeader>
        <CardContent>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email adresa"
                  className="rounded-t-md"
                />
              </div>
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Lozinka"
                  className="rounded-b-md"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                Prijavi se
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}