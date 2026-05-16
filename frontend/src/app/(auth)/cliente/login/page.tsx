'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle, XCircle, UserPlus, X, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useRequestOTP, useVerifyOTP } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { OTPVerifySchema } from '@shared/schemas';
import { trackFormSubmit, trackLogin } from '@/lib/analytics';
import { parseZodErrors } from '@/lib/form-validation';
import { apiClient } from '@/lib/api-client';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_TYPE_VALUES, OTP_LENGTH, OTP_EXPIRATION_SECONDS, OTP_MAX_ATTEMPTS, OTP_BLOCK_DURATION_MINUTES } from '@shared/constants';

type Step = 'document' | 'verify';
type ValidationStatus = 'idle' | 'validating' | 'found' | 'not-found' | 'error';

function formatTime(s: number) { return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`; }

const networkBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700' viewBox='0 0 700 700'%3E%3Ccircle cx='50' cy='50' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='200' cy='30' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='350' cy='70' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Ccircle cx='500' cy='40' r='3.5' fill='%23b0bec5' opacity='0.45'/%3E%3Ccircle cx='650' cy='60' r='3' fill='%23b0bec5' opacity='0.5'/%3E%3Cline x1='50' y1='50' x2='200' y2='30' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='200' y1='30' x2='350' y2='70' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='350' y1='70' x2='500' y2='40' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3Cline x1='500' y1='40' x2='650' y2='60' stroke='%23cfd8dc' stroke-width='1' opacity='0.6'/%3E%3C/svg%3E")`;

export default function ClienteLoginPage() {
  const router = useRouter();
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const { pendingCheckout, setPendingCheckout, openCart } = useCartStore();

  useEffect(() => {
    if (isAuth) {
      if (pendingCheckout) {
        setPendingCheckout(false);
        router.replace('/');
        // Small delay to let the page render, then open the cart
        setTimeout(() => openCart(), 300);
      } else {
        router.replace('/portal');
      }
    }
  }, [isAuth, router, pendingCheckout, setPendingCheckout, openCart]);

  const [step, setStep] = useState<Step>('document');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [clientData, setClientData] = useState<Record<string, unknown> | null>(null);
  const [otpEnabled, setOtpEnabled] = useState(false);

  // Modals
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Registration
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // OTP
  const [otpCode, setOtpCode] = useState('');
  const [otpFieldError, setOtpFieldError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [blockCountdown, setBlockCountdown] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devCode, setDevCode] = useState('');
  const [devPreviewUrl, setDevPreviewUrl] = useState('');

  const requestOTP = useRequestOTP();
  const verifyOTP = useVerifyOTP();
  const docOptions = DOCUMENT_TYPE_VALUES.map((v) => ({ value: v, label: DOCUMENT_TYPE_LABELS[v] }));

  useEffect(() => { if (countdown <= 0) return; const t = setInterval(() => setCountdown(p => p <= 1 ? 0 : p - 1), 1000); return () => clearInterval(t); }, [countdown]);
  useEffect(() => { if (!blockedUntil) return; const u = () => { const r = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000)); setBlockCountdown(r); if (r <= 0) { setBlockedUntil(null); setFailedAttempts(0); } }; u(); const t = setInterval(u, 1000); return () => clearInterval(t); }, [blockedUntil]);
  const isBlocked = blockedUntil !== null && Date.now() < blockedUntil;

  // VALIDATE
  const handleValidate = useCallback(async () => {
    if (!documentType || documentNumber.length < 5) return;
    setValidationStatus('validating');

    // Activar flujo n8n (fire-and-forget, no bloquea el flujo principal)
    try {
      const tipoDocumentoLabel: Record<string, string> = {
        CC: 'Cédula de Ciudadanía',
        CE: 'Cédula de Extranjería',
        NIT: 'Número de Identificación Tributaria',
        PP: 'Pasaporte',
        TI: 'Tarjeta de Identidad',
      };
      fetch('https://segurobolivar-trial.app.n8n.cloud/webhook/numero_de_identifica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Tipodocumento: tipoDocumentoLabel[documentType] || documentType,
          Numerodocumento: documentNumber,
        }),
      }).catch(() => { /* silenciar errores del webhook */ });
    } catch { /* silenciar errores */ }

    try {
      const res = await apiClient.post<{ found: boolean; client?: Record<string, unknown> }>('/auth/validate-document', { documentType, documentNumber });
      if (res.data?.found) {
        setValidationStatus('found');
        setClientData(res.data.client ?? null);
        setOtpEnabled(true);
        setShowFoundModal(true);
      } else {
        setValidationStatus('not-found');
        setOtpEnabled(false);
        setShowNotFoundModal(true);
      }
    } catch { setValidationStatus('error'); }
  }, [documentType, documentNumber]);

  // REGISTER
  const handleRegister = async () => {
    if (!regFirstName || !regLastName || !regEmail) { setRegError('Todos los campos son obligatorios'); return; }
    setRegLoading(true); setRegError('');
    try {
      const res = await apiClient.post<{ client: Record<string, unknown> }>('/auth/register-client', { firstName: regFirstName, lastName: regLastName, documentType, documentNumber, email: regEmail });
      setClientData(res.data?.client ?? null);
      setShowRegisterModal(false);
      setValidationStatus('found');
      setOtpEnabled(true);
      setShowFoundModal(true);
    } catch (e) { setRegError(e instanceof Error ? e.message : 'Error al registrar'); }
    finally { setRegLoading(false); }
  };

  // OTP
  const handleRequestOTP = useCallback(() => {
    requestOTP.mutate({ documentType, documentNumber }, {
      onSuccess: (data) => {
        trackFormSubmit('otp-request', true); setStep('verify'); setCountdown(OTP_EXPIRATION_SECONDS); setOtpCode(''); setOtpFieldError('');
        const d = data as Record<string, unknown>;
        setMaskedEmail(d.maskedEmail as string ?? ''); setDevCode(d.devCode as string ?? ''); setDevPreviewUrl(d.devPreviewUrl as string ?? '');
      },
      onError: () => trackFormSubmit('otp-request', false),
    });
  }, [documentType, documentNumber, requestOTP]);

  const handleVerifyOTP = useCallback(() => {
    if (isBlocked) return; setOtpFieldError('');
    const r = OTPVerifySchema.safeParse({ documentType, documentNumber, code: otpCode });
    if (!r.success) { setOtpFieldError(parseZodErrors(r.error)['code'] || 'Codigo invalido'); return; }
    verifyOTP.mutate({ documentType, documentNumber, code: otpCode }, {
      onSuccess: () => {
        trackLogin('otp', true);
        if (pendingCheckout) {
          setPendingCheckout(false);
          router.push('/');
          setTimeout(() => openCart(), 300);
        } else {
          router.push('/portal/perfil');
        }
      },
      onError: () => { trackLogin('otp', false); const n = failedAttempts + 1; setFailedAttempts(n); setOtpFieldError('Codigo OTP incorrecto'); if (n >= OTP_MAX_ATTEMPTS) setBlockedUntil(Date.now() + OTP_BLOCK_DURATION_MINUTES * 60 * 1000); },
    });
  }, [documentType, documentNumber, otpCode, isBlocked, failedAttempts, verifyOTP, router]);

  const handleResend = useCallback(() => {
    if (isBlocked) return;
    requestOTP.mutate({ documentType, documentNumber }, { onSuccess: (data) => { setCountdown(OTP_EXPIRATION_SECONDS); setOtpCode(''); const d = data as Record<string, unknown>; setDevCode(d.devCode as string ?? ''); setDevPreviewUrl(d.devPreviewUrl as string ?? ''); } });
  }, [documentType, documentNumber, isBlocked, requestOTP]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      {/* Fashion carousel background */}
      <div className="absolute inset-0 opacity-60">
        <div className="flex flex-col justify-center h-full gap-2">
          {[
            ['https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1'],
            ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1'],
            ['https://images.pexels.com/photos/1187957/pexels-photo-1187957.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1','https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500&h=350&dpr=1'],
          ].map((row, ri) => (
            <div key={ri} className="flex gap-2 animate-scroll-row" style={{ animationDuration: `${30 + ri * 8}s`, animationDirection: ri % 2 === 0 ? 'normal' : 'reverse' }}>
              {[...row, ...row].map((src, i) => (
                <div key={i} className="flex-shrink-0 w-[260px] h-[180px] rounded-xl overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Overlay — lighter so images show through */}
      <div className="absolute inset-0 bg-[#FAF8F5]/70 backdrop-blur-[2px]" />

      <Card variant="elevated" padding="lg" className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="UrbanThread AI" className="h-24 w-auto mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-ut-text">Portal del Cliente</h1>
          <p className="text-sm text-ut-text-muted mt-1">{step === 'document' ? 'Ingrese su documento para verificar su identidad' : 'Ingrese el codigo enviado a su correo'}</p>
        </div>

        {/* STEP 1: Document */}
        {step === 'document' && (
          <div className="space-y-4">
            <Select label="Tipo de documento" options={docOptions} value={documentType} onChange={(v) => { setDocumentType(v); setValidationStatus('idle'); setOtpEnabled(false); }} required placeholder="Seleccione tipo" />
            <Input label="Numero de documento" value={documentNumber} onChange={(v) => { setDocumentNumber(v); setValidationStatus('idle'); setOtpEnabled(false); }} required placeholder="Ej: 1234567890" />

            <Button variant="secondary" size="md" className="w-full" loading={validationStatus === 'validating'} disabled={!documentType || documentNumber.length < 5} onClick={handleValidate}>
              {validationStatus === 'validating' ? 'Validando...' : 'Validar documento'}
            </Button>

            {/* Small status indicator */}
            {validationStatus === 'found' && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-700 font-medium">Cliente verificado: {clientData?.firstName as string} {clientData?.lastName as string}</span>
              </div>
            )}

            <Button variant="primary" size="lg" className="w-full" disabled={!otpEnabled} loading={requestOTP.isPending} onClick={handleRequestOTP}>
              Solicitar codigo OTP
            </Button>

            {!otpEnabled && validationStatus === 'idle' && <p className="text-xs text-ut-text-muted text-center">Primero valide su documento</p>}
            {requestOTP.isError && <p className="text-xs text-red-500 text-center">{requestOTP.error instanceof Error ? requestOTP.error.message : 'Error'}</p>}

            <div className="text-center"><a href="/" className="inline-flex items-center gap-2 text-sm text-ut-text-muted hover:text-ut-accent"><ArrowLeft className="h-4 w-4" /> Volver al sitio principal</a></div>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 'verify' && (
          <div className="space-y-4">
            <button onClick={() => { setStep('document'); requestOTP.reset(); verifyOTP.reset(); }} className="inline-flex items-center gap-1.5 text-sm text-ut-text-muted hover:text-ut-text"><ArrowLeft className="h-4 w-4" /> Cambiar documento</button>
            <div className="text-center text-sm text-ut-text-muted">
              Documento: <span className="font-medium text-ut-text">{documentType} {documentNumber}</span>
              {maskedEmail && <div className="mt-1">Enviado a: <span className="font-medium text-ut-accent">{maskedEmail}</span></div>}
            </div>
            {devCode && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <p className="text-xs text-amber-600 font-medium mb-1">Modo desarrollo:</p>
                <p className="text-2xl font-mono font-bold text-amber-700 tracking-[8px]">{devCode}</p>
                {devPreviewUrl && <a href={devPreviewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600"><Mail className="h-3 w-3" /> Ver correo</a>}
              </div>
            )}
            {isBlocked ? (
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200"><Lock className="h-8 w-8 text-red-500 mx-auto mb-2" /><p className="text-sm font-medium text-red-600">Bloqueado temporalmente</p><p className="text-xs text-red-400">Intente en {formatTime(blockCountdown)}</p></div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }} className="space-y-4" noValidate>
                <div><label className="text-sm font-medium text-ut-text">Codigo de verificacion <span className="text-red-500">*</span></label><OTPInput value={otpCode} onChange={(v) => { setOtpCode(v); setOtpFieldError(''); }} length={OTP_LENGTH} disabled={verifyOTP.isPending} />{otpFieldError && <p className="text-xs text-red-500 text-center mt-1">{otpFieldError}</p>}</div>
                <div className="text-center text-xs text-ut-text-muted">{countdown > 0 ? <>Expira en <span className="text-ut-accent font-medium">{formatTime(countdown)}</span></> : <span className="text-red-500">Codigo expirado</span>}</div>
                <Button type="submit" variant="primary" size="lg" loading={verifyOTP.isPending} disabled={otpCode.length !== OTP_LENGTH || countdown === 0} className="w-full">Verificar codigo</Button>
                <div className="text-center"><button type="button" onClick={handleResend} disabled={requestOTP.isPending || countdown > 240} className="text-sm text-ut-accent hover:underline disabled:opacity-50">{requestOTP.isPending ? 'Reenviando...' : 'Reenviar codigo'}</button></div>
              </form>
            )}
          </div>
        )}
      </Card>

      {/* ========== MODAL: CLIENT FOUND ========== */}
      <AnimatePresence>
        {showFoundModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm" style={{ zIndex: 60 }} onClick={() => setShowFoundModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 61 }}>
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                {/* Green gradient header */}
                <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-8 text-center text-white relative">
                  <button onClick={() => setShowFoundModal(false)} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"><X className="h-4 w-4" /></button>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                    <CheckCircle className="h-16 w-16 mx-auto mb-3" strokeWidth={1.5} />
                  </motion.div>
                  <h2 className="text-xl font-bold">Bienvenido/a de vuelta!</h2>
                  <p className="text-white/80 text-sm mt-1">Cliente verificado exitosamente</p>
                </div>
                {/* Client info */}
                <div className="p-6 space-y-3 text-center">
                  <p className="text-lg font-bold text-ut-text">{clientData?.firstName as string} {clientData?.lastName as string}</p>
                  <div className="flex justify-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">{clientData?.documentType as string} {clientData?.documentNumber as string}</span>
                    {clientData?.maskedEmail ? <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{String(clientData.maskedEmail)}</span> : null}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-green-600"><Sparkles className="h-4 w-4" /> Puede solicitar su codigo OTP</div>
                  <Button variant="primary" size="lg" className="w-full mt-2" onClick={() => setShowFoundModal(false)}>Continuar</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== MODAL: CLIENT NOT FOUND ========== */}
      <AnimatePresence>
        {showNotFoundModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm" style={{ zIndex: 60 }} onClick={() => setShowNotFoundModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 61 }}>
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="bg-gradient-to-br from-red-400 to-rose-500 p-8 text-center text-white relative">
                  <button onClick={() => setShowNotFoundModal(false)} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"><X className="h-4 w-4" /></button>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                    <XCircle className="h-16 w-16 mx-auto mb-3" strokeWidth={1.5} />
                  </motion.div>
                  <h2 className="text-xl font-bold">Cliente no encontrado</h2>
                  <p className="text-white/80 text-sm mt-1">No existe en el sistema</p>
                </div>
                <div className="p-6 space-y-4 text-center">
                  <p className="text-sm text-ut-text-muted">Actualmente no existe como cliente de <span className="font-semibold text-ut-text">UrbanThread AI</span>, pero lo invitamos a registrarse.</p>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowNotFoundModal(false)}>Cerrar</Button>
                    <Button variant="primary" size="md" className="flex-1" icon={<UserPlus className="h-4 w-4" />} onClick={() => { setShowNotFoundModal(false); setShowRegisterModal(true); }}>Registrarse</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== MODAL: REGISTER NEW CLIENT ========== */}
      <AnimatePresence>
        {showRegisterModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm" style={{ zIndex: 60 }} onClick={() => setShowRegisterModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 61 }}>
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-br from-ut-accent to-teal-500 p-6 text-center text-white relative">
                  <button onClick={() => setShowRegisterModal(false)} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"><X className="h-4 w-4" /></button>
                  <UserPlus className="h-12 w-12 mx-auto mb-2" strokeWidth={1.5} />
                  <h2 className="text-lg font-bold">Registro de nuevo cliente</h2>
                  <p className="text-white/80 text-xs mt-1">Complete sus datos para crear su cuenta</p>
                </div>
                <div className="p-6 space-y-4">
                  <Input label="Nombres" value={regFirstName} onChange={setRegFirstName} required placeholder="Ej: Carlos Andres" />
                  <Input label="Apellidos" value={regLastName} onChange={setRegLastName} required placeholder="Ej: Garcia Lopez" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-ut-surface text-center"><p className="text-[10px] text-ut-text-muted uppercase">Tipo</p><p className="text-sm font-bold text-ut-text">{documentType}</p></div>
                    <div className="p-3 rounded-xl bg-ut-surface text-center"><p className="text-[10px] text-ut-text-muted uppercase">Numero</p><p className="text-sm font-bold text-ut-text">{documentNumber}</p></div>
                  </div>
                  <Input label="Correo electronico" type="email" value={regEmail} onChange={setRegEmail} required placeholder="correo@ejemplo.com" />
                  {regError && <p className="text-xs text-red-500 text-center">{regError}</p>}
                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowRegisterModal(false)}>Cancelar</Button>
                    <Button variant="primary" size="md" className="flex-1" loading={regLoading} onClick={handleRegister}>Guardar</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function OTPInput({ value, onChange, length, disabled }: { value: string; onChange: (v: string) => void; length: number; disabled?: boolean }) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  return (
    <div className="flex justify-center gap-2 mt-2">
      {Array.from({ length }, (_, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ''} disabled={disabled}
          onChange={(e) => { const c = e.target.value; if (!/^\d?$/.test(c)) return; const a = value.split(''); a[i] = c; onChange(a.join('').slice(0, length)); if (c && i < length - 1) refs.current[i+1]?.focus(); }}
          onKeyDown={(e) => { if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i-1]?.focus(); }}
          onPaste={i === 0 ? (e) => { e.preventDefault(); onChange(e.clipboardData.getData('text').replace(/\D/g,'').slice(0,length)); } : undefined}
          className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-ut-surface-dark bg-white text-ut-text focus:ring-2 focus:ring-ut-accent focus:border-ut-accent disabled:opacity-50 transition-all" />
      ))}
    </div>
  );
}
