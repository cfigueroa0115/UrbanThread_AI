import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';
import { trackChatbotInteraction } from '@/lib/analytics';
import { searchKnowledge } from '@/data/chatbot-knowledge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    escalated?: boolean;
    ticketId?: string;
    suggestions?: string[];
  };
}

/* ── Local fallback responses when API is unavailable ── */

const FALLBACK_RESPONSES: Record<string, string> = {
  pedido: 'Para consultar el estado de tu pedido, necesito tu número de pedido (ej: ORD-20260101-0001). También puedes revisarlo directamente en tu Portal Cliente, sección "Mis Pedidos". Si tienes el número a la mano, con gusto te ayudo.',
  solicitud: 'Puedes radicar una nueva solicitud desde tu Portal Cliente en la sección "Radicación". Es un proceso guiado de 12 pasos. Si ya tienes una solicitud activa, puedes hacer seguimiento con tu número de radicación.',
  radicacion: 'El módulo de radicación te permite registrar solicitudes paso a paso. Ingresa a tu Portal Cliente, ve a "Radicación" y sigue los 12 pasos guiados. Al finalizar recibirás un número único para seguimiento.',
  devolucion: 'Para gestionar una devolución, ingresa a tu Portal Cliente y radica una solicitud de tipo "Devolución". Necesitarás adjuntar fotos del producto y tu factura. El proceso se resuelve en 3 a 5 días hábiles. Tienes hasta 30 días desde la entrega.',
  envio: 'Los tiempos de entrega son: 3 a 5 días hábiles en ciudades principales, y 5 a 8 días hábiles para municipios y zonas rurales. El envío es gratis en compras superiores a $149.900 COP.',
  pago: 'Aceptamos: Tarjeta de crédito, Tarjeta débito, PSE, Nequi, Daviplata y Pago contra entrega. Todos los pagos se procesan de forma segura.',
  precio: 'Nuestros productos van desde $39.900 COP (accesorios) hasta $349.900 COP (chaquetas premium). Toda nuestra colección es moda sostenible y premium.',
  garantia: 'Todos nuestros productos tienen garantía de 30 días por defectos de fabricación. Para reclamarla, radica una solicitud de tipo "Garantía" en tu Portal Cliente con fotos del defecto.',
  contacto: 'Puedes contactarnos por:\n• WhatsApp: 300 509 1114\n• Este chat (disponible 24/7)\n• Formulario en la sección Contacto\n\nHorario de atención humana: Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 9:00 AM - 1:00 PM.',
  horario: 'Horario de atención con asesores: Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 9:00 AM - 1:00 PM. Yo como asistente virtual estoy disponible 24/7.',
  cuenta: 'Para acceder a tu cuenta, ve al Portal Cliente e ingresa tu tipo y número de documento. Recibirás un código OTP de 6 dígitos en tu correo para verificar tu identidad.',
  otp: 'El código OTP es de 6 dígitos y se envía a tu correo registrado. Tiene validez de 5 minutos. Si no lo recibes, revisa spam o solicita uno nuevo.',
  producto: 'Ofrecemos moda premium sostenible en colecciones: Mujer, Hombre, Niños, Beauty y Accesorios. Puedes explorar todas las colecciones desde nuestra página principal.',
  sostenible: 'La sostenibilidad es fundamental en UrbanThread AI. Trabajamos con materiales reciclados, procesos de bajo impacto ambiental y empaques biodegradables.',
  servicio: 'UrbanThread AI ofrece: Tienda online premium, Portal de Cliente seguro, Radicación de solicitudes, Seguimiento de pedidos, Asistente virtual 24/7 e Integración WhatsApp. ¿Sobre qué servicio te gustaría saber más?',
  documento: 'Puedes gestionar tus documentos desde tu Portal Cliente en "Documentos". Aceptamos PDF, JPG, PNG y DOCX (máximo 10 MB).',
  agente: 'Entiendo que necesitas hablar con un asesor. Puedes escalar esta conversación o contactarnos por WhatsApp al 300 509 1114. Nuestro equipo estará encantado de atenderte.',
  hola: '¡Hola! Soy Zyla, tu asistente virtual de UrbanThread AI. Puedo ayudarte con pedidos, colecciones, envíos, pagos, devoluciones y más. ¿En qué puedo orientarte hoy?',
  gracias: '¡Con gusto! Si tienes alguna otra consulta, no dudes en escribirme. Estoy aquí para ayudarte.',
  ayuda: 'Puedo ayudarte con:\n• Pedidos y seguimiento de envíos\n• Colecciones y productos\n• Métodos de pago\n• Devoluciones y garantías\n• Acceso al Portal Cliente\n• Tallas y asesoría\n\n¿Sobre qué tema necesitas orientación?',
  talla: 'Para elegir la talla correcta, consulta nuestra guía de tallas en cada producto. Si dudas entre dos tallas, recomendamos la más grande para mayor comodidad.',
  coleccion: 'Nuestras colecciones: Mujer, Hombre, Niños, Beauty y Accesorios. Cada una con subcategorías específicas. Puedes explorarlas desde "Nuestras Colecciones" en la página principal.',
  cliente: 'Para ser cliente de UrbanThread AI, simplemente realiza tu primera compra en nuestra tienda online. Al completar tu pedido, se creará automáticamente tu cuenta en el Portal Cliente donde podrás gestionar pedidos, radicaciones y más.',
  registro: 'No necesitas registrarte previamente. Al realizar tu primera compra, tu cuenta se crea automáticamente. Luego accedes al Portal Cliente con tu documento y un código OTP que llega a tu correo.',
};

