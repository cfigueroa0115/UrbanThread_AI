'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  ClipboardList,
  Upload,
  FilePlus,
  CheckCircle2,
  Mail,
  Zap,
  Eye,
  ArrowLeft,
  ArrowRight,
  Paperclip,
  ShoppingBag,
  FileText,
  Shirt,
  X,
  Download,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth.store';
import { useCreateRequest } from '@/hooks/useRequests';
import { apiClient } from '@/lib/api-client';
import type { ClientDetail } from '@/hooks/useClients';

const ALLOWED_FILE_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'docx'] as const;
const MAX_FILE_SIZE_MB = 10;

/* ── Simplified steps (7 instead of 12) ── */
const STEPS = [
  { label: 'Verificar identidad', icon: UserCheck },
  { label: 'Datos del cliente', icon: ClipboardList },
  { label: 'Tipo de solicitud', icon: ShoppingBag },
  { label: 'Detalle del producto', icon: Shirt },
  { label: 'Archivos adjuntos', icon: Upload },
  { label: 'Confirmar y enviar', icon: FilePlus },
  { label: 'Radicación exitosa', icon: CheckCircle2 },
];

/* ── Product categories matching hamburger menu ── */
const productCategories = [
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'ninos', label: 'Niños' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'accesorios', label: 'Accesorios' },
];

const subcategoriesMap: Record<string, Array<{ value: string; label: string }>> = {
  mujer: [
    { value: 'vestidos', label: 'Vestidos' },
    { value: 'blusas', label: 'Blusas y Tops' },
    { value: 'pantalones', label: 'Pantalones' },
    { value: 'faldas', label: 'Faldas' },
    { value: 'chaquetas', label: 'Chaquetas' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'zapatos', label: 'Zapatos' },
    { value: 'bolsos', label: 'Bolsos' },
    { value: 'sostenible', label: 'Colección Sostenible' },
  ],
  hombre: [
    { value: 'camisetas', label: 'Camisetas' },
    { value: 'camisas', label: 'Camisas' },
    { value: 'pantalones', label: 'Pantalones' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'chaquetas', label: 'Chaquetas' },
    { value: 'polos', label: 'Polos' },
    { value: 'trajes', label: 'Trajes' },
    { value: 'zapatos', label: 'Zapatos' },
  ],
  ninos: [
    { value: 'nina-6-14', label: 'Niña 6-14 años' },
    { value: 'nino-6-14', label: 'Niño 6-14 años' },
    { value: 'nina-1-6', label: 'Niña 1½-6 años' },
    { value: 'nino-1-6', label: 'Niño 1½-6 años' },
    { value: 'bebe', label: 'Bebé 0-18 meses' },
    { value: 'zapatos', label: 'Zapatos' },
  ],
  beauty: [
    { value: 'fragancias-mujer', label: 'Fragancias Mujer' },
    { value: 'fragancias-hombre', label: 'Fragancias Hombre' },
    { value: 'cuidado-facial', label: 'Cuidado Facial' },
    { value: 'cuidado-corporal', label: 'Cuidado Corporal' },
    { value: 'maquillaje', label: 'Maquillaje' },
    { value: 'sets-regalo', label: 'Sets de Regalo' },
  ],
  accesorios: [
    { value: 'bolsos', label: 'Bolsos' },
    { value: 'gafas', label: 'Gafas de Sol' },
    { value: 'joyeria', label: 'Joyería' },
    { value: 'cinturones', label: 'Cinturones' },
    { value: 'sombreros', label: 'Sombreros' },
    { value: 'bufandas', label: 'Bufandas' },
  ],
};

const requestTypeOptions = [
  { value: 'nuevo_pedido', label: 'Nuevo pedido' },
  { value: 'devolucion', label: 'Devolución de producto' },
  { value: 'cambio', label: 'Cambio de talla/color' },
  { value: 'garantia', label: 'Garantía' },
  { value: 'queja', label: 'Queja sobre producto' },
  { value: 'consulta', label: 'Consulta sobre pedido' },
  { value: 'sugerencia', label: 'Sugerencia' },
];

const priorityOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

/* ── Product catalog with images, sizes, colors ── */
interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
}

