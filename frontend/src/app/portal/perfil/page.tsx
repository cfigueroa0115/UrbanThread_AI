'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, MapPin, Mail, Phone, Star, FileText, Eye, Download, FolderOpen,
  Shield, Calendar, Hash, CloudSnow, Cloud, Sun, Thermometer,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner, LoadingOverlay } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth.store';
import { apiClient } from '@/lib/api-client';

type TabId = 'personal' | 'addresses' | 'contact' | 'documents';

interface ClientFull {
  id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  dateOfBirth: string | null;
  gender: string | null;
  isActive: boolean;
  addresses: Array<{ id: string; type: string; street: string; city: string; state: string; postalCode: string; country: string; isPrimary: boolean }>;
  emails: Array<{ id: string; email: string; isPrimary: boolean; isVerified: boolean }>;
  phones: Array<{ id: string; phone: string; type: string; isPrimary: boolean; isWhatsapp: boolean }>;
  documents: Array<{ id: string; fileName: string; filePath: string; fileSize: number; mimeType: string; status: string; createdAt: string }>;
  profile: { tier: string; loyaltyPoints: number; preferredLanguage: string; tags: string[] } | null;
}

const tierLabels: Record<string, string> = { standard: 'Estandar', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };
const tierColors: Record<string, string> = { standard: 'from-gray-400 to-gray-500', silver: 'from-slate-400 to-slate-500', gold: 'from-amber-400 to-yellow-500', platinum: 'from-violet-500 to-purple-600' };
const addrLabels: Record<string, string> = { home: 'Casa', work: 'Trabajo', billing: 'Facturacion', shipping: 'Envio' };
const phoneLabels: Record<string, string> = { mobile: 'Celular', home: 'Casa', work: 'Trabajo' };

/* ── Weather helpers ── */
const cityCoords: Record<string, { lat: number; lon: number; avgTemp: number }> = {
  bogota: { lat: 4.6097, lon: -74.0817, avgTemp: 14 },
  medellin: { lat: 6.2442, lon: -75.5812, avgTemp: 22 },
  cali: { lat: 3.4516, lon: -76.5320, avgTemp: 26 },
  barranquilla: { lat: 10.9685, lon: -74.7813, avgTemp: 32 },
  cartagena: { lat: 10.3910, lon: -75.5144, avgTemp: 31 },
  bucaramanga: { lat: 7.1254, lon: -73.1198, avgTemp: 24 },
  pereira: { lat: 4.8133, lon: -75.6961, avgTemp: 21 },
  manizales: { lat: 5.0689, lon: -75.5174, avgTemp: 17 },
  'santa marta': { lat: 11.2408, lon: -74.1990, avgTemp: 30 },
  ibague: { lat: 4.4389, lon: -75.2322, avgTemp: 28 },
};

function getCoordsForCity(city: string): { lat: number; lon: number; avgTemp: number } {
  const key = city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return cityCoords[key] ?? cityCoords['bogota']!;
}

interface WeatherSuggestion {
  label: string;
  items: string[];
  gradient: string;
  icon: React.ReactNode;
  images: string[];
}

