'use client';

import React, { useState } from 'react';
import { Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { apiClient } from '@/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateUserSchema, UpdateUserSchema } from '@shared/schemas';
import { validateForm, type FieldErrors } from '@/lib/form-validation';
import { trackFormSubmit } from '@/lib/analytics';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleId: string;
  isActive: boolean;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
}

export default function UsuariosPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [formErrors, setFormErrors] = useState<FieldErrors>({});

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get<User[]>('/users'),
  });

  const { data: rolesRes } = useQuery({
    queryKey: ['roles'],
    queryFn: () => apiClient.get<Role[]>('/roles'),
  });

  const users = (usersRes?.data ?? []) as User[];
  const roles = (rolesRes?.data ?? []) as Role[];

  const createUser = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiClient.post('/users', data),
    onSuccess: () => { trackFormSubmit('create-user', true); queryClient.invalidateQueries({ queryKey: ['admin-users'] }); closeModal(); },
    onError: () => { trackFormSubmit('create-user', false); },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => apiClient.put(`/users/${id}`, data),
    onSuccess: () => { trackFormSubmit('update-user', true); queryClient.invalidateQueries({ queryKey: ['admin-users'] }); closeModal(); },
    onError: () => { trackFormSubmit('update-user', false); },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/users/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); setDeleteConfirm(null); },
  });

  const openCreate = () => {
    setEditingUser(null);
    setEmail(''); setPassword(''); setFirstName(''); setLastName(''); setRoleId(''); setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setEmail(user.email); setPassword(''); setFirstName(user.firstName); setLastName(user.lastName); setRoleId(user.roleId); setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (editingUser) {
      const data: Record<string, unknown> = { email, firstName, lastName, roleId };
      if (password) data.password = password;
      const validation = validateForm(UpdateUserSchema, data);
      if (!validation.success) {
        setFormErrors(validation.errors);
        return;
      }
      updateUser.mutate({ id: editingUser.id, data });
    } else {
      const data = { email, password, firstName, lastName, roleId };
      const validation = validateForm(CreateUserSchema, data);
      if (!validation.success) {
        setFormErrors(validation.errors);
        return;
      }
      createUser.mutate(data);
    }
  };

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));

  const columns: ColumnDef<User & Record<string, unknown>>[] = [
    { key: 'firstName', header: 'Nombre', render: (row) => `${row.firstName} ${row.lastName}` },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Rol', render: (row) => <Badge variant="info">{String(row.role)}</Badge> },
    {
      key: 'isActive', header: 'Estado',
      render: (row) => <Badge variant={row.isActive ? 'success' : 'danger'}>{row.isActive ? 'Activo' : 'Inactivo'}</Badge>,
    },
    {
      key: 'createdAt', header: 'Creado',
      render: (row) => new Date(row.createdAt as string).toLocaleDateString('es-CO'),
    },
    {
      key: 'actions', header: 'Acciones', sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon={<Pencil className="h-4 w-4" />} onClick={(e) => { e.stopPropagation(); openEdit(row as unknown as User); }}>
            Editar
          </Button>
          <Button variant="ghost" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={(e) => { e.stopPropagation(); setDeleteConfirm(row.id as string); }}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
            <Users className="h-6 w-6 text-ut-accent" />
          </div>
          <div>
            <h1 className="text-h3 font-bold text-ut-text">Usuarios</h1>
            <p className="text-small text-ut-text-muted">Gestión de usuarios del sistema</p>
          </div>
        </div>
        <Button onClick={openCreate} icon={<Plus className="h-4 w-4" />}>Crear usuario</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={users as (User & Record<string, unknown>)[]} loading={isLoading} pageSize={10} />
      </Card>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingUser ? 'Editar usuario' : 'Crear usuario'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombre" value={firstName} onChange={setFirstName} required error={formErrors['firstName']} />
            <Input label="Apellido" value={lastName} onChange={setLastName} required error={formErrors['lastName']} />
          </div>
          <Input label="Email" type="email" value={email} onChange={setEmail} required error={formErrors['email']} />
          <Input label={editingUser ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'} type="password" value={password} onChange={setPassword} required={!editingUser} error={formErrors['password']} />
          <Select label="Rol" options={roleOptions} value={roleId} onChange={setRoleId} required error={formErrors['roleId']} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" loading={createUser.isPending || updateUser.isPending}>
              {editingUser ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar eliminación" size="sm">
        <p className="text-body text-ut-text mb-4">¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="danger" loading={deleteUser.isPending} onClick={() => deleteConfirm && deleteUser.mutate(deleteConfirm)}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
