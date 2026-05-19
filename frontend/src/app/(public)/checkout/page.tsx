'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Truck,
  ArrowLeft,
  CheckCircle,
  Edit3,
  ShieldCheck,
  Package,
  Copy,
  Home,
} from 'lucide-react';
import { useCartStore, type CartItem } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { apiClient } from '@/lib/api-client';

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

async function createRadicationOrder(items: CartItem[], paymentMethod: string, clientName: string): Promise<string> {
  try {
    const authState = useAuthStore.getState();
    const clientId = authState.client?.id;
    const token = authState.clientToken || authState.token;
    
    // Verificar si hay una radicación pendiente de la sección de radicación
    const pendingRadication = typeof window !== 'undefined' ? sessionStorage.getItem('pendingRadication') : null;
    
    if (pendingRadication) {
      // Actualizar estado de la radicación existente a "paid"
      sessionStorage.removeItem('pendingRadication');
      try {
        await fetch('/api/v1/requests/status', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ radicationNumber: pendingRadication, status: 'paid' }),
        });
        // Activar temporizador de estados
        triggerStatusProgression(pendingRadication, token);
      } catch { /* silenciar */ }
      return pendingRadication;
    }

    const productLines = items.map((item, i) => {
      return [`Producto${items.length > 1 ? ` ${i + 1}` : ''}: ${item.name}`, `Precio: ${item.price}`, item.size ? `Talla: ${item.size}` : '', item.color ? `Color: ${item.color}` : '', item.image ? `Imagen: ${item.image}` : ''].filter(Boolean).join(' | ');
    });

    const description = [
      'Tipo: Nuevo pedido',
      `Metodo de pago: ${paymentMethod}`,
      `Cliente: ${clientName}`,
      `Cantidad productos: ${items.length}`,
      ...productLines,
    ].join(' | ').substring(0, 1990);

    if (clientId) {
      const res = await fetch('/api/v1/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          clientId,
          type: 'nuevo_pedido',
          description,
          priority: 'medium',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const radNumber = data.data?.radicationNumber || generateLocalCode();
        // Marcar como pagada inmediatamente
        try {
          await fetch('/api/v1/requests/status', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ radicationNumber: radNumber, status: 'paid' }),
          });
          triggerStatusProgression(radNumber, token);
        } catch { /* silenciar */ }
        return radNumber;
      }
    }
    return generateLocalCode();
  } catch {
    return generateLocalCode();
  }
}

// Temporizador de progresión de estados automática
function triggerStatusProgression(radicationNumber: string, token: string | null) {
  const states = ['in_preparation', 'shipped', 'delivered', 'received', 'closed'];
  const delays = [15000, 30000, 45000, 60000, 75000]; // 15s, 30s, 45s, 60s, 75s

  states.forEach((status, i) => {
    setTimeout(async () => {
      try {
        await fetch('/api/v1/requests/status', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ radicationNumber, status }),
        });
      } catch { /* silenciar */ }
    }, delays[i]);
  });
}

function generateLocalCode(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  return `RAD-${year}-${seq}`;
}

const SHIPPING_COST = 8500;
const BAG_COST = 600;

type PaymentMethod = 'efectivo' | 'datafono' | 'tarjeta' | 'pse' | 'nequi' | 'daviplata';
type CheckoutPhase = 'form' | 'processing' | 'success';

