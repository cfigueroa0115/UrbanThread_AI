'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, CreditCard, User, ArrowLeft, Lock, Mail, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { useSocialLookup, useVerifyOTP } from '@/hooks/useAuth';
import { OTP_LENGTH, OTP_EXPIRATION_SECONDS, OTP_MAX_ATTEMPTS, OTP_BLOCK_DURATION_MINUTES } from '@shared/constants';

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

const SHIPPING_COST = 8500;
const BAG_COST = 600;

type AuthModalStep = 'options' | 'email-input' | 'otp-verify';

export function CartPanel() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, setPendingCheckout } = useCartStore();
  const { isAuthenticated, mode, client: authClient, user: authUser, clientSessionExpiry } = useAuthStore();

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState<AuthModalStep>('options');
  const [authEmail, setAuthEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [clientInfo, setClientInfo] = useState<{ documentType: string; documentNumber: string; firstName: string; lastName: string } | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devCode, setDevCode] = useState('');

  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpFieldError, setOtpFieldError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [blockCountdown, setBlockCountdown] = useState(0);

  const socialLookup = useSocialLookup();
  const verifyOTP = useVerifyOTP();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + (items.length > 0 ? SHIPPING_COST + BAG_COST : 0);
  const freeShipping = subtotal >= 150000;

  const isReallyAuthenticated = isAuthenticated && (
    mode === 'admin' || (mode === 'client' && clientSessionExpiry !== null && Date.now() <= clientSessionExpiry)
  );

  // Get the display name for the authenticated user
  const authenticatedName = mode === 'client' && authClient
    ? `${authClient.firstName} ${authClient.lastName}`
    : mode === 'admin' && authUser
      ? authUser.name
      : null;

  const isBlocked = blockedUntil !== null && Date.now() < blockedUntil;

  // Countdown timers
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((p) => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  useEffect(() => {
    if (!blockedUntil) return;
    const u = () => {
      const r = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
      setBlockCountdown(r);
      if (r <= 0) { setBlockedUntil(null); setFailedAttempts(0); }
    };
    u();
    const t = setInterval(u, 1000);
    return () => clearInterval(t);
  }, [blockedUntil]);

  // Close auth modal and reset when user becomes authenticated
  useEffect(() => {
    if (isReallyAuthenticated && showAuthModal) {
      setShowAuthModal(false);
      resetAuthModal();
    }
  }, [isReallyAuthenticated, showAuthModal]);

  const resetAuthModal = () => {
    setAuthStep('options');
    setAuthEmail('');
    setAuthError('');
    setAuthLoading(false);
    setShowWelcome(false);
    setWelcomeName('');
    setClientInfo(null);
    setMaskedEmail('');
    setDevCode('');
    setOtpCode('');
    setOtpFieldError('');
    setCountdown(0);
    setFailedAttempts(0);
    setBlockedUntil(null);
    socialLookup.reset();
    verifyOTP.reset();
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    resetAuthModal();
  };

  const handleCheckout = () => {
    if (!isReallyAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // User is authenticated — navigate to checkout page
    closeCart();
    router.push('/checkout');
  };

  // Google button → go to email input step
  const handleGoogleOption = () => {
    setAuthStep('email-input');
    setAuthError('');
  };

  // Apple button → go to email input step
  const handleAppleOption = () => {
    setAuthStep('email-input');
    setAuthError('');
  };

  // Client portal button → navigate to existing client login
  const handleClientPortal = () => {
    setPendingCheckout(true);
    handleCloseAuthModal();
    closeCart();
    router.push('/cliente/login');
  };

  // Submit email → validate client directly (no OTP for checkout)
  const handleEmailSubmit = useCallback(() => {
    if (!authEmail.trim()) {
      setAuthError('Ingrese su correo electrónico');
      return;
    }
    setAuthError('');
    setAuthLoading(true);
    
    // Call the checkout-verify endpoint that authenticates by email directly
    fetch('/api/v1/auth/checkout-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: authEmail.trim() }),
    })
      .then(r => r.json())
      .then(res => {
        setAuthLoading(false);
        if (res.status === 'error') {
          setAuthError(res.errors?.[0]?.message || 'Error al verificar');
          return;
        }
        if (!res.data?.found) {
          setAuthError(res.data?.message || 'No se encontró una cuenta con este correo. Regístrese primero o use la opción "Cliente".');
          return;
        }
        // Client found — show welcome popup then authenticate
        const { client: foundClient, token, expiresIn } = res.data;
        setClientInfo(foundClient);
        setWelcomeName(`${foundClient.firstName} ${foundClient.lastName}`);
        setShowWelcome(true);
        
        // Authenticate after a brief welcome display
        setTimeout(() => {
          const authStore = useAuthStore.getState();
          authStore.loginClient(token, {
            id: foundClient.id,
            firstName: foundClient.firstName,
            lastName: foundClient.lastName,
            documentType: foundClient.documentType,
            documentNumber: foundClient.documentNumber,
            email: authEmail.trim(),
          }, expiresIn * 1000);
          // Modal will close via useEffect after auth state updates
        }, 2500);
      })
      .catch(() => {
        setAuthLoading(false);
        setAuthError('Error de conexión. Intente nuevamente.');
      });
  }, [authEmail]);

  // Verify OTP
  const handleVerifyOTP = useCallback(() => {
    if (isBlocked) return;
    if (otpCode.length !== OTP_LENGTH) {
      setOtpFieldError(`El código debe tener ${OTP_LENGTH} dígitos`);
      return;
    }
    if (!clientInfo) return;
    setOtpFieldError('');

    verifyOTP.mutate(
      { documentType: clientInfo.documentType, documentNumber: clientInfo.documentNumber, code: otpCode },
      {
        onSuccess: () => {
          // Auth store is updated by the hook's onSuccess
          // The useEffect above will close the modal
        },
        onError: () => {
          const n = failedAttempts + 1;
          setFailedAttempts(n);
          setOtpFieldError('Código OTP incorrecto');
          if (n >= OTP_MAX_ATTEMPTS) {
            setBlockedUntil(Date.now() + OTP_BLOCK_DURATION_MINUTES * 60 * 1000);
          }
        },
      },
    );
  }, [otpCode, clientInfo, isBlocked, failedAttempts, verifyOTP]);

  // Resend OTP
  const handleResendOTP = useCallback(() => {
    if (isBlocked || !authEmail) return;
    socialLookup.mutate({ email: authEmail.trim() }, {
      onSuccess: (data) => {
        if (data.otpSent) {
          setCountdown(data.expiresIn ?? OTP_EXPIRATION_SECONDS);
          setOtpCode('');
          setDevCode(data.devCode ?? '');
        }
      },
    });
  }, [authEmail, isBlocked, socialLookup]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              style={{ zIndex: 60 }}
              onClick={closeCart}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
              style={{ zIndex: 61 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#1A1A1A]">
                    <ShoppingBag className="h-5 w-5 text-[#C4956A]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Carrito</h2>
                    <p className="text-xs text-stone-400">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button onClick={clearCart} className="text-xs text-stone-400 hover:text-red-500 transition-colors">
                      Vaciar
                    </button>
                  )}
                  <button onClick={closeCart} className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ShoppingBag className="h-16 w-16 text-stone-200 mb-4" />
                    </motion.div>
                    <p className="text-base font-semibold text-stone-400">Tu carrito está vacío</p>
                    <p className="text-sm text-stone-300 mt-1">Agrega productos para comenzar</p>
                    <button onClick={closeCart} className="mt-4 px-6 py-2.5 rounded-xl bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#C4956A] transition-colors">
                      Seguir comprando
                    </button>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {/* Free shipping banner */}
                    {!freeShipping && (
                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#C4956A]/20 text-center">
                        <p className="text-xs text-stone-600">
                          ¡Te faltan <span className="font-bold text-[#C4956A]">{formatCOP(150000 - subtotal)}</span> para envío gratis!
                        </p>
                        <div className="w-full bg-stone-200 rounded-full h-1.5 mt-2">
                          <motion.div
                            className="bg-[#C4956A] h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((subtotal / 150000) * 100, 100)}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                    {freeShipping && (
                      <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center">
                        <p className="text-xs text-green-700 font-semibold">🎉 ¡Envío gratis aplicado!</p>
                      </div>
                    )}

                    {/* Cart items */}
                    <AnimatePresence>
                      {items.map((item) => {
                        const itemKey = `${item.id}|${item.size ?? ''}|${item.color ?? ''}`;
                        return (
                        <motion.div
                          key={itemKey}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          className="flex gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-[#C4956A]/20 transition-colors"
                        >
                          <img src={item.image} alt={item.name} className="w-16 h-20 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-stone-900 line-clamp-1">{item.name}</p>
                            <div className="flex gap-2 mt-0.5">
                              {item.size && <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">{item.size}</span>}
                              {item.color && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 flex items-center gap-1">
                                  {item.color}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-bold text-[#C4956A] mt-1">{formatCOP(item.price)}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                  className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                  className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeItem(itemKey)}
                                className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Summary */}
              {items.length > 0 && (
                <div className="border-t border-stone-100 p-5 space-y-3 bg-[#FAF8F5]">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Subtotal</span>
                      <span className="font-semibold text-stone-900">{formatCOP(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Costo domicilio</span>
                      <span className={`font-semibold ${freeShipping ? 'text-green-600 line-through' : 'text-stone-900'}`}>
                        {formatCOP(SHIPPING_COST)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Bolsa eco-friendly</span>
                      <span className="font-semibold text-stone-900">{formatCOP(BAG_COST)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-stone-200">
                      <span className="text-base font-bold text-stone-900">Total</span>
                      <span className="text-base font-black text-stone-900">
                        {formatCOP(freeShipping ? subtotal + BAG_COST : total)}
                      </span>
                    </div>
                  </div>

                  {/* Auth status */}
                  {isReallyAuthenticated && authenticatedName ? (
                    <div className="flex items-center justify-center gap-2 py-1.5">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-green-700">{authenticatedName}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#2563EB] text-center font-medium">
                      Debe iniciar sesión o registrarse.
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1A1A1A] text-white font-bold text-sm hover:bg-[#C4956A] transition-colors"
                  >
                    <CreditCard className="h-4 w-4" />
                    Ir a pagar
                  </motion.button>
                  <button onClick={closeCart} className="w-full text-center text-sm text-stone-400 hover:text-[#C4956A] transition-colors py-1">
                    Seguir comprando
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== AUTH MODAL FOR CHECKOUT ========== */}
      <AnimatePresence>
        {showAuthModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              style={{ zIndex: 70 }}
              onClick={handleCloseAuthModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{ zIndex: 71 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

                {/* ── WELCOME POPUP ── */}
                {showWelcome && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-6 py-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-5 shadow-lg"
                    >
                      <CheckCircle className="h-8 w-8 text-white" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl font-bold text-stone-900 mb-2"
                    >
                      ¡Bienvenido/a!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg font-semibold text-[#C4956A] mb-3"
                    >
                      {welcomeName}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-stone-500"
                    >
                      Tu identidad ha sido verificada exitosamente.<br />
                      Puedes proceder con tu pago.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 flex items-center justify-center gap-2 text-xs text-emerald-600 font-medium"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Sesión segura activa
                    </motion.div>
                  </motion.div>
                )}

                {/* ── STEP 1: Auth Options ── */}
                {authStep === 'options' && !showWelcome && (
                  <>
                    <div className="relative px-6 pt-6 pb-4">
                      <button
                        onClick={handleCloseAuthModal}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                        aria-label="Cerrar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <h2 className="text-xl font-bold text-[#2563EB] text-center">Inicia sesión</h2>
                    </div>

                    <div className="px-6 pb-6 space-y-4">
                      {/* Google button */}
                      <button
                        onClick={handleGoogleOption}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors text-sm font-medium text-stone-700"
                      >
                        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                      </button>

                      {/* Apple button */}
                      <button
                        onClick={handleAppleOption}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-900 bg-black text-white hover:bg-stone-800 transition-colors text-sm font-medium"
                      >
                        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        Continuar con Apple
                      </button>

                      {/* Divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-stone-200" />
                        <span className="text-xs text-stone-400">o</span>
                        <div className="flex-1 h-px bg-stone-200" />
                      </div>

                      {/* Email/phone section */}
                      <div className="space-y-3">
                        <p className="text-sm text-stone-600 font-medium">
                          Ingresa Correo electrónico o número celular:
                        </p>
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => { setAuthEmail(e.target.value); setAuthError(''); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleEmailSubmit(); }}
                          placeholder="correo electrónico o número celular"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                        />
                        <button
                          onClick={handleEmailSubmit}
                          disabled={authLoading || !authEmail.trim()}
                          className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                            authEmail.trim()
                              ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-md hover:shadow-lg'
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          } disabled:opacity-70`}
                        >
                          {authLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Verificando...
                            </span>
                          ) : 'Iniciar sesión'}
                        </button>
                      </div>

                      {authError && (
                        <p className="text-xs text-red-500 text-center">{authError}</p>
                      )}

                      {/* Divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-stone-200" />
                        <span className="text-xs text-stone-400">o</span>
                        <div className="flex-1 h-px bg-stone-200" />
                      </div>

                      {/* Client portal button */}
                      <button
                        onClick={handleClientPortal}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A1A] text-white font-bold text-sm hover:bg-[#C4956A] transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Cliente
                      </button>

                      {/* Links */}
                      <div className="text-center space-y-1.5 pt-1">
                        <p className="text-sm text-[#2563EB]">
                          ¿No tienes cuenta? <span className="font-bold underline cursor-pointer hover:text-[#1d4ed8]">Regístrate aquí</span>
                        </p>
                        <p className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer transition-colors">
                          Contacta a soporte si no puedes iniciar sesión
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* ── STEP 2: Email Input (from Google/Apple) ── */}
                {authStep === 'email-input' && !showWelcome && (
                  <>
                    <div className="relative px-6 pt-6 pb-4">
                      <button
                        onClick={handleCloseAuthModal}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                        aria-label="Cerrar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <h2 className="text-xl font-bold text-[#2563EB] text-center">Inicia sesión</h2>
                      <p className="text-sm text-stone-500 text-center mt-1">Ingresa tu correo para continuar</p>
                    </div>

                    <div className="px-6 pb-6 space-y-4">
                      <button
                        onClick={() => { setAuthStep('options'); setAuthError(''); }}
                        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" /> Volver
                      </button>

                      <div className="space-y-3">
                        <p className="text-sm text-stone-600 font-medium">
                          Anteriormente ya te habías registrado con correo electrónico:
                        </p>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(e) => { setAuthEmail(e.target.value); setAuthError(''); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleEmailSubmit(); }}
                            placeholder="correo electrónico"
                            autoFocus
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                          />
                        </div>

                        <button
                          onClick={handleEmailSubmit}
                          disabled={socialLookup.isPending || !authEmail.trim()}
                          className="w-full py-3 rounded-xl bg-[#2563EB] text-white font-medium text-sm hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
                        >
                          {socialLookup.isPending ? 'Verificando...' : 'Continuar con correo electrónico'}
                        </button>
                      </div>

                      {authError && (
                        <p className="text-xs text-red-500 text-center">{authError}</p>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-stone-200" />
                        <span className="text-xs text-stone-400">o</span>
                        <div className="flex-1 h-px bg-stone-200" />
                      </div>

                      <p className="text-sm text-stone-600 font-medium text-center">
                        También puedes iniciar sesión con tu número celular:
                      </p>
                      <input
                        type="tel"
                        placeholder="ingresa tu número"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                      />

                      <p className="text-xs text-stone-400 text-center hover:text-stone-600 cursor-pointer transition-colors">
                        ¿Olvidaste la contraseña?
                      </p>

                      <button
                        onClick={handleEmailSubmit}
                        disabled={socialLookup.isPending || !authEmail.trim()}
                        className="w-full py-3 rounded-xl bg-stone-100 text-stone-500 font-medium text-sm hover:bg-stone-200 hover:text-stone-700 transition-colors disabled:opacity-50"
                      >
                        Iniciar sesión
                      </button>
                    </div>
                  </>
                )}

                {/* ── STEP 3: OTP Verification ── */}
                {authStep === 'otp-verify' && !showWelcome && (
                  <>
                    <div className="relative px-6 pt-6 pb-4">
                      <button
                        onClick={handleCloseAuthModal}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                        aria-label="Cerrar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <h2 className="text-xl font-bold text-[#2563EB] text-center">Ingresa el código</h2>
                      <p className="text-sm text-stone-500 text-center mt-1">
                        que recibiste vía correo electrónico
                      </p>
                    </div>

                    <div className="px-6 pb-6 space-y-4">
                      <button
                        onClick={() => { setAuthStep('email-input'); setOtpCode(''); setOtpFieldError(''); }}
                        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" /> Cambiar correo
                      </button>

                      {maskedEmail && (
                        <div className="text-center">
                          <p className="text-sm text-[#2563EB] font-medium">
                            Se envió al correo {maskedEmail}
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5">Puede tardar algunos segundos.</p>
                        </div>
                      )}

                      {clientInfo && (
                        <div className="text-center text-sm text-stone-600">
                          <span className="font-medium">{clientInfo.firstName} {clientInfo.lastName}</span>
                        </div>
                      )}

                      {devCode && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                          <p className="text-xs text-amber-600 font-medium mb-1">Modo desarrollo:</p>
                          <p className="text-2xl font-mono font-bold text-amber-700 tracking-[8px]">{devCode}</p>
                        </div>
                      )}

                      {isBlocked ? (
                        <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                          <Lock className="h-8 w-8 text-red-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-red-600">Bloqueado temporalmente</p>
                          <p className="text-xs text-red-400">Intente en {formatTime(blockCountdown)}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* OTP Input */}
                          <OTPInput
                            value={otpCode}
                            onChange={(v) => { setOtpCode(v); setOtpFieldError(''); }}
                            length={OTP_LENGTH}
                            disabled={verifyOTP.isPending}
                          />
                          {otpFieldError && (
                            <p className="text-xs text-red-500 text-center">{otpFieldError}</p>
                          )}

                          {/* Countdown */}
                          <div className="text-center text-xs text-stone-500">
                            {countdown > 0 ? (
                              <>Expira en <span className="text-[#2563EB] font-medium">{formatTime(countdown)}</span></>
                            ) : (
                              <span className="text-red-500">Código expirado</span>
                            )}
                          </div>

                          {/* Verify button */}
                          <button
                            onClick={handleVerifyOTP}
                            disabled={verifyOTP.isPending || otpCode.length !== OTP_LENGTH || countdown === 0}
                            className="w-full py-3 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
                          >
                            {verifyOTP.isPending ? 'Verificando...' : 'Continuar'}
                          </button>

                          {/* Resend */}
                          <button
                            onClick={handleResendOTP}
                            disabled={socialLookup.isPending || countdown > (OTP_EXPIRATION_SECONDS - 60)}
                            className="w-full py-3 rounded-xl bg-[#2563EB]/10 text-[#2563EB] font-medium text-sm hover:bg-[#2563EB]/20 transition-colors disabled:opacity-50"
                          >
                            {socialLookup.isPending ? 'Reenviando...' : 'Reenviar'}
                          </button>

                          <div className="text-center space-y-1">
                            <p className="text-xs text-stone-400">¿No recibiste el código?</p>
                            <p className="text-xs text-[#2563EB] cursor-pointer hover:underline">
                              Selecciona otras opciones para recibir el código
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── OTP Input Component ── */
function OTPInput({ value, onChange, length, disabled }: { value: string; onChange: (v: string) => void; length: number; disabled?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  return (
    <div className="flex justify-center gap-2 mt-2">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          disabled={disabled}
          onChange={(e) => {
            const c = e.target.value;
            if (!/^\d?$/.test(c)) return;
            const a = value.split('');
            a[i] = c;
            onChange(a.join('').slice(0, length));
            if (c && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={i === 0 ? (e) => {
            e.preventDefault();
            onChange(e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length));
          } : undefined}
          className="w-11 h-13 text-center text-xl font-bold rounded-lg border border-stone-200 bg-white text-stone-900 focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] disabled:opacity-50 transition-all"
        />
      ))}
    </div>
  );
}
