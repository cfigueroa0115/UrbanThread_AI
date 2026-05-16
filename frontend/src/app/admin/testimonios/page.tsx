'use client';

import React, { useState } from 'react';
import { Star, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { DataTable, type ColumnDef } from '@/components/ui/DataTable';
import { apiClient } from '@/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTestimonialSchema, UpdateTestimonialSchema } from '@shared/schemas';
import { validateForm, type FieldErrors } from '@/lib/form-validation';
import { trackFormSubmit } from '@/lib/analytics';

interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  photoUrl?: string;
  rating: number;
  comment: string;
  caseStudy?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function TestimoniosAdminPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [caseStudy, setCaseStudy] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldErrors>({});

  const { data: testimonialsRes, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => apiClient.get<Testimonial[]>('/testimonials'),
  });

  const testimonials = (testimonialsRes?.data ?? []) as Testimonial[];

  const createTestimonial = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiClient.post('/testimonials', data),
    onSuccess: () => { trackFormSubmit('create-testimonial', true); queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }); closeModal(); },
    onError: () => { trackFormSubmit('create-testimonial', false); },
  });

  const updateTestimonial = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => apiClient.put(`/testimonials/${id}`, data),
    onSuccess: () => { trackFormSubmit('update-testimonial', true); queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }); closeModal(); },
    onError: () => { trackFormSubmit('update-testimonial', false); },
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/testimonials/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }); setDeleteConfirm(null); },
  });

  const openCreate = () => {
    setEditing(null);
    setClientName(''); setClientRole(''); setPhotoUrl(''); setRating('5'); setComment(''); setCaseStudy(''); setIsPublished(true); setIsFeatured(false); setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setClientName(t.clientName); setClientRole(t.clientRole ?? ''); setPhotoUrl(t.photoUrl ?? ''); setRating(String(t.rating)); setComment(t.comment); setCaseStudy(t.caseStudy ?? ''); setIsPublished(t.isPublished); setIsFeatured(t.isFeatured); setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setFormErrors({}); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    const data = {
      clientName, clientRole: clientRole || null, photoUrl: photoUrl || null,
      rating: Number(rating), comment, caseStudy: caseStudy || null, isPublished, isFeatured,
    };

    const schema = editing ? UpdateTestimonialSchema : CreateTestimonialSchema;
    const validation = validateForm(schema, data);
    if (!validation.success) {
      setFormErrors(validation.errors);
      return;
    }

    if (editing) {
      updateTestimonial.mutate({ id: editing.id, data });
    } else {
      createTestimonial.mutate(data);
    }
  };

  const renderStars = (n: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < n ? 'text-ut-gold fill-ut-gold' : 'text-ut-surface-dark'}`} />
      ))}
    </div>
  );

  const columns: ColumnDef<Testimonial & Record<string, unknown>>[] = [
    { key: 'clientName', header: 'Cliente' },
    { key: 'rating', header: 'Valoración', render: (row) => renderStars(row.rating as number) },
    { key: 'comment', header: 'Comentario', render: (row) => <span className="line-clamp-2 text-small">{String(row.comment).slice(0, 80)}...</span> },
    {
      key: 'isPublished', header: 'Estado',
      render: (row) => (
        <div className="flex gap-1">
          <Badge variant={row.isPublished ? 'success' : 'default'}>{row.isPublished ? 'Publicado' : 'Borrador'}</Badge>
          {row.isFeatured && <Badge variant="warning">Destacado</Badge>}
        </div>
      ),
    },
    { key: 'createdAt', header: 'Fecha', render: (row) => new Date(row.createdAt as string).toLocaleDateString('es-CO') },
    {
      key: 'actions', header: 'Acciones', sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon={<Pencil className="h-4 w-4" />} onClick={(e) => { e.stopPropagation(); openEdit(row as unknown as Testimonial); }}>Editar</Button>
          <Button variant="ghost" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={(e) => { e.stopPropagation(); setDeleteConfirm(row.id as string); }}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ut-accent/10">
            <Star className="h-6 w-6 text-ut-accent" />
          </div>
          <div>
            <h1 className="text-h3 font-bold text-ut-text">Testimonios</h1>
            <p className="text-small text-ut-text-muted">Gestión de testimonios y experiencias</p>
          </div>
        </div>
        <Button onClick={openCreate} icon={<Plus className="h-4 w-4" />}>Crear testimonio</Button>
      </div>

      <Card>
        <DataTable columns={columns} data={testimonials as (Testimonial & Record<string, unknown>)[]} loading={isLoading} pageSize={10} />
      </Card>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Editar testimonio' : 'Crear testimonio'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombre del cliente" value={clientName} onChange={setClientName} required error={formErrors['clientName']} />
            <Input label="Rol/Cargo" value={clientRole} onChange={setClientRole} error={formErrors['clientRole']} />
          </div>
          <Input label="URL de foto" value={photoUrl} onChange={setPhotoUrl} placeholder="https://..." error={formErrors['photoUrl']} />
          <Input label="Valoración (1-5)" type="number" value={rating} onChange={setRating} required error={formErrors['rating']} />
          <Textarea label="Comentario" value={comment} onChange={setComment} required rows={3} error={formErrors['comment']} />
          <Textarea label="Caso de éxito (opcional)" value={caseStudy} onChange={setCaseStudy} rows={3} error={formErrors['caseStudy']} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-small text-ut-text cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded border-ut-surface-dark" />
              Publicado
            </label>
            <label className="flex items-center gap-2 text-small text-ut-text cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-ut-surface-dark" />
              Destacado
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" loading={createTestimonial.isPending || updateTestimonial.isPending}>
              {editing ? 'Guardar cambios' : 'Crear testimonio'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar eliminación" size="sm">
        <p className="text-body text-ut-text mb-4">¿Está seguro de que desea eliminar este testimonio?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="danger" loading={deleteTestimonial.isPending} onClick={() => deleteConfirm && deleteTestimonial.mutate(deleteConfirm)}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
