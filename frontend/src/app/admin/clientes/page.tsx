'use client';

import React, { useState } from 'react';
import { UserSearch, ArrowLeft, MapPin, Mail, Phone, ShoppingBag, ClipboardList, FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/Spinner';
import { useClients, useClient, type Client, type ClientDetail } from '@/hooks/useClients';

export default function ClientesAdminPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchDoc, setSearchDoc] = useState('');

  const { data: clientsRes, isLoading } = useClients({ search: searchDoc || undefined });
  const { data: detailRes, isLoading: detailLoading } = useClient(selectedId ?? '');

  const clients = (clientsRes?.data ?? []) as Client[];
  const detail = detailRes?.data as ClientDetail | undefined;

  const columns: ColumnDef<Client & Record<string, unknown>>[] = [
    { key: 'firstName', header: 'Nombre', render: (row) => `${row.firstName} ${row.lastName}` },
    { key: 'documentType', header: 'Tipo Doc.' },
    { key: 'documentNumber', header: 'N° Documento' },
    { key: 'email', header: 'Email' },
    {
      key: 'createdAt', header: 'Registrado',
      render: (row) => new Date(row.createdAt as string).toLocaleDateString('es-CO'),
    },
  ];

  if (selectedId) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedId(null)}
          className="inline-flex items-center gap-1.5 text-small text-ut-text-muted hover:text-ut-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a clientes
        </button>

        {detailLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : detail ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-h3 font-bold text-ut-text">{detail.firstName} {detail.lastName}</h1>
              <p className="text-small text-ut-text-muted">{detail.documentType} {detail.documentNumber}</p>
            </div>

            <Card>
              <Tabs
                items={[
                  {
                    key: 'info',
                    label: 'Información',
                    content: (
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body">
                        <div><dt className="text-small text-ut-text-muted">Email</dt><dd className="font-medium">{detail.email || '—'}</dd></div>
                        <div><dt className="text-small text-ut-text-muted">Teléfono</dt><dd className="font-medium">{detail.phone || '—'}</dd></div>
                        <div><dt className="text-small text-ut-text-muted">Creado</dt><dd className="font-medium">{new Date(detail.createdAt).toLocaleString('es-CO')}</dd></div>
                        <div><dt className="text-small text-ut-text-muted">Actualizado</dt><dd className="font-medium">{new Date(detail.updatedAt).toLocaleString('es-CO')}</dd></div>
                      </dl>
                    ),
                  },
                  {
                    key: 'addresses',
                    label: 'Direcciones',
                    content: (
                      <div className="space-y-3">
                        {(detail.addresses as Array<Record<string, unknown>>).length === 0 ? (
                          <p className="text-body text-ut-text-muted">Sin direcciones registradas.</p>
                        ) : (
                          (detail.addresses as Array<Record<string, unknown>>).map((addr, i) => (
                            <Card key={i} padding="sm">
                              <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-ut-accent flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-body font-medium">{String(addr.street ?? addr.address ?? 'Dirección')}</p>
                                  <p className="text-small text-ut-text-muted">{String(addr.city ?? '')} {String(addr.state ?? '')}</p>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'emails',
                    label: 'Correos',
                    content: (
                      <div className="space-y-2">
                        {(detail.emails as Array<Record<string, unknown>>).length === 0 ? (
                          <p className="text-body text-ut-text-muted">Sin correos adicionales.</p>
                        ) : (
                          (detail.emails as Array<Record<string, unknown>>).map((em, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-ut-accent" />
                              <span className="text-body">{String(em.email ?? '')}</span>
                              {!!em.isPrimary && <Badge variant="success">Principal</Badge>}
                            </div>
                          ))
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'phones',
                    label: 'Teléfonos',
                    content: (
                      <div className="space-y-2">
                        {(detail.phones as Array<Record<string, unknown>>).length === 0 ? (
                          <p className="text-body text-ut-text-muted">Sin teléfonos adicionales.</p>
                        ) : (
                          (detail.phones as Array<Record<string, unknown>>).map((ph, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-ut-accent" />
                              <span className="text-body">{String(ph.number ?? ph.phone ?? '')}</span>
                              {!!ph.isPrimary && <Badge variant="success">Principal</Badge>}
                            </div>
                          ))
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'orders',
                    label: 'Pedidos',
                    content: (
                      <div className="space-y-2">
                        {(detail.orders as Array<Record<string, unknown>>).length === 0 ? (
                          <p className="text-body text-ut-text-muted">Sin pedidos.</p>
                        ) : (
                          (detail.orders as Array<Record<string, unknown>>).map((order, i) => (
                            <Card key={i} padding="sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ShoppingBag className="h-4 w-4 text-ut-accent" />
                                  <span className="font-mono text-small">{String(order.id ?? '').slice(0, 8)}...</span>
                                </div>
                                <Badge variant="info">{String(order.status ?? '')}</Badge>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'requests',
                    label: 'Solicitudes',
                    content: (
                      <div className="space-y-2">
                        {(detail.requests as Array<Record<string, unknown>>).length === 0 ? (
                          <p className="text-body text-ut-text-muted">Sin solicitudes.</p>
                        ) : (
                          (detail.requests as Array<Record<string, unknown>>).map((req, i) => (
                            <Card key={i} padding="sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ClipboardList className="h-4 w-4 text-ut-accent" />
                                  <span className="font-mono text-small">{String(req.radicationNumber ?? '')}</span>
                                </div>
                                <Badge variant="info">{String(req.status ?? '')}</Badge>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'documents',
                    label: 'Documentos',
                    content: (
                      <div className="space-y-2">
                        {(detail.documents as Array<Record<string, unknown>>).length === 0 ? (
                          <p className="text-body text-ut-text-muted">Sin documentos.</p>
                        ) : (
                          (detail.documents as Array<Record<string, unknown>>).map((doc, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-ut-accent" />
                              <span className="text-body">{String(doc.fileName ?? 'Documento')}</span>
                              <Badge variant="default">{String(doc.documentType ?? '')}</Badge>
                            </div>
                          ))
                        )}
                      </div>
                    ),
                  },
                ]}
                defaultTab="info"
              />
            </Card>
          </div>
        ) : (
          <p className="text-body text-ut-text-muted">Cliente no encontrado.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
          <UserSearch className="h-6 w-6 text-ut-accent" />
        </div>
        <div>
          <h1 className="text-h3 font-bold text-ut-text">Clientes</h1>
          <p className="text-small text-ut-text-muted">Gestión y búsqueda de clientes</p>
        </div>
      </div>

      <Card>
        <div className="mb-4 max-w-sm">
          <Input
            label="Buscar por documento"
            value={searchDoc}
            onChange={setSearchDoc}
            placeholder="Número de documento..."
          />
        </div>
        <DataTable
          columns={columns}
          data={clients as (Client & Record<string, unknown>)[]}
          loading={isLoading}
          onRowClick={(row) => setSelectedId(row.id as string)}
          pageSize={10}
        />
      </Card>
    </div>
  );
}