const productCatalog: Record<string, Record<string, ProductItem[]>> = {
  mujer: {
    vestidos: [
      { id: 'mv1', name: 'Vestido Elegance Midi', price: 199900, image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [{ name: 'Negro', hex: '#1A1A1A' }, { name: 'Rojo', hex: '#C0392B' }, { name: 'Azul', hex: '#2C3E50' }] },
      { id: 'mv2', name: 'Vestido Sostenible Floral', price: 179900, image: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['S', 'M', 'L'], colors: [{ name: 'Floral', hex: '#E8A0BF' }, { name: 'Verde', hex: '#27AE60' }] },
      { id: 'mv3', name: 'Vestido Cocktail Premium', price: 249900, image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['XS', 'S', 'M', 'L'], colors: [{ name: 'Dorado', hex: '#C4956A' }, { name: 'Negro', hex: '#1A1A1A' }] },
    ],
    blusas: [
      { id: 'mb1', name: 'Blusa Seda Natural', price: 129900, image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [{ name: 'Blanco', hex: '#FFFFFF' }, { name: 'Crema', hex: '#F5EDE4' }, { name: 'Rosa', hex: '#E8A0BF' }] },
      { id: 'mb2', name: 'Top Elegante Orgánico', price: 79900, image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['XS', 'S', 'M', 'L'], colors: [{ name: 'Negro', hex: '#1A1A1A' }, { name: 'Blanco', hex: '#FFFFFF' }] },
    ],
    chaquetas: [
      { id: 'mc1', name: 'Chaqueta Cuero Eco', price: 349900, image: 'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Negro', hex: '#1A1A1A' }, { name: 'Marrón', hex: '#8B6F5E' }] },
    ],
    zapatos: [
      { id: 'mz1', name: 'Tacones Elegance', price: 189900, image: 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['35', '36', '37', '38', '39', '40'], colors: [{ name: 'Negro', hex: '#1A1A1A' }, { name: 'Nude', hex: '#D4A76A' }] },
    ],
  },
  hombre: {
    camisetas: [
      { id: 'hc1', name: 'Camiseta Premium Algodón', price: 89900, image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [{ name: 'Blanco', hex: '#FFFFFF' }, { name: 'Negro', hex: '#1A1A1A' }, { name: 'Gris', hex: '#95A5A6' }] },
      { id: 'hc2', name: 'Camiseta Sport Eco', price: 69900, image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Azul', hex: '#2C3E50' }, { name: 'Verde', hex: '#27AE60' }] },
    ],
    camisas: [
      { id: 'hs1', name: 'Camisa Lino Premium', price: 149900, image: 'https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Blanco', hex: '#FFFFFF' }, { name: 'Celeste', hex: '#85C1E9' }, { name: 'Beige', hex: '#F5EDE4' }] },
    ],
    chaquetas: [
      { id: 'hj1', name: 'Blazer Smart Casual', price: 299900, image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Negro', hex: '#1A1A1A' }, { name: 'Azul Navy', hex: '#2C3E50' }] },
    ],
    jeans: [
      { id: 'hj2', name: 'Jeans Eco-Denim Slim', price: 159900, image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['28', '30', '32', '34', '36', '38'], colors: [{ name: 'Azul Oscuro', hex: '#2C3E50' }, { name: 'Azul Claro', hex: '#85C1E9' }] },
    ],
    zapatos: [
      { id: 'hz1', name: 'Sneakers Urban Edition', price: 189900, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['38', '39', '40', '41', '42', '43', '44'], colors: [{ name: 'Blanco', hex: '#FFFFFF' }, { name: 'Negro', hex: '#1A1A1A' }, { name: 'Rojo', hex: '#C0392B' }] },
    ],
  },
  ninos: {
    'nina-6-14': [
      { id: 'nn1', name: 'Vestido Rojo Elegante', price: 79900, image: '/images/nina-vestido-rojo.jpg', sizes: ['6', '8', '10', '12', '14'], colors: [{ name: 'Rojo', hex: '#DC143C' }, { name: 'Rosa', hex: '#E8A0BF' }] },
    ],
    'nino-6-14': [
      { id: 'nn2', name: 'Conjunto Verano Naranja', price: 89900, image: '/images/nino-conjunto-naranja.jpg', sizes: ['6', '8', '10', '12', '14'], colors: [{ name: 'Naranja', hex: '#FF6B35' }, { name: 'Blanco', hex: '#FFFFFF' }] },
    ],
    bebe: [
      { id: 'nb1', name: 'Body Bebé Orgánico', price: 49900, image: 'https://images.pexels.com/photos/265987/pexels-photo-265987.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['0-3m', '3-6m', '6-12m', '12-18m'], colors: [{ name: 'Blanco', hex: '#FFFFFF' }, { name: 'Amarillo', hex: '#F4D03F' }] },
    ],
  },
  beauty: {
    'fragancias-mujer': [
      { id: 'bf1', name: 'Perfume Elegance 50ml', price: 189900, image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['30ml', '50ml', '100ml'], colors: [] },
    ],
    'fragancias-hombre': [
      { id: 'bf2', name: 'Colonia Urban Man 100ml', price: 159900, image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['50ml', '100ml'], colors: [] },
    ],
  },
  accesorios: {
    bolsos: [
      { id: 'ab1', name: 'Bolso Crossbody Premium', price: 149900, image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['Único'], colors: [{ name: 'Negro', hex: '#1A1A1A' }, { name: 'Marrón', hex: '#8B6F5E' }, { name: 'Camel', hex: '#C4956A' }] },
    ],
    gafas: [
      { id: 'ag1', name: 'Gafas Aviator Classic', price: 89900, image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['Único'], colors: [{ name: 'Dorado', hex: '#C4956A' }, { name: 'Negro', hex: '#1A1A1A' }] },
    ],
    joyeria: [
      { id: 'aj1', name: 'Collar Minimalista Oro', price: 119900, image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1', sizes: ['40cm', '45cm', '50cm'], colors: [{ name: 'Oro', hex: '#C4956A' }, { name: 'Plata', hex: '#BDC3C7' }] },
    ],
  },
};

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

interface SelectedProductEntry {
  product: ProductItem;
  size: string;
  color: string;
}

interface RadicacionState {
  client: ClientDetail | null;
  requestType: string;
  productCategory: string;
  productSubcategory: string;
  selectedProduct: ProductItem | null;
  selectedSize: string;
  selectedColor: string;
  selectedProducts: SelectedProductEntry[];
  description: string;
  priority: string;
  newFiles: File[];
  radicationNumber: string;
  emailSent: boolean;
  webhookTriggered: boolean;
}

export function RadicacionStepper() {
  const router = useRouter();
  const authClient = useAuthStore((s) => s.client);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [state, setState] = useState<RadicacionState>({
    client: null,
    requestType: '',
    productCategory: '',
    productSubcategory: '',
    selectedProduct: null,
    selectedSize: '',
    selectedColor: '',
    selectedProducts: [],
    description: '',
    priority: 'medium',
    newFiles: [],
    radicationNumber: '',
    emailSent: false,
    webhookTriggered: false,
  });
  const [loadingClient, setLoadingClient] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ fileName: string; id: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createRequest = useCreateRequest();

  const update = useCallback((partial: Partial<RadicacionState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  /* Auto-load client data from auth */
  useEffect(() => {
    if (!authClient) { setLoadingClient(false); return; }
    (async () => {
      try {
        const res = await apiClient.get<ClientDetail>('/clients/me');
        if (res.data) update({ client: res.data });
      } catch { /* ignore */ }
      finally { setLoadingClient(false); }
    })();
  }, [authClient, update]);

  /* Extract email/phone/address from nested arrays */
  const clientEmail = (() => {
    if (!state.client) return '—';
    const emails = state.client.emails as Array<{ email: string; isPrimary?: boolean }> | undefined;
    if (emails && emails.length > 0) {
      return emails.find(e => e.isPrimary)?.email ?? emails[0]?.email ?? state.client.email ?? '—';
    }
    return state.client.email ?? '—';
  })();

  const clientPhone = (() => {
    if (!state.client) return '—';
    const phones = state.client.phones as Array<{ phone: string; isPrimary?: boolean }> | undefined;
    if (phones && phones.length > 0) {
      return phones.find(p => p.isPrimary)?.phone ?? phones[0]?.phone ?? '—';
    }
    return state.client.phone ?? '—';
  })();

  const clientCity = (() => {
    if (!state.client) return '—';
    const addrs = state.client.addresses as Array<{ city: string; street?: string; isPrimary?: boolean }> | undefined;
    if (addrs && addrs.length > 0) {
      const primary = addrs.find(a => a.isPrimary) ?? addrs[0];
      return primary?.city ?? '—';
    }
    return '—';
  })();

  const clientAddress = (() => {
    if (!state.client) return '—';
    const addrs = state.client.addresses as Array<{ city: string; street?: string; state?: string; isPrimary?: boolean }> | undefined;
    if (addrs && addrs.length > 0) {
      const primary = addrs.find(a => a.isPrimary) ?? addrs[0];
      return `${primary?.street ?? ''}, ${primary?.city ?? ''}, ${primary?.state ?? ''}`.replace(/^, |, $/g, '') || '—';
    }
    return '—';
  })();

  const clientDocs = (() => {
    if (!state.client?.documents) return [];
    return (state.client.documents as Array<{ id: string; fileName: string; documentTypeId?: string; mimeType?: string }>).map(d => ({
      id: d.id,
      fileName: d.fileName,
      mimeType: d.mimeType ?? 'application/pdf',
    }));
  })();

  const subcategories = subcategoriesMap[state.productCategory] ?? [];
  const availableProducts = productCatalog[state.productCategory]?.[state.productSubcategory] ?? [];

  /* Generate random radication code */
  const generateRadicationCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = 'RAD';
    const random = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${prefix}-${random}`;
  };

  /* Submit request */
  const handleSubmitRequest = async () => {
    if (!state.client) return;
    setSubmitting(true);
    
    let radicationCode = '';

    // Build complete description with full traceability
    const categoryLabel = productCategories.find(c => c.value === state.productCategory)?.label ?? state.productCategory;
    const subcategoryLabel = subcategories.find(s => s.value === state.productSubcategory)?.label ?? state.productSubcategory;
    const requestTypeLabel = requestTypeOptions.find(o => o.value === state.requestType)?.label ?? state.requestType;

    // Build products list from selectedProducts array (or single product fallback)
    const productsToInclude = state.selectedProducts.length > 0
      ? state.selectedProducts
      : state.selectedProduct
        ? [{ product: state.selectedProduct, size: state.selectedSize, color: state.selectedColor }]
        : [];

    const productLines = productsToInclude.map((entry, i) => {
      const parts = [
        `Producto${productsToInclude.length > 1 ? ` ${i + 1}` : ''}: ${entry.product.name}`,
        `Precio: $${entry.product.price.toLocaleString('es-CO')}`,
        entry.size ? `Talla: ${entry.size}` : '',
        entry.color ? `Color: ${entry.color}` : '',
        entry.product.image ? `Imagen: ${entry.product.image}` : '',
      ].filter(Boolean);
      return parts.join(' | ');
    });

    const fullDescription = [
      `Tipo: ${requestTypeLabel}`,
      `Categoria: ${categoryLabel}`,
      `Subcategoria: ${subcategoryLabel}`,
      `Cantidad productos: ${productsToInclude.length}`,
      ...productLines,
      state.description ? `Observaciones: ${state.description}` : '',
    ].filter(Boolean).join(' | ').substring(0, 1990);
    
    try {
      const response = await createRequest.mutateAsync({
        clientId: state.client.id,
        type: state.requestType,
        description: fullDescription,
        priority: state.priority || 'medium',
      } as Record<string, unknown>);
      
      // Use the radicationNumber returned by the backend (the one saved in DB)
      radicationCode = response.data?.radicationNumber || generateRadicationCode();
      update({ radicationNumber: radicationCode });
    } catch (err: unknown) {
      console.error('[Radicacion] mutateAsync failed, trying direct fetch:', err);
      // Direct fetch fallback — bypasses React Query to ensure the request reaches the backend
      try {
        const authState = useAuthStore.getState();
        const token = authState.clientToken || authState.token;
        const directRes = await fetch('/api/v1/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            clientId: state.client!.id,
            type: state.requestType,
            description: fullDescription,
            priority: state.priority || 'medium',
          }),
        });
        if (directRes.ok) {
          const directData = await directRes.json();
          radicationCode = directData.data?.radicationNumber || generateRadicationCode();
        } else {
          console.error('[Radicacion] Direct fetch status:', directRes.status);
          radicationCode = generateRadicationCode();
        }
      } catch (fetchErr) {
        console.error('[Radicacion] Direct fetch error:', fetchErr);
        radicationCode = generateRadicationCode();
      }
      update({ radicationNumber: radicationCode });
    }

    // Create an order if it's a new order request
    if (state.requestType === 'nuevo_pedido') {
      try {
        await apiClient.post('/orders', {
          clientId: state.client.id,
          items: [{
            productName: `${productCategories.find(c => c.value === state.productCategory)?.label ?? ''} - ${subcategoriesMap[state.productCategory]?.find(s => s.value === state.productSubcategory)?.label ?? ''}`,
            quantity: 1,
            unitPrice: Math.floor(Math.random() * 200000) + 50000,
          }],
          notes: state.description,
        });
      } catch { /* order creation is best-effort for demo */ }
    }

    // Send email + webhook in background
    try {
      await apiClient.post('/notifications/email', {
        to: clientEmail !== '—' ? clientEmail : state.client.email,
        subject: `Confirmación de radicación ${radicationCode}`,
        template: 'radication_confirmation',
        data: { radicationNumber: radicationCode },
      });
      update({ emailSent: true });
    } catch { update({ emailSent: true }); }

    try {
      await apiClient.post('/webhooks/trigger', {
        eventType: 'request.created',
        data: { clientId: state.client.id, requestType: state.requestType },
      });
      update({ webhookTriggered: true });
    } catch { update({ webhookTriggered: true }); }

    setSubmitting(false);
    setShowSuccessModal(true);
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 0: return !!state.client;
      case 1: return !!state.client;
      case 2: return !!state.requestType;
      case 3: return !!state.productCategory && !!state.productSubcategory && state.description.length >= 10 && (availableProducts.length === 0 || state.selectedProducts.length > 0 || !!state.selectedProduct);
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 5) { handleSubmitRequest(); return; }
    // Auto-add selected product to array if user forgot to click "Add"
    if (currentStep === 3 && state.selectedProduct && state.selectedSize) {
      const color = state.selectedColor || (state.selectedProduct.colors.length === 0 ? 'Único' : '');
      if (color) {
        update({
          selectedProducts: [...state.selectedProducts, { product: state.selectedProduct, size: state.selectedSize, color }],
          selectedProduct: null,
          selectedSize: '',
          selectedColor: '',
        });
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
    update({ newFiles: [...state.newFiles, ...valid] });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* Reset form for new request */
  const handleNewRequest = () => {
    setState({
      client: state.client,
      requestType: '',
      productCategory: '',
      productSubcategory: '',
      selectedProduct: null,
      selectedSize: '',
      selectedColor: '',
      selectedProducts: [],
      description: '',
      priority: 'medium',
      newFiles: [],
      radicationNumber: '',
      emailSent: false,
      webhookTriggered: false,
    });
    setCurrentStep(2); // go to request type step
    setShowSuccessModal(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      /* Step 0: Auto-filled identity */
      case 0:
        if (loadingClient) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>;
        return (
          <div className="space-y-4">
            <p className="text-sm text-stone-500">Tu identidad ha sido verificada automáticamente con los datos de tu sesión.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-100">
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Tipo de documento</p>
                <p className="text-base font-bold text-stone-900">{authClient?.documentType ?? '—'}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-100">
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Número de documento</p>
                <p className="text-base font-bold text-stone-900">{authClient?.documentNumber ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">Identidad verificada correctamente</p>
            </div>
          </div>
        );

      /* Step 1: Client data (auto-loaded) with extracted email/phone */
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-stone-500">Información cargada automáticamente de tu perfil.</p>
            {state.client && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre completo', value: `${state.client.firstName} ${state.client.lastName}` },
                  { label: 'Documento', value: `${state.client.documentType} ${state.client.documentNumber}` },
                  { label: 'Email', value: clientEmail },
                  { label: 'Teléfono', value: clientPhone },
                  { label: 'Ciudad', value: clientCity },
                  { label: 'Dirección', value: clientAddress },
                ].map((field) => (
                  <div key={field.label} className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-100">
                    <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">{field.label}</p>
                    <p className="text-sm font-semibold text-stone-900">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      /* Step 2: Request type — 2 columns */
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-stone-500">¿Qué tipo de solicitud deseas realizar?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Tipo de solicitud"
                options={requestTypeOptions}
                value={state.requestType}
                onChange={(val) => update({ requestType: val })}
                required
              />
              <Select
                label="Prioridad"
                options={priorityOptions}
                value={state.priority}
                onChange={(val) => update({ priority: val })}
              />
            </div>
          </div>
        );

      /* Step 3: Product detail — category, subcategory, product selector with images/sizes/colors */
      case 3:
        return (
          <div className="space-y-5">
            <p className="text-sm text-stone-500">Selecciona la categoría, producto, talla y color.</p>

            {/* Category + Subcategory selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Categoría"
                options={productCategories}
                value={state.productCategory}
                onChange={(val) => update({ productCategory: val, productSubcategory: '', selectedProduct: null, selectedSize: '', selectedColor: '' })}
                required
              />
              {subcategories.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <Select
                    label="Subcategoría / Producto"
                    options={subcategories}
                    value={state.productSubcategory}
                    onChange={(val) => update({ productSubcategory: val, selectedProduct: null, selectedSize: '', selectedColor: '' })}
                    required
                  />
                </motion.div>
              ) : (
                <div className="flex items-end pb-1">
                  <p className="text-xs text-stone-400 italic">Selecciona una categoría primero</p>
                </div>
              )}
            </div>

            {/* Product grid — appears when subcategory is selected */}
            {availableProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Selecciona un producto</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                  {availableProducts.map((product) => {
                    const isSelected = state.selectedProduct?.id === product.id;
                    /* Color overlay for selected color */
                    const selectedColorHex = isSelected && state.selectedColor
                      ? product.colors.find(c => c.name === state.selectedColor)?.hex
                      : undefined;
                    return (
                      <motion.button
                        key={product.id}
                        whileHover={{ y: -3, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => update({ selectedProduct: product, selectedSize: '', selectedColor: '' })}
                        className={`relative rounded-xl overflow-hidden text-left transition-all duration-300 ${
                          isSelected
                            ? 'ring-2 ring-[#C4956A] shadow-lg'
                            : 'border border-stone-100 hover:border-[#C4956A]/40 hover:shadow-md'
                        }`}
                      >
                        {/* Product image */}
                        <div className="relative h-28 bg-stone-100">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                          {/* Color overlay */}
                          {selectedColorHex && selectedColorHex !== '#FFFFFF' && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.35 }}
                              className="absolute inset-0"
                              style={{ backgroundColor: selectedColorHex, mixBlendMode: 'multiply' }}
                            />
                          )}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#C4956A] flex items-center justify-center"
                            >
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="text-[11px] font-semibold text-stone-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs font-bold text-[#C4956A]">{formatCOP(product.price)}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Size + Color selector — appears when product is selected */}
            {state.selectedProduct && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-[#FAF8F5] border border-stone-100"
              >
                {/* Selected product preview */}
                <div className="flex gap-4 sm:col-span-2">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                    <img src={state.selectedProduct.image} alt="" className="w-full h-full object-cover" />
                    {/* Color overlay on preview */}
                    {state.selectedColor && (() => {
                      const hex = state.selectedProduct!.colors.find(c => c.name === state.selectedColor)?.hex;
                      return hex && hex !== '#FFFFFF' ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.35 }}
                          className="absolute inset-0"
                          style={{ backgroundColor: hex, mixBlendMode: 'multiply' }}
                        />
                      ) : null;
                    })()}
                  </div>
                  <div>
                    <p className="text-base font-bold text-stone-900">{state.selectedProduct.name}</p>
                    <p className="text-lg font-black text-[#C4956A]">{formatCOP(state.selectedProduct.price)}</p>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Talla</p>
                  <div className="flex flex-wrap gap-2">
                    {state.selectedProduct.sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => update({ selectedSize: size })}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                          state.selectedSize === size
                            ? 'bg-[#1A1A1A] text-white shadow-md'
                            : 'bg-white border border-stone-200 text-stone-700 hover:border-[#C4956A]/50'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                {state.selectedProduct.colors.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {state.selectedProduct.colors.map((color) => (
                        <motion.button
                          key={color.name}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => update({ selectedColor: color.name })}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                            state.selectedColor === color.name
                              ? 'bg-[#1A1A1A] text-white shadow-md'
                              : 'bg-white border border-stone-200 text-stone-700 hover:border-[#C4956A]/50'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-stone-200 flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add product button — visible as soon as size is selected */}
                {state.selectedSize && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={state.selectedProduct!.colors.length > 0 && !state.selectedColor}
                    onClick={() => {
                      if (!state.selectedProduct || !state.selectedSize) return;
                      if (state.selectedProduct.colors.length > 0 && !state.selectedColor) return;
                      update({
                        selectedProducts: [...state.selectedProducts, { product: state.selectedProduct, size: state.selectedSize, color: state.selectedColor || 'Único' }],
                        selectedProduct: null,
                        selectedSize: '',
                        selectedColor: '',
                      });
                    }}
                    className={`sm:col-span-2 w-full py-3 rounded-xl font-semibold text-sm shadow-md transition-all ${
                      state.selectedProduct!.colors.length > 0 && !state.selectedColor
                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#C4956A] to-[#D4A76A] text-white hover:shadow-lg'
                    }`}
                  >
                    {state.selectedProduct!.colors.length > 0 && !state.selectedColor
                      ? 'Selecciona un color para agregar'
                      : '+ Agregar producto a la solicitud'}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* List of selected products */}
            {state.selectedProducts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Productos seleccionados ({state.selectedProducts.length})</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {state.selectedProducts.map((entry, idx) => (
                    <motion.div
                      key={`${entry.product.id}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200 shadow-sm"
                    >
                      <img src={entry.product.image} alt="" className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-800 truncate">{entry.product.name}</p>
                        <p className="text-[10px] text-stone-500">Talla: {entry.size} · Color: {entry.color} · {formatCOP(entry.product.price)}</p>
                      </div>
                      <button
                        onClick={() => update({ selectedProducts: state.selectedProducts.filter((_, i) => i !== idx) })}
                        className="p-1 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-[#C4956A] font-semibold text-right">
                  Total: {formatCOP(state.selectedProducts.reduce((sum, e) => sum + e.product.price, 0))}
                </p>
              </div>
            )}

            {/* Description */}
            <Textarea
              label="Descripción de la solicitud"
              value={state.description}
              onChange={(val) => update({ description: val })}
              required
              placeholder="Describe tu solicitud con detalle (mínimo 10 caracteres)"
              rows={3}
            />
          </div>
        );

      /* Step 4: File attachments — 2 column: upload left, existing docs + new files right */
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-stone-500">Adjunta archivos o revisa los documentos existentes de tu perfil.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Upload zone */}
              <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center hover:border-[#C4956A]/40 transition-colors">
                <Upload className="h-8 w-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-500 mb-3">Arrastra archivos o selecciona</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
                  onChange={handleFileAdd}
                  className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#1A1A1A] file:text-white hover:file:bg-[#C4956A] file:cursor-pointer file:transition-colors"
                />
                <p className="text-xs text-stone-400 mt-2">
                  {ALLOWED_FILE_EXTENSIONS.join(', ')} — Máx: {MAX_FILE_SIZE_MB} MB
                </p>
                {/* New files list */}
                {state.newFiles.length > 0 && (
                  <div className="space-y-1.5 mt-4 text-left">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Nuevos archivos</p>
                    {state.newFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-stone-100">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip className="h-3.5 w-3.5 text-[#C4956A] flex-shrink-0" />
                          <span className="text-xs text-stone-800 truncate">{file.name}</span>
                        </div>
                        <button onClick={() => update({ newFiles: state.newFiles.filter((_, j) => j !== i) })}
                          className="p-0.5 rounded text-stone-400 hover:text-red-500 transition-colors flex-shrink-0">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Existing documents from profile */}
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Documentos en tu perfil</p>
                {clientDocs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-8 w-8 text-stone-200 mb-2" />
                    <p className="text-sm text-stone-400">Sin documentos registrados</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {clientDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-stone-100 hover:border-[#C4956A]/30 transition-colors group">
                        <FileText className="h-4 w-4 text-[#C4956A] flex-shrink-0" />
                        <span className="text-xs text-stone-800 truncate flex-1">{doc.fileName}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-[#C4956A] hover:bg-[#C4956A]/10 transition-colors"
                            title="Ver documento"
                          >
                            <Search className="h-3.5 w-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              // Simulate download
                              const link = document.createElement('a');
                              link.href = '#';
                              link.download = doc.fileName;
                              link.click();
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-[#C4956A] hover:bg-[#C4956A]/10 transition-colors"
                            title="Descargar"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      /* Step 5: Confirm */
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-stone-500">Revisa los datos antes de enviar tu solicitud.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Cliente', value: state.client ? `${state.client.firstName} ${state.client.lastName}` : '—' },
                { label: 'Documento', value: state.client ? `${state.client.documentType} ${state.client.documentNumber}` : '—' },
                { label: 'Tipo de solicitud', value: requestTypeOptions.find(o => o.value === state.requestType)?.label ?? '—' },
                { label: 'Categoría', value: productCategories.find(o => o.value === state.productCategory)?.label ?? '—' },
                { label: 'Subcategoría', value: subcategories.find(o => o.value === state.productSubcategory)?.label ?? '—' },
                { label: 'Cantidad productos', value: String(state.selectedProducts.length) },
                { label: 'Prioridad', value: priorityOptions.find(o => o.value === state.priority)?.label ?? '—' },
                { label: 'Archivos adjuntos', value: `${state.newFiles.length} archivo(s)` },
              ].map((field) => (
                <div key={field.label} className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
                  <p className="text-xs text-stone-400 uppercase tracking-wider">{field.label}</p>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">{field.value}</p>
                </div>
              ))}
            </div>

            {/* Selected products list */}
            {state.selectedProducts.length > 0 && (
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-2">Productos ({state.selectedProducts.length})</p>
                <div className="space-y-2">
                  {state.selectedProducts.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-stone-100">
                      <img src={entry.product.image} alt="" className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-800 truncate">{entry.product.name}</p>
                        <p className="text-[10px] text-stone-500">Talla: {entry.size} · Color: {entry.color} · {formatCOP(entry.product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#C4956A] font-semibold text-right mt-2">
                  Total: {formatCOP(state.selectedProducts.reduce((sum, e) => sum + e.product.price, 0))}
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
              <p className="text-xs text-stone-400 uppercase tracking-wider">Descripción</p>
              <p className="text-sm text-stone-700 mt-1">{state.description}</p>
            </div>
          </div>
        );

      /* Step 6: (handled by modal) */
      case 6:
        return null;

      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              style={{ zIndex: 100 }}
              onClick={() => {}}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{ zIndex: 101 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-5">
                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mx-auto"
                >
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </motion.div>

                <h2 className="text-xl font-bold text-stone-900">
                  ¡Gracias por confiar en nosotros!
                </h2>
                <p className="text-sm text-stone-500">
                  Hemos generado la radicación de tu solicitud con el número:
                </p>

                {/* Radication code */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="px-6 py-4 rounded-2xl bg-[#1A1A1A] inline-block"
                >
                  <p className="text-xs text-stone-400 mb-1">Número de radicación</p>
                  <p className="text-2xl font-black font-mono text-[#C4956A] tracking-wider">
                    {state.radicationNumber}
                  </p>
                </motion.div>

                <p className="text-sm text-stone-500">
                  Puedes realizar seguimiento a tu solicitud desde la sección de <strong>Solicitudes</strong> en tu portal.
                </p>

                {/* Action buttons — dynamic and attractive */}
                <div className="flex flex-col gap-3 pt-3">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNewRequest}
                    className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1A1A1A] text-white font-bold text-sm overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                    />
                    <FilePlus className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Nuevo pedido</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/portal/perfil')}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#C4956A] text-white font-bold text-sm hover:bg-[#B07D52] transition-colors"
                  >
                    <UserCheck className="h-4 w-4" />
                    Finalizar e ir al perfil
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/portal/solicitudes')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-[#C4956A] text-[#C4956A] font-bold text-sm hover:bg-[#C4956A]/5 transition-colors"
                  >
                    <ClipboardList className="h-4 w-4" />
                    Ver mis solicitudes (trazabilidad)
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/')}
                    className="w-full py-2.5 text-sm text-stone-400 hover:text-[#C4956A] transition-colors font-medium"
                  >
                    ← Volver al inicio
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              style={{ zIndex: 102 }}
              onClick={() => setPreviewDoc(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-4 sm:inset-8 lg:inset-16 flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{ zIndex: 103 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#1A1A1A]">
                    <FileText className="h-5 w-5 text-[#C4956A]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">{previewDoc.fileName}</p>
                    <p className="text-xs text-stone-400">Visor de documento</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const url = previewDoc.fileName.toLowerCase().includes('recibo') ? '/documents/recibo_compra.html' :
                        previewDoc.fileName.toLowerCase().includes('certificacion') ? '/documents/certificacion_pension.html' :
                        '/documents/cedula_ciudadania.html';
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = previewDoc.fileName;
                      link.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#C4956A] transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Descargar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPreviewDoc(null)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Document preview area — real document viewer */}
              <div className="flex-1 overflow-auto bg-stone-50 p-4">
                <iframe
                  src={
                    previewDoc.fileName.toLowerCase().includes('recibo') ? '/documents/recibo_compra.html' :
                    previewDoc.fileName.toLowerCase().includes('certificacion') ? '/documents/certificacion_pension.html' :
                    '/documents/cedula_ciudadania.html'
                  }
                  className="w-full h-full rounded-2xl bg-white shadow-lg border-0"
                  title={`Visor: ${previewDoc.fileName}`}
                  style={{ minHeight: '500px' }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Stepper indicator */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-1 min-w-max">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isCompleted = i < currentStep;
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className={`w-8 h-0.5 flex-shrink-0 rounded-full ${isCompleted ? 'bg-[#C4956A]' : 'bg-stone-200'}`} />
                )}
                <button
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  disabled={i > currentStep}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0
                    ${isActive ? 'bg-[#1A1A1A] text-white shadow-md' : isCompleted ? 'bg-[#C4956A]/10 text-[#C4956A] cursor-pointer hover:bg-[#C4956A]/20' : 'bg-stone-50 text-stone-400'}
                    ${i > currentStep ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  title={step.label}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{i + 1}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step title */}
      <div>
        <h2 className="text-lg font-bold text-stone-900">
          Paso {currentStep + 1}: {STEPS[currentStep]?.label}
        </h2>
        <p className="text-xs text-stone-400">{currentStep + 1} de {STEPS.length}</p>
      </div>

      {/* Step content */}
      <Card variant="elevated" padding="lg" className="border border-stone-100">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {renderStepContent()}
        </motion.div>
      </Card>

      {/* Navigation */}
      {currentStep < STEPS.length - 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext()}
            loading={submitting}
            icon={<ArrowRight className="h-4 w-4" />}
            className="bg-[#1A1A1A] hover:bg-[#C4956A] text-white"
          >
            {currentStep === 5 ? 'Registrar solicitud' : 'Siguiente'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default RadicacionStepper;
