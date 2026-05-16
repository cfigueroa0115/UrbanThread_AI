'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { LoginAdminSchema } from '@shared/schemas';
import { trackFormSubmit, trackLogin } from '@/lib/analytics';
import { parseZodErrors, type FieldErrors } from '@/lib/form-validation';

export default function AdminLoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mode = useAuthStore((s) => s.mode);
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (isAuthenticated && mode === 'admin') {
      router.replace('/admin');
    }
  }, [isAuthenticated, mode, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = LoginAdminSchema.safeParse({ email, password });
    if (!result.success) {
      setFieldErrors(parseZodErrors(result.error));
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          trackFormSubmit('admin-login', true);
          trackLogin('admin', true);
          router.push('/admin');
        },
        onError: () => {
          trackFormSubmit('admin-login', false);
          trackLogin('admin', false);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(10,22,40,0.03), rgba(255,255,255,0.9), rgba(0,212,170,0.03))',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700' viewBox='0 0 700 700'%3E%3Ccircle cx='50' cy='50' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='200' cy='30' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='350' cy='70' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='500' cy='40' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='650' cy='60' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='120' cy='180' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='280' cy='160' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='430' cy='190' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='580' cy='170' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Cline x1='50' y1='50' x2='200' y2='30' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='200' y1='30' x2='350' y2='70' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='350' y1='70' x2='500' y2='40' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='500' y1='40' x2='650' y2='60' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='50' y1='50' x2='120' y2='180' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='200' y1='30' x2='280' y2='160' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='350' y1='70' x2='430' y2='190' stroke='%23cfd8dc' stroke-width='1' opacity='0.5'/%3E%3Cline x1='120' y1='180' x2='280' y2='160' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='280' y1='160' x2='430' y2='190' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='430' y1='190' x2='580' y2='170' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3C/svg%3E")`,
        backgroundSize: '700px 700px',
      }}
    >
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="UrbanThread AI" className="h-24 w-auto" />
          </div>
          <h1 className="text-h3 font-bold text-ut-text">Panel de Administración</h1>
          <p className="text-body text-ut-text-muted mt-1">
            Ingrese sus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={setEmail}
            error={fieldErrors['email']}
            required
            placeholder="admin@urbanthread.co"
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            error={fieldErrors['password']}
            required
            placeholder="••••••••"
          />

          {login.isError && (
            <p className="text-small text-ut-danger text-center" role="alert">
              {login.error instanceof Error
                ? login.error.message
                : 'Credenciales inválidas. Intente de nuevo.'}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={login.isPending}
            className="w-full"
          >
            Iniciar sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-small text-ut-text-muted hover:text-ut-accent transition-colors"
          >
            Volver al sitio principal
          </a>
        </div>
      </Card>
    </div>
  );
}
