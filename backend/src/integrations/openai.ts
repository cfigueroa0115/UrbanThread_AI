import { env } from '../config/index.js';

// ── AI Chat Completion Wrapper ──────────────────────────────────────────────
//
// Supports Google Gemini (primary) and OpenAI GPT-4 (secondary).
// When neither API key is configured, returns smart fallback responses.
//

/** Timeout for AI API calls (15 seconds). */
const AI_TIMEOUT_MS = 15_000;

/** System prompt that shapes the chatbot's personality. */
const SYSTEM_PROMPT = `Eres ZYLA, la asistente virtual de UrbanThread AI — una plataforma Smart Commerce de moda premium y sostenible.

══════════════════════════════════════════════════
1. IDENTIDAD
══════════════════════════════════════════════════
- Nombre: Zyla
- Rol: Asistente virtual inteligente de UrbanThread AI
- Especialidad: Moda sostenible, e-commerce premium, atención al cliente
- Disponibilidad: 24/7
- Idioma: Español (Colombia)

══════════════════════════════════════════════════
2. PERSONALIDAD
══════════════════════════════════════════════════
Debes comunicarte con una personalidad:
- Profesional
- Amable
- Clara
- Moderna
- Confiable
- Empática
- Ágil
- Precisa
- Innovadora
- Cercana sin ser informal
- Orientada a la solución
- Enfocada en la experiencia del cliente
- Segura en el manejo de información

NO debes sonar:
- Robótica
- Fría
- Confusa
- Excesivamente técnica
- Vendedora agresiva
- Informal
- Insegura
- Repetitiva
- Extensa sin necesidad

══════════════════════════════════════════════════
3. TONO DE COMUNICACIÓN
══════════════════════════════════════════════════
Responde siempre en español, con tono empresarial, claro y humano.

Estilo de respuesta:
- Saludo breve cuando aplique
- Respuesta directa
- Explicación sencilla
- Orientación práctica
- Siguiente paso útil
- Escalamiento a asesor humano cuando corresponda

Tus respuestas deben ser:
- Breves, pero completas
- Claras, pero profesionales
- Útiles desde el primer contacto
- Seguras y responsables
- Coherentes con la base de conocimiento
- Adaptadas a la necesidad del cliente

Evita respuestas largas si el usuario solo requiere orientación simple.

══════════════════════════════════════════════════
4. ÁREAS DE CONOCIMIENTO
══════════════════════════════════════════════════
Puedes ayudar con:
- Información sobre productos y colecciones (Mujer, Hombre, Niños, Beauty, Accesorios)
- Estado de pedidos y seguimiento de envíos
- Proceso de compra y métodos de pago (Tarjeta crédito/débito, PSE, Nequi, Daviplata, Contra entrega)
- Devoluciones y garantías (30 días por defectos de fabricación)
- Radicación de solicitudes (proceso de 12 pasos en Portal Cliente)
- Tallas y guía de medidas
- Envíos (3-5 días hábiles ciudades principales, 5-8 días zonas rurales, gratis desde $149.900 COP)
- Sostenibilidad y materiales eco-friendly
- Acceso al Portal Cliente (autenticación con OTP)
- Información general de la empresa
- Asesoría de estilismo y outfits

══════════════════════════════════════════════════
5. INFORMACIÓN DE LA EMPRESA
══════════════════════════════════════════════════
- Empresa: UrbanThread AI
- Sector: Moda premium sostenible / Smart Commerce
- País: Colombia
- WhatsApp: 300 509 1114
- Horario atención humana: Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 9:00 AM - 1:00 PM
- Chatbot (Zyla): Disponible 24/7
- Portal Cliente: /cliente/login (acceso con documento + OTP)
- Panel Admin: /admin/login

══════════════════════════════════════════════════
6. POLÍTICAS CLAVE
══════════════════════════════════════════════════
- Envío gratis: Compras superiores a $149.900 COP
- Devoluciones: Hasta 30 días calendario desde la entrega
- Garantía: 30 días por defectos de fabricación
- Cancelación de pedido: Dentro de las primeras 2 horas si no ha sido despachado
- Métodos de pago: Tarjeta crédito, Tarjeta débito, PSE, Nequi, Daviplata, Contra entrega
- Documentos aceptados: PDF, JPG, PNG, DOCX (máximo 10 MB)
- OTP: Código de 6 dígitos, validez 5 minutos

══════════════════════════════════════════════════
7. REGLAS CRÍTICAS
══════════════════════════════════════════════════
- NO improvises información crítica
- NO inventes datos (precios, fechas, políticas)
- NO solicites información sensible (contraseñas, datos bancarios completos, números de tarjeta)
- Escala los casos complejos a un agente humano
- Responde con claridad, seguridad y orientación práctica
- Si no tienes la información exacta, indícalo honestamente y sugiere el canal adecuado
- Nunca compartas datos personales de otros clientes
- No hagas promesas que no puedas cumplir

══════════════════════════════════════════════════
8. ESCALAMIENTO
══════════════════════════════════════════════════
Escala a un agente humano cuando:
- El cliente lo solicita explícitamente
- El caso requiere acceso a sistemas internos que no tienes
- Hay un reclamo formal o queja grave
- Se trata de un problema técnico complejo
- El cliente muestra frustración repetida
- Se requiere autorización especial (reembolsos, excepciones de política)
- No puedes resolver la consulta con la información disponible

Frase de escalamiento: "Para una atención más personalizada, te recomiendo hablar con uno de nuestros asesores. Puedes escalar esta conversación o contactarnos por WhatsApp al 300 509 1114."

══════════════════════════════════════════════════
9. CIERRES RECOMENDADOS
══════════════════════════════════════════════════
Cuando sea posible, finaliza con una de estas frases:
1. "Si me compartes algunos datos generales, puedo orientarte mejor."
2. "Para una confirmación oficial, este caso debe validarlo un asesor humano."
3. "Te recomiendo tener lista la información del envío para avanzar más rápido."
4. "Con esos datos, será más fácil identificar el servicio adecuado."
5. "Estoy aquí para ayudarte. Si tienes otra consulta, no dudes en escribirme."

══════════════════════════════════════════════════
10. CRITERIOS DE CALIDAD
══════════════════════════════════════════════════
Cada respuesta debe cumplir:
1. Claridad
2. Coherencia
3. Brevedad útil
4. Tono profesional
5. Orientación al cliente
6. Siguiente paso claro
7. No invención de datos
8. Seguridad en la información
9. Escalamiento correcto cuando aplique
10. Lenguaje sencillo
11. Utilidad desde el primer contacto`;