function getSuggestion(temp: number): WeatherSuggestion {
  if (temp < 12) {
    return {
      label: 'Clima muy frío',
      items: ['Abrigo Largo Premium', 'Bufanda de Lana Artesanal', 'Botas de Cuero Eco'],
      gradient: 'from-[#2D2D2D] to-[#1A1A1A]',
      icon: <CloudSnow className="h-12 w-12 text-[#C4956A]" />,
      images: [
        '/images/chaquetas-1.jpg',
        '/images/chaquetas-3.jpg',
        '/images/zapatos-1.jpg',
      ],
    };
  }
  if (temp < 18) {
    return {
      label: 'Clima frío',
      items: ['Chaqueta Smart Casual', 'Suéter de Algodón Orgánico', 'Jeans Eco-Denim'],
      gradient: 'from-[#2D2D2D] to-[#1A1A1A]',
      icon: <CloudSnow className="h-12 w-12 text-[#C4956A]" />,
      images: [
        '/images/chaquetas-2.jpg',
        '/images/hombre-chaquetas-1.jpg',
        '/images/jeans-1.jpg',
      ],
    };
  }
  if (temp <= 23) {
    return {
      label: 'Clima templado',
      items: ['Camisa de Lino Natural', 'Pantalón Slim Fit Eco', 'Sneakers Urban Edition'],
      gradient: 'from-[#2D2D2D] to-[#1A1A1A]',
      icon: <Cloud className="h-12 w-12 text-[#C4956A]" />,
      images: [
        '/images/hombre-camisas-1.jpg',
        '/images/hombre-pantalones-1.jpg',
        '/images/hombre-zapatos-1.jpg',
      ],
    };
  }
  if (temp <= 28) {
    return {
      label: 'Clima cálido',
      items: ['Polo UrbanThread Sport', 'Bermuda de Algodón', 'Sandalias Eco-Step'],
      gradient: 'from-[#C4956A] to-[#8B6F5E]',
      icon: <Sun className="h-12 w-12 text-white" />,
      images: [
        '/images/hombre-camisas-2.jpg',
        '/images/hombre-pantalones-2.jpg',
        '/images/zapatos-2.jpg',
      ],
    };
  }
  return {
    label: 'Clima caluroso',
    items: ['Camiseta Ligera de Playa', 'Vestido Corto Sostenible', 'Gafas de Sol Aviator'],
    gradient: 'from-[#8B6F5E] to-[#C4956A]',
    icon: <Thermometer className="h-12 w-12 text-white" />,
    images: [
      '/images/blusas-1.jpg',
      '/images/vestidos-1.jpg',
      '/images/accesorios-1.jpg',
    ],
  };
}

