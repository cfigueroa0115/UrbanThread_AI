'use client';

import React from 'react';
import { Bell, CheckCheck, Mail, MailOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useNotificationStore } from '@/stores/notification.store';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  type Notification,
} from '@/hooks/useNotifications';

const typeVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  order_status: 'info',
  request_status: 'warning',
  document: 'default',
  system: 'danger',
  promotion: 'success',
};

const typeLabel: Record<string, string> = {
  order_status: 'Pedido',
  request_status: 'Solicitud',
  document: 'Documento',
  system: 'Sistema',
  promotion: 'Promoción',
};

export default function NotificacionesPage() {
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const { data: notifRes, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = (notifRes?.data ?? []) as Notification[];

  const handleMarkRead = (id: string) => {
    markAsRead.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] shadow-lg">
            <Bell className="h-6 w-6 text-[#C4956A]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-ut-danger text-white text-[11px] font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-h3 font-bold text-ut-text">Notificaciones</h1>
            <p className="text-small text-ut-text-muted">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            loading={markAllAsRead.isPending}
            icon={<CheckCheck className="h-4 w-4" />}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : notifications.length === 0 ? (
        <Card className="text-center py-12">
          <Bell className="h-12 w-12 text-ut-text-muted mx-auto mb-3" />
          <p className="text-body text-ut-text-muted">No tiene notificaciones.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              padding="sm"
              className={`transition-colors ${!notif.read ? 'border-l-4 border-l-ut-accent bg-ut-accent/5' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {notif.read ? (
                    <MailOpen className="h-5 w-5 text-ut-text-muted" />
                  ) : (
                    <Mail className="h-5 w-5 text-ut-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-body ${notif.read ? 'text-ut-text' : 'font-semibold text-ut-text'}`}>
                      {notif.title}
                    </h3>
                    <Badge variant={typeVariant[notif.type] ?? 'default'}>
                      {typeLabel[notif.type] ?? notif.type}
                    </Badge>
                  </div>
                  <p className="text-small text-ut-text-muted">{notif.message}</p>
                  <p className="text-small text-ut-text-muted mt-1">
                    {new Date(notif.createdAt).toLocaleString('es-CO')}
                  </p>
                </div>
                {!notif.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkRead(notif.id)}
                    loading={markAsRead.isPending}
                  >
                    Marcar leída
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