const FALLBACK_KEYWORDS: Array<[string[], string]> = [
  [['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos'], 'hola'],
  [['pedido', 'orden', 'compra', 'seguimiento', 'tracking', 'rastrear', 'realziar', 'realizar'], 'pedido'],
  [['solicitud', 'radicacion', 'radicar', 'tramite'], 'radicacion'],
  [['devolucion', 'devolver', 'cambio', 'cambiar', 'reembolso'], 'devolucion'],
  [['envio', 'despacho', 'entrega', 'domicilio', 'llega', 'tarda', 'demora'], 'envio'],
  [['pago', 'pagar', 'tarjeta', 'nequi', 'daviplata', 'pse', 'metodo'], 'pago'],
  [['precio', 'costo', 'cuanto', 'vale', 'valor'], 'precio'],
  [['garantia', 'defecto', 'danado', 'roto'], 'garantia'],
  [['contacto', 'telefono', 'llamar', 'correo', 'whatsapp', 'comunicar'], 'contacto'],
  [['horario', 'hora', 'atencion', 'abierto'], 'horario'],
  [['cuenta', 'perfil', 'acceder', 'ingresar', 'login', 'portal'], 'cuenta'],
  [['otp', 'codigo', 'verificacion'], 'otp'],
  [['producto', 'ropa', 'camiseta', 'pantalon', 'chaqueta', 'vestido', 'zapato'], 'producto'],
  [['sostenible', 'ecologico', 'verde', 'ambiente', 'reciclado'], 'sostenible'],
  [['servicio', 'funcionalidad', 'plataforma', 'ofrecen'], 'servicio'],
  [['documento', 'archivo', 'cargar', 'subir', 'pdf'], 'documento'],
  [['agente', 'humano', 'persona', 'asesor'], 'agente'],
  [['gracias', 'genial', 'perfecto', 'excelente'], 'gracias'],
  [['ayuda', 'help', 'opciones', 'menu'], 'ayuda'],
  [['talla', 'medida', 'size', 'grande', 'pequeno'], 'talla'],
  [['coleccion', 'colecciones', 'categorias', 'catalogo'], 'coleccion'],
  [['cliente', 'ser cliente', 'registrar', 'registro', 'inscribir', 'unirme'], 'cliente'],
  [['registrarme', 'crear cuenta', 'nueva cuenta', 'abrir cuenta'], 'registro'],
  [['categoria', 'categorias', 'tipo', 'tipos'], 'coleccion'],
];

const DEFAULT_FALLBACK = '¡Hola! Soy Zyla, tu asistente de UrbanThread AI. No logré conectarme al servidor en este momento, pero puedo orientarte de forma general. ¿Tu consulta es sobre pedidos, colecciones, envíos, pagos o devoluciones? También puedes contactarnos por WhatsApp al 300 509 1114 para atención inmediata.';