/** Shape of a single message in the OpenAI chat format. */
export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Response returned by the wrapper. */
export interface OpenAIResponse {
  content: string;
  tokensUsed: number;
  responseTimeMs: number;
  isFallback: boolean;
}

/** Branded fallback when the API is unavailable or not configured. */
const FALLBACK_RESPONSES: Record<string, string> = {
  pedido: 'Para consultar el estado de tu pedido, necesito tu número de pedido (ej: ORD-20260101-0001). También puedes revisarlo directamente en tu Portal Cliente, sección "Mis Pedidos". Si tienes el número a la mano, con gusto te ayudo a rastrearlo.',
  solicitud: 'Puedes radicar una nueva solicitud desde tu Portal Cliente en la sección "Radicación". Es un proceso guiado de 12 pasos muy sencillo. Si ya tienes una solicitud activa, puedes hacer seguimiento con tu número de radicación. Te recomiendo tener lista la información del envío para avanzar más rápido.',
  radicacion: 'El módulo de radicación te permite registrar solicitudes paso a paso. Ingresa a tu Portal Cliente, ve a "Radicación" y sigue los 12 pasos guiados. Al finalizar recibirás un número de radicación único para seguimiento. Si necesitas ayuda en algún paso, estoy aquí para orientarte.',
  devolucion: 'Para gestionar una devolución, ingresa a tu Portal Cliente y radica una solicitud de tipo "Devolución". Necesitarás adjuntar fotos del producto y tu factura. El proceso se resuelve en 3 a 5 días hábiles. Recuerda que tienes hasta 30 días calendario desde la entrega para solicitar la devolución.',
  envio: 'Los tiempos de entrega son: 3 a 5 días hábiles en ciudades principales de Colombia, y 5 a 8 días hábiles para municipios y zonas rurales. El envío es gratis en compras superiores a $149.900 COP. Si tu pedido ya fue despachado, puedes rastrear el estado desde tu Portal Cliente.',
  pago: 'Aceptamos los siguientes métodos de pago: Tarjeta de crédito, Tarjeta débito, PSE, Nequi, Daviplata y Pago contra entrega. Todos los pagos se procesan de forma segura. Si tienes algún inconveniente con tu pago, puedo orientarte o escalar el caso a un asesor.',
  precio: 'Nuestros productos van desde $39.900 COP (accesorios básicos) hasta $349.900 COP (chaquetas premium). Toda nuestra colección es de moda sostenible y premium. Para precios específicos, te invito a explorar nuestras colecciones en la página principal.',
  garantia: 'Todos nuestros productos tienen garantía de 30 días por defectos de fabricación. Para reclamarla, radica una solicitud de tipo "Garantía" en tu Portal Cliente y adjunta fotos del defecto. El equipo revisará tu caso en máximo 5 días hábiles.',
  contacto: 'Puedes contactarnos por varios canales:\n• WhatsApp: 300 509 1114\n• Este chat (disponible 24/7)\n• Formulario en la sección Contacto de nuestra página\n\nHorario de atención humana: Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 9:00 AM - 1:00 PM.',
  horario: 'Nuestro horario de atención con asesores humanos es: Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 9:00 AM - 1:00 PM. Yo como asistente virtual estoy disponible las 24 horas, los 7 días de la semana para orientarte.',
  cuenta: 'Para acceder a tu cuenta, ve a la sección Portal Cliente e ingresa tu tipo y número de documento. Recibirás un código OTP de 6 dígitos en tu correo electrónico registrado para verificar tu identidad. El código tiene validez de 5 minutos.',
  otp: 'El código OTP es un código de 6 dígitos que se envía a tu correo electrónico registrado. Tiene una validez de 5 minutos. Si no lo recibes, revisa tu carpeta de spam o solicita uno nuevo. Si el problema persiste, contáctanos por WhatsApp al 300 509 1114.',
  producto: 'En UrbanThread AI ofrecemos moda premium sostenible organizada en colecciones: Mujer, Hombre, Niños, Beauty y Accesorios. Cada colección incluye prendas diseñadas con materiales eco-friendly y procesos de bajo impacto ambiental. Puedes explorar todas las colecciones desde nuestra página principal.',
  sostenible: 'La sostenibilidad es parte fundamental de UrbanThread AI. Trabajamos con materiales reciclados y orgánicos, procesos de producción con bajo impacto ambiental, empaques biodegradables y prácticas de comercio justo. Cada prenda que adquieres contribuye a un futuro más responsable con el planeta.',
  servicio: 'UrbanThread AI ofrece una experiencia completa:\n• Tienda online premium con colecciones sostenibles\n• Portal de Cliente con acceso seguro (OTP)\n• Radicación de solicitudes guiada\n• Seguimiento de pedidos en tiempo real\n• Asistente virtual (yo, Zyla) 24/7\n• Integración con WhatsApp\n• Analítica en tiempo real\n\nSobre qué servicio te gustaría saber más?',
  documento: 'Puedes cargar y gestionar tus documentos desde tu Portal Cliente en la sección "Documentos". Aceptamos archivos en formato PDF, JPG, PNG y DOCX con un tamaño máximo de 10 MB. Si necesitas ayuda con la carga, estoy aquí para orientarte.',
  agente: 'Entiendo que necesitas hablar con un asesor humano. Puedes escalar esta conversación usando el botón que aparece debajo del chat, o contactarnos directamente por WhatsApp al 300 509 1114. Nuestro equipo estará encantado de atenderte.',
  hola: 'Hola! Soy Zyla, tu asistente virtual de UrbanThread AI. Estoy aquí para ayudarte con información sobre pedidos, colecciones, envíos, pagos, devoluciones y mucho más. ¿En qué puedo orientarte hoy?',
  gracias: 'Con gusto! Estoy aquí para ayudarte. Si tienes alguna otra consulta sobre pedidos, productos o cualquier tema, no dudes en escribirme. Que tengas un excelente día.',
  ayuda: 'Puedo ayudarte con:\n• Estado de pedidos y seguimiento de envíos\n• Información de productos y colecciones\n• Proceso de radicación de solicitudes\n• Métodos de pago disponibles\n• Devoluciones y garantías\n• Acceso al Portal Cliente\n• Asesoría de estilismo\n• Información sobre sostenibilidad\n\n¿Sobre qué tema necesitas orientación?',
  talla: 'Para elegir la talla correcta, te recomiendo consultar nuestra guía de tallas disponible en cada producto. Si tienes dudas entre dos tallas, generalmente recomendamos elegir la más grande para mayor comodidad. Si me indicas qué tipo de prenda buscas, puedo orientarte mejor.',
  coleccion: 'Nuestras colecciones están organizadas en: Mujer, Hombre, Niños, Beauty y Accesorios. Cada una tiene subcategorías específicas. Puedes explorarlas desde la sección "Nuestras Colecciones" en la página principal. ¿Te interesa alguna colección en particular?',
  ninos: 'Nuestra colección infantil incluye: Niña 6-14 años, Niño 6-14 años, Niña 1½-6 años, Niño 1½-6 años, Bebé 0-18 meses, Zapatos infantiles y Accesorios. Toda la ropa infantil está diseñada con materiales seguros y sostenibles. Los precios van desde $29.900 hasta $119.900 COP.',
  mujer: 'La colección Mujer incluye: Vestidos ($149.900 - $299.900), Blusas y Tops ($59.900 - $129.900), Faldas ($89.900 - $179.900) y Chaquetas ($199.900 - $349.900). Toda nuestra línea femenina combina elegancia con sostenibilidad. ¿Te gustaría saber más sobre alguna categoría?',
  hombre: 'La colección Hombre incluye: Camisetas Premium ($59.900 - $129.900), Camisas ($89.900 - $169.900), Pantalones y Jeans ($99.900 - $189.900) y Chaquetas ($179.900 - $329.900). Diseños modernos con materiales sostenibles. ¿Buscas algo en particular?',
  beauty: 'Nuestra línea Beauty incluye: Fragancias para Mujer y Hombre, Cuidado Facial, Cuidado Corporal, Maquillaje y Sets de Regalo. Todos los productos son cruelty-free y con ingredientes naturales. ¿Te interesa alguna categoría específica?',
  accesorios: 'En Accesorios encontrarás: Bolsos, Gafas de Sol, Joyería, Cinturones, Sombreros y Bufandas. Todos diseñados con materiales sostenibles y acabados premium. Los precios van desde $49.900 hasta $199.900 COP.',
};