/* ── Payment method icons (inline SVG for quality) ── */
function EfectivoIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" className="text-green-600" />
      <circle cx="12" cy="12" r="3" className="text-green-600" />
      <path d="M6 12h.01M18 12h.01" className="text-green-600" />
    </svg>
  );
}
function DatafonoIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" className="text-teal-600" />
      <rect x="8" y="6" width="8" height="4" rx="1" className="text-teal-600" />
      <circle cx="10" cy="14" r="0.5" fill="currentColor" className="text-teal-600" />
      <circle cx="14" cy="14" r="0.5" fill="currentColor" className="text-teal-600" />
      <circle cx="10" cy="17" r="0.5" fill="currentColor" className="text-teal-600" />
      <circle cx="14" cy="17" r="0.5" fill="currentColor" className="text-teal-600" />
    </svg>
  );
}
function TarjetaIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" className="text-indigo-600" />
      <path d="M2 10h20" className="text-indigo-600" />
      <path d="M6 15h4" className="text-indigo-600" />
    </svg>
  );
}
function PSEIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" className="text-blue-700" />
      <path d="M3 10h18" className="text-blue-700" />
      <path d="M5 6l7-3 7 3" className="text-blue-700" />
      <path d="M4 10v11" className="text-blue-700" />
      <path d="M20 10v11" className="text-blue-700" />
      <path d="M8 14v4" className="text-blue-700" />
      <path d="M12 14v4" className="text-blue-700" />
      <path d="M16 14v4" className="text-blue-700" />
    </svg>
  );
}
function NequiIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2" className="text-purple-600" />
      <path d="M11 18h2" className="text-purple-600" />
      <circle cx="12" cy="9" r="2" className="text-purple-600" />
    </svg>
  );
}
function DaviplataIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2" className="text-red-600" />
      <path d="M11 18h2" className="text-red-600" />
      <path d="M10 8l2 2 2-2" className="text-red-600" />
      <path d="M12 10v3" className="text-red-600" />
    </svg>
  );
}

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'efectivo', label: 'Efectivo', icon: <EfectivoIcon />, description: 'Paga al recibir tu pedido' },
  { id: 'datafono', label: 'Datáfono', icon: <DatafonoIcon />, description: 'Paga con datáfono al recibir' },
  { id: 'tarjeta', label: 'Tarjeta crédito/débito con (CVV)', icon: <TarjetaIcon />, description: 'Pago en línea seguro' },
  { id: 'pse', label: 'PSE', icon: <PSEIcon />, description: 'Serás dirigido al sitio web del Banco' },
  { id: 'nequi', label: 'Nequi', icon: <NequiIcon />, description: 'Paga desde tu app Nequi' },
  { id: 'daviplata', label: 'Daviplata', icon: <DaviplataIcon />, description: 'Paga desde tu app Daviplata' },
];

const colombianBanks = [
  'ACCION FIDUCIARIA', 'ALIANZA FIDUCIARIA', 'BAN100', 'BANCAMIA S.A.', 'BANCO AGRARIO',
  'BANCO AV VILLAS', 'BANCO BBVA COLOMBIA S.A.', 'BANCO CAJA SOCIAL', 'BANCO COOPERATIVO COOPCENTRAL',
  'BANCO DAVIVIENDA', 'BANCO DE BOGOTA', 'BANCO DE OCCIDENTE', 'BANCO FALABELLA',
  'BANCO FINANDINA S.A. BIC', 'BANCO GNB SUDAMERIS', 'BANCO ITAU', 'BANCO J.P. MORGAN COLOMBIA S.A.',
  'BANCO MUNDO MUJER S.A.', 'BANCO PICHINCHA', 'BANCO POPULAR', 'BANCO SANTANDER DE NEGOCIOS',
  'BANCO SERFINANZA', 'BANCO W S.A.', 'BANCOLDEX', 'BANCOLOMBIA', 'CFA COOPERATIVA FINANCIERA',
  'CITIBANK', 'COLTEFINANCIERA S.A.', 'CONFIAR COOPERATIVA FINANCIERA', 'COOFINEP COOPERATIVA FINANCIERA',
  'COTRAFA COOPERATIVA FINANCIERA', 'DALE', 'DAVIPLATA', 'FINANCIERA JURISCOOP S.A.',
  'GIROS Y FINANZAS C.F.', 'IRIS', 'LULO BANK S.A.', 'MIBANCO S.A.', 'MOVII',
  'NEQUI', 'NU COLOMBIA S.A.', 'PIBANK', 'RAPPIPAY', 'SCOTIABANK COLPATRIA S.A.',
  'UALÁ', 'UALA TECNOLOGIA COLOMBIA SAS',
];