function getLocalFallback(userMessage: string): string {
  const lower = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const [words, key] of FALLBACK_KEYWORDS) {
    if (words.some(w => lower.includes(w))) {
      return FALLBACK_RESPONSES[key] ?? DEFAULT_FALLBACK;
    }
  }

  return DEFAULT_FALLBACK;
}

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  conversationId: string | null;
  isTyping: boolean;

  toggle: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  escalateToHuman: () => Promise<void>;
}

let messageCounter = 0;

function createMessageId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export const useChatbotStore = create<ChatbotState>()((set, get) => ({
  isOpen: false,
  messages: [],
  conversationId: null,
  isTyping: false,

  toggle: () => {
    const wasOpen = get().isOpen;
    set({ isOpen: !wasOpen });
    trackChatbotInteraction(wasOpen ? 'close' : 'open');
  },

  sendMessage: async (content: string) => {
    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }));

    try {
      let { conversationId } = get();
      trackChatbotInteraction('send_message', { contentLength: content.length });

      // Try local knowledge base first for instant responses
      const kbResults = searchKnowledge(content);
      if (kbResults.length > 0) {
        // Simulate typing delay for natural feel
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

        const bestMatch = kbResults[0]!;
        const suggestions = kbResults.slice(1, 3).map(r => r.question);

        const assistantMessage: ChatMessage = {
          id: createMessageId(),
          role: 'assistant',
          content: bestMatch.answer,
          timestamp: new Date(),
          metadata: suggestions.length > 0 ? { suggestions } : undefined,
        };

        set((state) => ({
          messages: [...state.messages, assistantMessage],
          isTyping: false,
        }));
        return;
      }
      
      // Fall back to API if no local match
      let response;
      try {
        response = await apiClient.post<{
          message: { id: string; role: string; content: string; createdAt: string } | string;
          conversationId: string;
          escalated?: boolean;
          ticketId?: string;
          isFallback?: boolean;
        }>('/chatbot/message', {
          message: content,
          conversationId,
        });
      } catch (firstError) {
        // If conversation not found (404), retry without conversationId to create a new one
        if (conversationId) {
          response = await apiClient.post<{
            message: { id: string; role: string; content: string; createdAt: string } | string;
            conversationId: string;
            escalated?: boolean;
            ticketId?: string;
            isFallback?: boolean;
          }>('/chatbot/message', {
            message: content,
            conversationId: null,
          });
        } else {
          throw firstError;
        }
      }

      const data = response.data;
      if (!data) throw new Error('No response data');

      // Backend may return message as object {id, role, content, createdAt} or string
      const messageContent = typeof data.message === 'string'
        ? data.message
        : data.message?.content ?? 'Sin respuesta';

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: messageContent,
        timestamp: new Date(),
        metadata: data.escalated
          ? { escalated: true, ticketId: data.ticketId }
          : undefined,
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        conversationId: data!.conversationId ?? state.conversationId,
        isTyping: false,
      }));
    } catch {
      // When API is unavailable, provide a helpful local fallback
      const localFallback = getLocalFallback(content);
      const errorMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: localFallback,
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
        isTyping: false,
      }));
    }
  },

  clearConversation: () => {
    set({
      messages: [],
      conversationId: null,
      isTyping: false,
    });
    trackChatbotInteraction('clear');
  },

  escalateToHuman: async () => {
    const { conversationId } = get();
    if (!conversationId) return;

    trackChatbotInteraction('escalate', { conversationId });

    try {
      const response = await apiClient.post<{ ticketId: string }>(
        `/chatbot/conversations/${conversationId}/escalate`,
      );

      const ticketId = response.data?.ticketId;

      const systemMessage: ChatMessage = {
        id: createMessageId(),
        role: 'system',
        content: ticketId
          ? `Tu conversación ha sido escalada a un agente humano. Ticket de soporte: #${ticketId}. Te contactaremos pronto.`
          : 'Tu conversación ha sido escalada a un agente humano. Te contactaremos pronto.',
        timestamp: new Date(),
        metadata: { escalated: true, ticketId },
      };

      set((state) => ({
        messages: [...state.messages, systemMessage],
      }));
    } catch {
      const errorMessage: ChatMessage = {
        id: createMessageId(),
        role: 'system',
        content:
          'No se pudo escalar la conversación en este momento. Por favor intenta de nuevo.',
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
      }));
    }
  },
}));
