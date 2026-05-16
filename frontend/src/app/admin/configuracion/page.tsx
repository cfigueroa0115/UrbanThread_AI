'use client';

import React, { useState } from 'react';
import { Settings, Save, Globe, Bell, Shield, Palette } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { apiClient } from '@/lib/api-client';
import { useMutation } from '@tanstack/react-query';

export default function ConfiguracionPage() {
  // General settings
  const [siteName, setSiteName] = useState('UrbanThread AI');
  const [siteUrl, setSiteUrl] = useState('https://urbanthread.co');
  const [supportEmail, setSupportEmail] = useState('soporte@urbanthread.co');
  const [supportPhone, setSupportPhone] = useState('+57 300 509 1114');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  // Security settings
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('10');
  const [otpExpiration, setOtpExpiration] = useState('5');

  const saveConfig = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiClient.put('/settings', data),
  });

  const handleSaveGeneral = () => {
    saveConfig.mutate({ siteName, siteUrl, supportEmail, supportPhone });
  };

  const handleSaveNotifications = () => {
    saveConfig.mutate({ emailNotifications, smsNotifications, whatsappNotifications });
  };

  const handleSaveSecurity = () => {
    saveConfig.mutate({
      sessionTimeout: Number(sessionTimeout),
      maxLoginAttempts: Number(maxLoginAttempts),
      otpExpiration: Number(otpExpiration),
    });
  };

  const tabItems = [
    {
      key: 'general',
      label: 'General',
      content: (
        <div className="space-y-5 max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-ut-accent" />
            <h2 className="text-h5 font-semibold text-ut-text">Configuración general</h2>
          </div>
          <Input label="Nombre del sitio" value={siteName} onChange={setSiteName} />
          <Input label="URL del sitio" value={siteUrl} onChange={setSiteUrl} />
          <Input label="Email de soporte" type="email" value={supportEmail} onChange={setSupportEmail} />
          <Input label="Teléfono de soporte" type="tel" value={supportPhone} onChange={setSupportPhone} />
          <Button onClick={handleSaveGeneral} loading={saveConfig.isPending} icon={<Save className="h-4 w-4" />}>
            Guardar cambios
          </Button>
          {saveConfig.isSuccess && <p className="text-small text-ut-success">Configuración guardada.</p>}
        </div>
      ),
    },
    {
      key: 'notifications',
      label: 'Notificaciones',
      content: (
        <div className="space-y-5 max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-ut-accent" />
            <h2 className="text-h5 font-semibold text-ut-text">Canales de notificación</h2>
          </div>
          <label className="flex items-center gap-3 text-body text-ut-text cursor-pointer">
            <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="rounded border-ut-surface-dark w-5 h-5" />
            Notificaciones por email
          </label>
          <label className="flex items-center gap-3 text-body text-ut-text cursor-pointer">
            <input type="checkbox" checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} className="rounded border-ut-surface-dark w-5 h-5" />
            Notificaciones por SMS
          </label>
          <label className="flex items-center gap-3 text-body text-ut-text cursor-pointer">
            <input type="checkbox" checked={whatsappNotifications} onChange={(e) => setWhatsappNotifications(e.target.checked)} className="rounded border-ut-surface-dark w-5 h-5" />
            Notificaciones por WhatsApp
          </label>
          <Button onClick={handleSaveNotifications} loading={saveConfig.isPending} icon={<Save className="h-4 w-4" />}>
            Guardar cambios
          </Button>
        </div>
      ),
    },
    {
      key: 'security',
      label: 'Seguridad',
      content: (
        <div className="space-y-5 max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-ut-accent" />
            <h2 className="text-h5 font-semibold text-ut-text">Configuración de seguridad</h2>
          </div>
          <Input label="Tiempo de sesión (minutos)" type="number" value={sessionTimeout} onChange={setSessionTimeout} />
          <Input label="Máximo intentos de login" type="number" value={maxLoginAttempts} onChange={setMaxLoginAttempts} />
          <Input label="Expiración OTP (minutos)" type="number" value={otpExpiration} onChange={setOtpExpiration} />
          <Button onClick={handleSaveSecurity} loading={saveConfig.isPending} icon={<Save className="h-4 w-4" />}>
            Guardar cambios
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
          <Settings className="h-6 w-6 text-ut-accent" />
        </div>
        <div>
          <h1 className="text-h3 font-bold text-ut-text">Configuración</h1>
          <p className="text-small text-ut-text-muted">Configuración general de la plataforma</p>
        </div>
      </div>

      <Card>
        <Tabs items={tabItems} defaultTab="general" />
      </Card>
    </div>
  );
}