const tipOptions = [0, 1000, 2000, 3000, 4000, 5000];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { isAuthenticated, mode, client, user, clientSessionExpiry } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<CheckoutPhase>('form');

  // Form state
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'personal' | 'porteria'>('personal');
  const [comments, setComments] = useState('');

  // PSE fields
  const [pseBank, setPseBank] = useState('');
  const [psePersonType, setPsePersonType] = useState('');
  const [pseDocNumber, setPseDocNumber] = useState('');
  const [psePhone, setPsePhone] = useState('');

  // Order result
  const [orderCode, setOrderCode] = useState('');
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPaymentLabel, setOrderPaymentLabel] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      const state = useAuthStore.getState();
      const authed = state.isAuthenticated && (
        state.mode === 'admin' ||
        (state.mode === 'client' && state.clientSessionExpiry !== null && Date.now() <= state.clientSessionExpiry)
      );
      if (!authed) {
        router.replace('/');
      } else {
        setReady(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [mounted, router]);

  useEffect(() => {
    if (mounted && ready && items.length === 0 && phase === 'form') {
      router.replace('/');
    }
  }, [mounted, ready, items.length, phase, router]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const freeShipping = subtotal >= 150000;
  const shippingCost = freeShipping ? 0 : SHIPPING_COST;
  const tip = customTip ? parseInt(customTip, 10) || 0 : selectedTip;
  const total = subtotal + shippingCost + BAG_COST + tip;

  const clientName = mode === 'client' && client
    ? `${client.firstName} ${client.lastName}`
    : user?.name ?? '';

  const clientDoc = mode === 'client' && client
    ? client.documentNumber
    : '';

  // PSE validation — use effective values (fallback to client data)
  const effectivePseDoc = pseDocNumber || clientDoc;
  const isPSEComplete = selectedPayment === 'pse'
    ? (pseBank !== '' && psePersonType !== '' && effectivePseDoc.length >= 5)
    : true;

  const canPlaceOrder = selectedPayment !== null && isPSEComplete;

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return;
    // Save order data before clearing
    setOrderItems([...items]);
    setOrderTotal(total);
    setOrderPaymentLabel(paymentMethods.find((m) => m.id === selectedPayment)?.label ?? '');

    setPhase('processing');
    
    // Create radicación in backend and get the real code
    const clientName = useAuthStore.getState().client
      ? `${useAuthStore.getState().client!.firstName} ${useAuthStore.getState().client!.lastName}`
      : 'Cliente';
    const code = await createRadicationOrder(items, paymentMethods.find((m) => m.id === selectedPayment)?.label ?? '', clientName);
    setOrderCode(code);
    
    clearCart();
    setPhase('success');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C4956A]" />
      </div>
    );
  }

  if (items.length === 0 && phase === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C4956A]" />
      </div>
    );
  }

  /* ── PROCESSING PHASE ── */
  if (phase === 'processing') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mx-auto mb-6"
          >
            <Package className="h-16 w-16 text-[#2563EB] mx-auto" />
          </motion.div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">ESTAMOS CREANDO TU ORDEN</h2>
          <p className="text-sm text-stone-500 mb-6">{orderPaymentLabel}</p>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <Truck className="h-5 w-5 text-[#2563EB]" />
            <span className="text-sm font-medium text-stone-700">Entrega estimada: <strong>41 - 61 min</strong></span>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#2563EB] border-t-transparent" />
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── SUCCESS PHASE ── */
  if (phase === 'success') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Green header */}
          <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-8 text-center text-white">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              <CheckCircle className="h-16 w-16 mx-auto mb-3" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-2xl font-bold">¡Pago generado correctamente!</h2>
            <p className="text-white/80 text-sm mt-1">Tu orden ha sido creada exitosamente</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Order code */}
            <div className="text-center">
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Número de radicación</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-black text-stone-900 tracking-wider">{orderCode}</span>
                <button onClick={handleCopyCode} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors" title="Copiar código">
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-stone-400" />}
                </button>
              </div>
            </div>

            {/* Client info */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
              <p className="text-sm font-semibold text-stone-900">{clientName}</p>
              <p className="text-xs text-stone-400">Método de pago: <span className="font-medium text-stone-600">{orderPaymentLabel}</span></p>
            </div>

            {/* Products */}
            <div>
              <p className="text-sm font-bold text-stone-900 mb-2">Productos</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orderItems.map((item) => (
                  <div key={`${item.id}|${item.size ?? ''}|${item.color ?? ''}`} className="flex items-center gap-3 p-2 rounded-lg bg-stone-50">
                    <img src={item.image} alt={item.name} className="w-10 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-400">Cant: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-stone-900">{formatCOP(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-stone-200">
              <span className="text-base font-bold text-stone-900">Total pagado</span>
              <span className="text-lg font-black text-green-600">{formatCOP(orderTotal)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A1A] text-white font-bold text-sm hover:bg-[#C4956A] transition-colors"
              >
                <Home className="h-4 w-4" /> Ir al inicio
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── FORM PHASE ── */
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al carrito
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1A1A1A] text-white text-xs font-bold">1</span>
                Dirección de envío
              </h2>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#C4956A] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{clientName}</p>
                      <p className="text-sm text-stone-500 mt-0.5">Ingrese su dirección de envío</p>
                    </div>
                  </div>
                  <button className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
                    <Edit3 className="h-3.5 w-3.5" /> Editar
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-stone-600 mb-2">¿Cómo quieres recibir tu pedido? (Opcional)</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="delivery" checked={deliveryOption === 'personal'} onChange={() => setDeliveryOption('personal')} className="accent-[#2563EB]" />
                    <span className="text-sm text-stone-700">Personal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="delivery" checked={deliveryOption === 'porteria'} onChange={() => setDeliveryOption('porteria')} className="accent-[#2563EB]" />
                    <span className="text-sm text-stone-700">Portería</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Tip */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1A1A1A] text-white text-xs font-bold">2</span>
                Propina
              </h2>
              <p className="text-sm text-stone-500 mb-1">Propina para el domiciliario</p>
              <p className="text-xs text-stone-400 mb-3">El domiciliario recibe el monto total de la propina</p>
              <div className="flex flex-wrap gap-2">
                {tipOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedTip(amount); setCustomTip(''); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedTip === amount && !customTip
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {amount === 0 ? '0' : formatCOP(amount)}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Otro ✏️"
                  value={customTip}
                  onChange={(e) => { setCustomTip(e.target.value); setSelectedTip(0); }}
                  className="w-28 px-3 py-2 rounded-lg text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1A1A1A] text-white text-xs font-bold">3</span>
                Método de pago
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: method list */}
                <div>
                  <p className="text-sm font-semibold text-stone-700 mb-3">Selecciona el método de pago</p>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-[#2563EB] bg-[#2563EB]/5 ring-1 ring-[#2563EB]/20'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <input type="radio" name="payment" checked={selectedPayment === method.id} onChange={() => setSelectedPayment(method.id)} className="accent-[#2563EB]" />
                        <div className="text-stone-600">{method.icon}</div>
                        <span className="text-sm font-medium text-stone-900">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right: payment details */}
                <div>
                  {selectedPayment === 'pse' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <PSEIcon />
                        <span className="text-sm font-bold text-stone-900">PSE</span>
                        <span className="text-xs text-stone-400 ml-1">Serás dirigido al sitio web del Banco para realizar tu pago.</span>
                      </div>

                      <div>
                        <label className="text-sm text-stone-600 font-medium">Banco:</label>
                        <select
                          value={pseBank}
                          onChange={(e) => setPseBank(e.target.value)}
                          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                        >
                          <option value="">Selecciona Tu Banco</option>
                          <option disabled>A Continuación Seleccione Su Banco</option>
                          {colombianBanks.map((bank) => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-stone-600 font-medium">Tipo de persona:</label>
                        <select
                          value={psePersonType}
                          onChange={(e) => setPsePersonType(e.target.value)}
                          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                        >
                          <option value="">Selecciona</option>
                          <option value="natural">Natural</option>
                          <option value="juridica">Jurídica</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-stone-600 font-medium">Número de identificación:</label>
                        <input
                          type="text"
                          value={pseDocNumber || clientDoc}
                          onChange={(e) => setPseDocNumber(e.target.value)}
                          placeholder="Ej: 1129564302"
                          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-stone-600 font-medium">Número celular:</label>
                        <input
                          type="tel"
                          value={psePhone}
                          onChange={(e) => setPsePhone(e.target.value)}
                          placeholder="Ej: 3005091114"
                          className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPayment === 'tarjeta' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TarjetaIcon />
                        <span className="text-sm font-bold text-stone-900">Tarjeta crédito/débito</span>
                      </div>
                      <div>
                        <label className="text-sm text-stone-600 font-medium">Número de tarjeta:</label>
                        <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-stone-600 font-medium">Vencimiento:</label>
                          <input type="text" placeholder="MM/AA" maxLength={5} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                        </div>
                        <div>
                          <label className="text-sm text-stone-600 font-medium">CVV:</label>
                          <input type="text" placeholder="123" maxLength={4} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-stone-600 font-medium">Nombre en la tarjeta:</label>
                        <input type="text" placeholder="Como aparece en la tarjeta" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                      </div>
                    </div>
                  )}

                  {selectedPayment === 'nequi' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <NequiIcon />
                        <span className="text-sm font-bold text-stone-900">Nequi</span>
                      </div>
                      <p className="text-sm text-stone-500">Ingresa tu número Nequi para recibir la solicitud de pago.</p>
                      <div>
                        <label className="text-sm text-stone-600 font-medium">Número Nequi:</label>
                        <input type="tel" placeholder="Ej: 3005091114" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                      </div>
                    </div>
                  )}

                  {selectedPayment === 'daviplata' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DaviplataIcon />
                        <span className="text-sm font-bold text-stone-900">Daviplata</span>
                      </div>
                      <p className="text-sm text-stone-500">Ingresa tu número Daviplata para recibir la solicitud de pago.</p>
                      <div>
                        <label className="text-sm text-stone-600 font-medium">Número Daviplata:</label>
                        <input type="tel" placeholder="Ej: 3005091114" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]" />
                      </div>
                    </div>
                  )}

                  {selectedPayment === 'efectivo' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <EfectivoIcon />
                        <span className="text-sm font-bold text-stone-900">Efectivo</span>
                      </div>
                      <p className="text-sm text-stone-500">Paga en efectivo al momento de recibir tu pedido. El domiciliario llevará cambio.</p>
                    </div>
                  )}

                  {selectedPayment === 'datafono' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <DatafonoIcon />
                        <span className="text-sm font-bold text-stone-900">Datáfono</span>
                      </div>
                      <p className="text-sm text-stone-500">El domiciliario llevará un datáfono para que puedas pagar con tu tarjeta al recibir el pedido.</p>
                    </div>
                  )}

                  {!selectedPayment && (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <p className="text-sm text-stone-400 text-center">Selecciona un método de pago para ver los detalles</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-8">
              {/* Delivery estimate */}
              <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#2563EB]" />
                  <div>
                    <p className="text-xs font-semibold text-stone-900">41 - 61 min</p>
                    <p className="text-[10px] text-stone-400">Express</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-stone-900 mb-4">Resumen del pedido</h3>

              {/* Items summary */}
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}|${item.size ?? ''}|${item.color ?? ''}`} className="flex justify-between text-sm">
                    <span className="text-stone-600 truncate flex-1 mr-2">{item.name} x{item.quantity}</span>
                    <span className="font-medium text-stone-900 flex-shrink-0">{formatCOP(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Costo de productos</span>
                  <span className="font-semibold text-stone-900">{formatCOP(subtotal)}</span>
                </div>
                {freeShipping && (
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">Ahorro en envío</span>
                    <span className="text-green-600 font-medium">-{formatCOP(SHIPPING_COST)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Costo Domicilio</span>
                  <span className={`font-semibold ${freeShipping ? 'text-green-600 line-through' : 'text-stone-900'}`}>{formatCOP(SHIPPING_COST)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Bolsa eco-friendly</span>
                  <span className="font-semibold text-stone-900">{formatCOP(BAG_COST)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Propina</span>
                    <span className="font-semibold text-stone-900">{formatCOP(tip)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-stone-200">
                  <span className="text-base font-bold text-stone-900">Total</span>
                  <span className="text-base font-black text-stone-900">{formatCOP(total)}</span>
                </div>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <label className="text-sm text-stone-600 font-medium">Escríbenos tus comentarios</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Ej. Dejar con el celador del edificio, por favor."
                  rows={2}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] resize-none"
                />
              </div>

              {/* Place order button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldCheck className="h-4 w-4" />
                Realizar pago
              </motion.button>

              {/* Info */}
              <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
                <p className="text-xs font-semibold text-stone-700 mb-1">Información pedido de productos Express</p>
                <ul className="text-[10px] text-stone-400 leading-relaxed space-y-0.5">
                  <li>• El tiempo promedio de los pedidos express del último mes es menor a 45 minutos.</li>
                  <li>• El costo del envío de su domicilio está detallado en el carrito de compras.</li>
                  <li>• Al hacer pagos en línea, tu pedido será cobrado al momento de facturarlo según el valor de la factura.</li>
                  <li>• Para pagos en efectivo y por datáfono, será cobrado cuando sea entregado.</li>
                  <li>• Si tienes dudas, contáctanos al chat.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}