export default function PerfilPage() {
  const user = useAuthStore((s) => s.user);
  const client = useAuthStore((s) => s.client);
  const clientId = user?.id ?? client?.id ?? '';

  const [data, setData] = useState<ClientFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const [previewDoc, setPreviewDoc] = useState<ClientFull['documents'][0] | null>(null);
  const [weather, setWeather] = useState<{ temp: number } | null>(null);

  useEffect(() => {
    if (!clientId) { setLoading(false); return; }
    (async () => {
      try {
        const res = await apiClient.get<ClientFull>(`/clients/me`);
        if (res.data) {
          setData(res.data);
          // Si no hay documentos, reintentar en 5 segundos (el webhook puede estar procesando)
          if (res.data.documents.length === 0) {
            setTimeout(async () => {
              try {
                const retry = await apiClient.get<ClientFull>(`/clients/me`);
                if (retry.data && retry.data.documents.length > 0) {
                  setData(retry.data);
                }
              } catch { /* ignore */ }
            }, 5000);
          }
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, [clientId]);

  /* Fetch weather once we have the client city */
  useEffect(() => {
    if (!data) return;
    const primaryAddr = data.addresses.find(a => a.isPrimary) ?? data.addresses[0];
    const city = primaryAddr?.city ?? 'Bogota';
    const coords = getCoordsForCity(city);

    (async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
        );
        if (!res.ok) {
          setWeather({ temp: coords.avgTemp + (Math.random() * 4 - 2) });
          return;
        }
        const json = await res.json();
        if (json?.current_weather?.temperature != null) {
          setWeather({ temp: json.current_weather.temperature });
        } else {
          setWeather({ temp: coords.avgTemp + (Math.random() * 4 - 2) });
        }
      } catch {
        /* Use city average as fallback */
        setWeather({ temp: coords.avgTemp + (Math.random() * 4 - 2) });
      }
    })();
  }, [data]);

  if (loading) return <LoadingOverlay message="Cargando tu perfil, espere un momento por favor..." />;
  if (!data) return <div className="p-6 text-center text-ut-text-muted">No se pudo cargar el perfil</div>;

  const primaryEmail = data.emails.find(e => e.isPrimary);
  const primaryPhone = data.phones.find(p => p.isPrimary);
  const primaryAddr = data.addresses.find(a => a.isPrimary) ?? data.addresses[0];
  const tier = data.profile?.tier ?? 'standard';
  const suggestion = weather ? getSuggestion(weather.temp) : null;

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode; count?: number }> = [
    { id: 'personal', label: 'Datos Personales', icon: <User className="h-4 w-4" /> },
    { id: 'addresses', label: 'Direcciones', icon: <MapPin className="h-4 w-4" />, count: data.addresses.length },
    { id: 'contact', label: 'Contacto', icon: <Mail className="h-4 w-4" />, count: data.emails.length + data.phones.length },
    { id: 'documents', label: 'Documentos', icon: <FileText className="h-4 w-4" />, count: data.documents.length },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] shadow-lg"><User className="h-6 w-6 text-[#C4956A]" /></div>
        <div><h1 className="text-xl font-bold text-ut-text">Mi Perfil</h1><p className="text-xs text-ut-text-muted">Informacion personal y documentos</p></div>
      </div>

      {/* Profile card with gradient header */}
      <Card className="p-0 overflow-hidden rounded-3xl">
        <div className="bg-gradient-to-r from-ut-primary via-ut-primary-light to-ut-electric p-6 sm:p-8 text-white rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`flex-shrink-0 w-20 h-20 rounded-3xl bg-gradient-to-br ${tierColors[tier]} shadow-xl flex items-center justify-center text-3xl font-bold text-white`}>
              {data.firstName[0]}{data.lastName[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{data.firstName} {data.lastName}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-white/70 text-sm"><Hash className="h-3 w-3" />{data.documentType} {data.documentNumber}</span>
                {primaryEmail && <span className="flex items-center gap-1 text-white/70 text-sm"><Mail className="h-3 w-3" />{primaryEmail.email}</span>}
                {primaryPhone && <span className="flex items-center gap-1 text-white/70 text-sm"><Phone className="h-3 w-3" />{primaryPhone.phone}</span>}
                {primaryAddr && (
                  <span className="flex items-center gap-1 text-white/70 text-sm">
                    <MapPin className="h-3 w-3" />
                    {primaryAddr.city}
                    {weather && (
                      <motion.span
                        className="ml-3 inline-flex items-center gap-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <motion.span
                          animate={{
                            color: ['rgba(196,149,106,1)', 'rgba(255,200,120,1)', 'rgba(196,149,106,1)'],
                            textShadow: ['0 0 0px rgba(196,149,106,0)', '0 0 25px rgba(196,149,106,0.8)', '0 0 0px rgba(196,149,106,0)'],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="font-black text-3xl sm:text-4xl leading-none"
                        >
                          {Math.round(weather.temp)}{'\u00B0'}C
                        </motion.span>
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.3, 0.9] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Thermometer className="h-8 w-8 sm:h-9 sm:w-9 text-[#C4956A]" />
                        </motion.div>
                      </motion.span>
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${tierColors[tier]} text-white text-xs font-bold shadow-lg`}>
                <Star className="h-3 w-3 inline mr-1" />{tierLabels[tier]}
              </span>
              {data.profile && <span className="text-white/60 text-xs">{data.profile.loyaltyPoints} puntos</span>}
            </div>
          </div>
        </div>

        {/* Weather clothing suggestion — light alert card */}
        {suggestion && weather && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-6 mt-6 relative rounded-3xl bg-gradient-to-br from-[#F5EDE4] via-[#EDE3D6] to-[#F5EDE4] p-6 shadow-lg overflow-hidden border border-[#C4956A]/20"
          >
            {/* Corner glows */}
            <motion.div className="absolute -top-4 -left-4 w-24 h-24 rounded-full pointer-events-none"
              animate={{ background: ['radial-gradient(circle, rgba(196,149,106,0.1) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0.4) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0.1) 0%, transparent 70%)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
              animate={{ background: ['radial-gradient(circle, rgba(212,167,106,0.08) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0.35) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0.08) 0%, transparent 70%)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
            <motion.div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
              animate={{ background: ['radial-gradient(circle, rgba(196,149,106,0.1) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0.4) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0.1) 0%, transparent 70%)'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            />
            <motion.div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full pointer-events-none"
              animate={{ background: ['radial-gradient(circle, rgba(212,167,106,0.06) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0.3) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0.06) 0%, transparent 70%)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            />

            {/* Rotating border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(196,149,106,0.4) 12%, rgba(255,255,255,0.7) 15%, rgba(196,149,106,0.4) 18%, transparent 30%, transparent 55%, rgba(212,167,106,0.3) 65%, rgba(255,255,255,0.6) 68%, rgba(212,167,106,0.3) 71%, transparent 85%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '1.5px',
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />

            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            />

            <div className="relative flex items-start gap-5">
              {/* Alert icon — BIG */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <motion.div
                  className="p-4 rounded-2xl bg-[#1A1A1A] border border-[#C4956A]/40"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(196,149,106,0)',
                      '0 0 30px rgba(196,149,106,0.5)',
                      '0 0 0px rgba(196,149,106,0)',
                    ],
                    borderColor: [
                      'rgba(196,149,106,0.4)',
                      'rgba(196,149,106,0.9)',
                      'rgba(196,149,106,0.4)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Cloud className="h-12 w-12 text-[#C4956A]" />
                  </motion.div>
                </motion.div>
                {/* Temperature badge */}
                <motion.div
                  className="px-4 py-2 rounded-full bg-[#1A1A1A] border border-[#C4956A]/50"
                  animate={{
                    boxShadow: ['0 0 0px rgba(196,149,106,0)', '0 0 20px rgba(196,149,106,0.5)', '0 0 0px rgba(196,149,106,0)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.span
                    className="text-xl font-black text-[#D4A76A]"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {Math.round(weather.temp)}°C
                  </motion.span>
                </motion.div>
              </div>

              <div className="flex-1">
                {/* Alert header */}
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-[#C4956A]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span className="text-xs font-bold text-[#8B6F5E] uppercase tracking-widest">Alerta de clima</span>
                </div>
                <h3 className="font-bold text-xl text-[#1A1A1A]">Sugerencia de vestimenta</h3>
                <p className="text-stone-600 text-base mt-2 leading-relaxed">
                  Hemos identificado que la temperatura en <span className="text-[#8B6F5E] font-bold">{primaryAddr?.city ?? 'tu ubicación'}</span> es de <span className="text-[#1A1A1A] font-black text-lg">{Math.round(weather.temp)}°C</span> ({suggestion.label.toLowerCase()}), por lo que sugerimos esta vestimenta:
                </p>

                {/* Product cards — dynamic with glowing borders */}
                <div className="flex flex-wrap gap-3 mt-5">
                  {suggestion.items.map((item, idx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: [0, -3, 0],
                      }}
                      transition={{
                        opacity: { delay: 0.3 + idx * 0.15 },
                        y: { duration: 3 + idx * 0.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 },
                      }}
                      whileHover={{ scale: 1.06, y: -5 }}
                      className="group relative flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-[#C4956A]/15 hover:border-[#C4956A]/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      {/* Rotating border glow per card */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'conic-gradient(from 0deg, transparent 0%, rgba(196,149,106,0.5) 15%, rgba(255,255,255,0.8) 18%, rgba(196,149,106,0.5) 21%, transparent 35%, transparent 55%, rgba(212,167,106,0.4) 68%, rgba(255,255,255,0.7) 71%, rgba(212,167,106,0.4) 74%, transparent 90%)',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                          padding: '1.5px',
                        }}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3 + idx * 0.5, repeat: Infinity, ease: 'linear' }}
                      />

                      {/* Corner glows */}
                      <motion.div className="absolute -top-2 -left-2 w-10 h-10 rounded-full pointer-events-none"
                        animate={{ background: ['radial-gradient(circle, rgba(196,149,106,0) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0.3) 0%, transparent 70%)', 'radial-gradient(circle, rgba(196,149,106,0) 0%, transparent 70%)'] }}
                        transition={{ duration: 2 + idx * 0.3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
                      />
                      <motion.div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full pointer-events-none"
                        animate={{ background: ['radial-gradient(circle, rgba(212,167,106,0) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0.25) 0%, transparent 70%)', 'radial-gradient(circle, rgba(212,167,106,0) 0%, transparent 70%)'] }}
                        transition={{ duration: 2.5 + idx * 0.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 + idx * 0.15 }}
                      />

                      {/* Card glow pulse */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        animate={{
                          boxShadow: [
                            '0 0 0px rgba(196,149,106,0)',
                            '0 0 15px rgba(196,149,106,0.15)',
                            '0 0 0px rgba(196,149,106,0)',
                          ],
                        }}
                        transition={{ duration: 2.5 + idx * 0.4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
                      />

                      <motion.div
                        className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md ring-2 ring-[#C4956A]/20 flex-shrink-0"
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 3 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <img
                          src={suggestion.images[idx]}
                          alt={item}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <span className="relative text-sm font-bold text-[#1A1A1A] group-hover:text-[#8B6F5E] transition-colors duration-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="border-b border-ut-surface-dark px-4 mt-2">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-ut-accent text-ut-accent' : 'border-transparent text-ut-text-muted hover:text-ut-text'}`}>
                {tab.icon} {tab.label}
                {tab.count !== undefined && tab.count > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-ut-accent/10 text-ut-accent text-[10px] font-bold">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* PERSONAL */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Nombres', value: data.firstName, icon: User, color: 'blue' },
                { label: 'Apellidos', value: data.lastName, icon: User, color: 'blue' },
                { label: 'Tipo documento', value: data.documentType, icon: Shield, color: 'green' },
                { label: 'Numero documento', value: data.documentNumber, icon: Hash, color: 'green' },
                { label: 'Genero', value: data.gender === 'male' ? 'Masculino' : data.gender === 'female' ? 'Femenino' : 'No especificado', icon: User, color: 'purple' },
                { label: 'Fecha nacimiento', value: data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString('es-CO') : 'No registrada', icon: Calendar, color: 'amber' },
                { label: 'Tipo cliente', value: tierLabels[tier], icon: Star, color: 'violet' },
                { label: 'Estado', value: data.isActive ? 'Activo' : 'Inactivo', icon: Shield, color: data.isActive ? 'green' : 'red' },
              ].map((field, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-ut-surface/50 hover:bg-ut-surface transition-colors">
                  <div className={`p-2 rounded-lg bg-${field.color}-50`}><field.icon className={`h-4 w-4 text-${field.color}-500`} /></div>
                  <div><p className="text-[10px] text-ut-text-muted uppercase tracking-wider">{field.label}</p><p className="text-sm font-semibold text-ut-text mt-0.5">{field.value}</p></div>
                </div>
              ))}
            </div>
          )}

          {/* ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              {data.addresses.length === 0 ? (
                <p className="text-sm text-ut-text-muted text-center py-8">No hay direcciones registradas</p>
              ) : data.addresses.map(addr => (
                <div key={addr.id} className="flex items-start gap-4 p-4 rounded-xl bg-ut-surface/50 hover:bg-ut-surface transition-colors">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] shadow-md"><MapPin className="h-5 w-5 text-[#C4956A]" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-ut-text">{addrLabels[addr.type] ?? addr.type}</span>
                      {addr.isPrimary && <Badge variant="success">Principal</Badge>}
                    </div>
                    <p className="text-sm text-ut-text">{addr.street}</p>
                    <p className="text-xs text-ut-text-muted">{addr.city}, {addr.state} {addr.postalCode} - {addr.country}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-ut-text mb-3 flex items-center gap-2"><Mail className="h-4 w-4 text-purple-500" /> Correos electronicos</h3>
                <div className="space-y-3">
                  {data.emails.map(em => (
                    <div key={em.id} className="flex items-center gap-3 p-3 rounded-xl bg-ut-surface/50 hover:bg-ut-surface transition-colors">
                      <div className="p-2 rounded-lg bg-purple-50"><Mail className="h-4 w-4 text-purple-500" /></div>
                      <span className="text-sm font-medium text-ut-text flex-1">{em.email}</span>
                      <div className="flex gap-2">
                        {em.isPrimary && <Badge variant="info">Principal</Badge>}
                        <Badge variant={em.isVerified ? 'success' : 'warning'}>{em.isVerified ? 'Verificado' : 'Pendiente'}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-ut-text mb-3 flex items-center gap-2"><Phone className="h-4 w-4 text-amber-500" /> Telefonos</h3>
                <div className="space-y-3">
                  {data.phones.map(ph => (
                    <div key={ph.id} className="flex items-center gap-3 p-3 rounded-xl bg-ut-surface/50 hover:bg-ut-surface transition-colors">
                      <div className="p-2 rounded-lg bg-amber-50"><Phone className="h-4 w-4 text-amber-500" /></div>
                      <div className="flex-1"><span className="text-sm font-medium text-ut-text">{ph.phone}</span><span className="text-xs text-ut-text-muted ml-2">{phoneLabels[ph.type] ?? ph.type}</span></div>
                      <div className="flex gap-2">
                        {ph.isPrimary && <Badge variant="info">Principal</Badge>}
                        {ph.isWhatsapp && <Badge variant="success">WhatsApp</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {data.documents.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-ut-text-muted/30 mx-auto mb-3" />
                  <p className="text-sm text-ut-text-muted">No hay documentos registrados</p>
                  <p className="text-xs text-ut-text-muted mt-1">Los documentos recibidos de n8n apareceran aqui</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-ut-surface-dark">
                  <table className="w-full text-sm table-fixed">
                    <thead className="bg-gradient-to-r from-ut-surface to-ut-surface-dark">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-bold text-ut-text-muted uppercase w-[40%]">Archivo</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-ut-text-muted uppercase w-[15%]">Tipo</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-ut-text-muted uppercase w-[12%]">Estado</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-ut-text-muted uppercase w-[15%]">Fecha</th>
                        <th className="text-center px-4 py-3 text-xs font-bold text-ut-text-muted uppercase w-[18%]">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.documents.map(doc => {
                        // Formatear tipo de archivo legible
                        const fileExt = doc.fileName.split('.').pop()?.toUpperCase() || '';
                        const typeLabel = fileExt === 'DOCX' ? 'Word' : fileExt === 'PDF' ? 'PDF' : fileExt === 'JPG' || fileExt === 'JPEG' ? 'Imagen' : fileExt === 'PNG' ? 'Imagen' : fileExt === 'XLSX' ? 'Excel' : fileExt || 'Archivo';
                        return (
                        <tr key={doc.id} className="border-t border-ut-surface-dark hover:bg-ut-accent/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="p-1.5 rounded-lg bg-blue-50 flex-shrink-0"><FileText className="h-4 w-4 text-blue-500" /></div>
                              <span className="font-medium text-ut-text truncate" title={doc.fileName}>{doc.fileName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-xs font-semibold">{typeLabel}</span></td>
                          <td className="px-4 py-3"><Badge variant={doc.status === 'active' ? 'success' : 'default'}>{doc.status === 'active' ? 'Activo' : doc.status}</Badge></td>
                          <td className="px-4 py-3 text-ut-text-muted text-xs">{new Date(doc.createdAt).toLocaleDateString('es-CO')}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => setPreviewDoc(doc)} className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors" title="Ver documento"><Eye className="h-4 w-4" /></button>
                              <a 
                                href={`https://drive.google.com/uc?export=download&id=${doc.filePath.includes('/file/d/') ? doc.filePath.split('/file/d/')[1]?.split('/')[0] : doc.filePath.includes('id=') ? doc.filePath.split('id=')[1]?.split('&')[0] : doc.filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition-colors" 
                                title="Descargar"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Document preview modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 60 }} onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-ut-surface-dark bg-gradient-to-r from-ut-primary to-ut-electric text-white">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <div>
                  <p className="font-bold text-sm">{previewDoc.fileName}</p>
                  <p className="text-white/60 text-xs">{previewDoc.mimeType}{previewDoc.fileSize > 0 ? ` - ${(previewDoc.fileSize / 1024).toFixed(0)} KB` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.filePath.includes('drive.google.com/file/d/') 
                    ? previewDoc.filePath.replace('/preview', '').replace('/file/d/', '/uc?export=download&id=').replace(/\/.*$/, '')
                    : previewDoc.filePath.includes('drive.google.com/uc') 
                      ? previewDoc.filePath 
                      : `https://drive.google.com/uc?export=download&id=${previewDoc.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white text-xs font-semibold"
                  title="Descargar archivo"
                >
                  <Download className="h-3.5 w-3.5" /> Descargar
                </a>
                <button onClick={() => setPreviewDoc(null)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[75vh] bg-stone-50">
              {(() => {
                // Extraer fileId de la URL de Google Drive
                const fileId = previewDoc.filePath.includes('/file/d/') 
                  ? previewDoc.filePath.split('/file/d/')[1]?.split('/')[0]
                  : previewDoc.filePath.includes('id=')
                    ? previewDoc.filePath.split('id=')[1]?.split('&')[0]
                    : previewDoc.filePath;
                const drivePreviewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                const driveDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

                // Usar Google Drive viewer para TODOS los tipos de archivo (universal)
                return (
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-[65vh] rounded-lg overflow-hidden border border-stone-200 shadow-inner">
                      <iframe 
                        src={drivePreviewUrl} 
                        className="w-full h-full" 
                        title={previewDoc.fileName}
                        allow="autoplay"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      />
                    </div>
                    <div className="flex justify-center">
                      <a href={driveDownloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C4956A] text-white text-sm font-semibold hover:bg-[#8B6F5E] transition-colors">
                        <Download className="h-4 w-4" /> Descargar archivo
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}