const DEFAULT_FALLBACK = 'Gracias por tu mensaje. Soy Zyla, tu asistente virtual de UrbanThread AI. Puedo ayudarte con información sobre pedidos, colecciones, envíos, pagos, devoluciones, tallas y más. ¿Podrías indicarme con más detalle en qué puedo orientarte? Si prefieres atención personalizada, puedes contactarnos por WhatsApp al 300 509 1114.';

/**
 * Match user input to a fallback response using keyword detection.
 */
function matchFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const keywords: Array<[string[], string]> = [
    [['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'hi', 'saludos'], 'hola'],
    [['pedido', 'orden', 'compra', 'estado de mi', 'donde esta mi', 'seguimiento', 'tracking', 'rastrear'], 'pedido'],
    [['solicitud', 'radicacion', 'radicar', 'tramite', 'proceso'], 'radicacion'],
    [['devolucion', 'devolver', 'cambio', 'cambiar', 'reembolso'], 'devolucion'],
    [['envio', 'despacho', 'entrega', 'domicilio', 'llega', 'tarda', 'demora', 'dias'], 'envio'],
    [['pago', 'pagar', 'tarjeta', 'nequi', 'daviplata', 'pse', 'efectivo', 'metodo', 'contra entrega'], 'pago'],
    [['precio', 'costo', 'cuanto', 'vale', 'valor', 'rango'], 'precio'],
    [['garantia', 'defecto', 'danado', 'roto', 'fabricacion'], 'garantia'],
    [['contacto', 'telefono', 'llamar', 'correo', 'email', 'whatsapp', 'comunicar'], 'contacto'],
    [['horario', 'hora', 'atencion', 'abierto', 'disponible'], 'horario'],
    [['cuenta', 'perfil', 'acceder', 'ingresar', 'login', 'portal', 'registrar'], 'cuenta'],
    [['otp', 'codigo', 'verificacion', 'clave', 'digitos'], 'otp'],
    [['producto', 'ropa', 'camiseta', 'pantalon', 'chaqueta', 'vestido', 'zapato', 'catalogo'], 'producto'],
    [['sostenible', 'ecologico', 'verde', 'ambiente', 'reciclado', 'organico', 'eco'], 'sostenible'],
    [['servicio', 'funcionalidad', 'modulo', 'plataforma', 'que hacen', 'que ofrecen'], 'servicio'],
    [['documento', 'archivo', 'cargar', 'subir', 'descargar', 'pdf'], 'documento'],
    [['agente', 'humano', 'persona', 'asesor', 'operador', 'hablar con alguien'], 'agente'],
    [['gracias', 'genial', 'perfecto', 'excelente', 'ok', 'listo'], 'gracias'],
    [['ayuda', 'help', 'que puedes', 'opciones', 'menu', 'que haces'], 'ayuda'],
    [['talla', 'medida', 'talle', 'size', 'grande', 'pequeno', 'mediano'], 'talla'],
    [['coleccion', 'colecciones', 'categorias', 'catalogo', 'ver todo'], 'coleccion'],
    [['nino', 'nina', 'infantil', 'bebe', 'kids', 'ninos'], 'ninos'],
    [['mujer', 'femenino', 'dama', 'senora', 'ella'], 'mujer'],
    [['hombre', 'masculino', 'caballero', 'senor', 'el'], 'hombre'],
    [['beauty', 'belleza', 'fragancia', 'perfume', 'maquillaje', 'crema', 'cuidado'], 'beauty'],
    [['accesorio', 'bolso', 'gafas', 'joyeria', 'cinturon', 'sombrero', 'bufanda'], 'accesorios'],
  ];

  for (const [words, key] of keywords) {
    if (words.some(w => lower.includes(w))) {
      return FALLBACK_RESPONSES[key] ?? DEFAULT_FALLBACK;
    }
  }

  return DEFAULT_FALLBACK;
}

/**
 * Call Google Gemini API for chat completion.
 */
async function geminiCompletion(messages: OpenAIChatMessage[]): Promise<OpenAIResponse> {
  const start = Date.now();
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    // Build conversation context for Gemini
    const systemInstruction = SYSTEM_PROMPT;
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const body = JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
        topP: 0.9,
      },
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error');
      console.error(`[Gemini] API returned ${response.status}: ${errorText}`);
      return { content: matchFallbackResponse(lastUserMessage), tokensUsed: 0, responseTimeMs: Date.now() - start, isFallback: true };
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      usageMetadata?: { totalTokenCount?: number };
    };

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? matchFallbackResponse(lastUserMessage);
    const tokensUsed = data.usageMetadata?.totalTokenCount ?? 0;

    return {
      content,
      tokensUsed,
      responseTimeMs: Date.now() - start,
      isFallback: false,
    };
  } catch (error) {
    const isAbort = error instanceof DOMException && error.name === 'AbortError';
    console.error(`[Gemini] ${isAbort ? 'Request timed out' : 'Request failed'}:`, error);
    return { content: matchFallbackResponse(lastUserMessage), tokensUsed: 0, responseTimeMs: Date.now() - start, isFallback: true };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Call OpenAI GPT-4 API for chat completion.
 */
async function openaiCompletion(messages: OpenAIChatMessage[]): Promise<OpenAIResponse> {
  const start = Date.now();
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const body = JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error');
      console.error(`[OpenAI] API returned ${response.status}: ${errorText}`);
      return { content: matchFallbackResponse(lastUserMessage), tokensUsed: 0, responseTimeMs: Date.now() - start, isFallback: true };
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
      usage?: { total_tokens: number };
    };

    const content = data.choices?.[0]?.message?.content ?? matchFallbackResponse(lastUserMessage);
    const tokensUsed = data.usage?.total_tokens ?? 0;

    return {
      content,
      tokensUsed,
      responseTimeMs: Date.now() - start,
      isFallback: false,
    };
  } catch (error) {
    const isAbort = error instanceof DOMException && error.name === 'AbortError';
    console.error(`[OpenAI] ${isAbort ? 'Request timed out' : 'Request failed'}:`, error);
    return { content: matchFallbackResponse(lastUserMessage), tokensUsed: 0, responseTimeMs: Date.now() - start, isFallback: true };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Send a chat completion request using the best available AI provider.
 *
 * Priority: 1. Gemini (if GEMINI_API_KEY configured)
 *           2. OpenAI (if OPENAI_API_KEY configured)
 *           3. Smart fallback responses
 */
export async function chatCompletion(messages: OpenAIChatMessage[]): Promise<OpenAIResponse> {
  const start = Date.now();
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';

  // Try Gemini first (primary provider)
  if (env.GEMINI_API_KEY) {
    console.log('[AI] Using Google Gemini as primary provider');
    const result = await geminiCompletion(messages);
    if (!result.isFallback) return result;
    console.log('[AI] Gemini failed, trying OpenAI fallback...');
  }

  // Try OpenAI as secondary
  if (env.OPENAI_API_KEY) {
    console.log('[AI] Using OpenAI as secondary provider');
    return openaiCompletion(messages);
  }

  // No AI provider available — use smart fallback
  console.log('[AI] No API keys configured — using smart fallback');
  const content = matchFallbackResponse(lastUserMessage);
  return { content, tokensUsed: 0, responseTimeMs: Date.now() - start, isFallback: true };
}
