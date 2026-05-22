import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `Eres Zyla, la fashion assistant personal de UrbanThread AI, plataforma de moda premium sostenible en Colombia.

═══ TU ROL ═══
- Asistente de MODA, ESTILO y COMPRA personal
- Recomiendas looks, outfits y prendas según contexto del cliente
- Experta en tendencias, combinaciones y moda sostenible
- Guía de compra inteligente y cercana

═══ TU PERSONALIDAD ═══
- Cálida, cercana, profesional y aspiracional
- Español colombiano natural (no robótica)
- Breve pero útil (máximo 4-5 oraciones)
- SIEMPRE cierras con "¿Puedo ayudarte en algo más?"

═══ REGLA DE MONEDA (OBLIGATORIA) ═══
- TODOS los precios SIEMPRE en formato: COP $XX.XXX
- Ejemplos correctos: COP $99.900, COP $149.900, COP $249.900
- NUNCA uses dólares, USD, "pesos", ni otro formato
- Rango de productos: COP $39.900 hasta COP $349.900

═══ CLASIFICACIÓN DE INTENCIÓN ═══
ANTES de responder, identifica qué pide el usuario:

INTENCIÓN MODA (responder como stylist):
→ "qué me pongo" / "look" / "outfit" / "recomiéndame" / "casual" / "fresco" / "sostenible" / "para hoy" / "estilo" / "vestir" / "combinar" / "prenda"
→ Responder con: saludo + contexto + 2-4 prendas con precio COP + cierre

INTENCIÓN PRODUCTO/PRECIO:
→ "cuánto cuesta" / "precio" / "disponible" / "talla" / "color"
→ Responder con información de producto en COP

INTENCIÓN ENVÍO/LOGÍSTICA:
→ "envío" / "entrega" / "cuánto tarda" / "domicilio"
→ Responder: envío gratis >COP $149.900, 3-5 días ciudades principales

INTENCIÓN SOPORTE:
→ "devolución" / "cambio" / "problema" / "ayuda" / "contacto"
→ Responder brevemente + WhatsApp +57 300 509 1114

═══ ESTRUCTURA DE RESPUESTA PARA MODA ═══
1. Saludo con nombre del cliente (si lo menciona)
2. Referencia a ciudad/clima (si lo menciona)
3. Estilo recomendado (1 línea)
4. 2-4 prendas con precio en COP
5. Cierre: "¿Puedo ayudarte en algo más?"

Ejemplo:
"¡Hola Beatriz! Hoy en Bucaramanga con 26°C te recomiendo un look fresco y ligero. Te sugiero: Blusa Urban Soft (COP $129.900), Falda Breeze Midi (COP $159.900) y Sandalias Eco-Step (COP $119.900). Perfecto para el calor. ¿Puedo ayudarte en algo más?"

═══ REGLA CRÍTICA ═══
Si el usuario pregunta por MODA/LOOK/OUTFIT, NUNCA respondas con:
- tiempos de envío
- métodos de pago
- soporte técnico
- acceso al portal
Responde SOLO con recomendación de estilo y prendas.

═══ INFO DE URBANTHREAD AI ═══
- Colecciones: Mujer, Hombre, Niños (6-14), Beauty, Accesorios
- Envío gratis: compras > COP $149.900
- Entrega: 3-5 días hábiles ciudades principales
- Pagos: Tarjeta, PSE, Nequi, Daviplata, Contra entrega
- Devoluciones: 30 días gratis
- WhatsApp: +57 300 509 1114
- Sostenibilidad: materiales reciclados, empaques biodegradables
- Disponible 24/7`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message || '';
    const conversationId = body.conversationId || crypto.randomUUID();

    // Try Gemini AI if API key is available
    if (GEMINI_API_KEY) {
      try {
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUsuario dice: "${userMessage}"\n\nResponde como Zyla de forma cordial y coherente:` }] },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
              },
            }),
          }
        );

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const aiContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (aiContent) {
            return NextResponse.json({
              status: 'success',
              data: {
                message: {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: aiContent.trim(),
                  createdAt: new Date().toISOString(),
                },
                conversationId,
              },
            });
          }
        }
      } catch (e) {
        console.error('Gemini API error:', e);
      }
    }

    // Fallback: intelligent keyword-based response
    const lower = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let response = 'Entiendo tu consulta. Puedo orientarte sobre pedidos, colecciones, envíos, pagos, devoluciones o el Portal Cliente. También puedes contactarnos por WhatsApp al +57 300 509 1114 para atención personalizada. ¿Puedo ayudarte en algo más?';

    const responses: Record<string, string> = {
      pedido: 'Para consultar tu pedido, ingresa al Portal Cliente con tu documento. En "Mis Pedidos" verás el estado actualizado con toda la información de seguimiento. ¿Puedo ayudarte en algo más?',
      envio: 'Los envíos tardan de 3 a 5 días hábiles en ciudades principales y de 5 a 8 días en otras zonas. ¡El envío es completamente gratis en compras mayores a $149.900 pesos colombianos! ¿Puedo ayudarte en algo más?',
      pago: 'Aceptamos tarjeta crédito y débito, PSE, Nequi, Daviplata y pago contra entrega. Todos los pagos son 100% seguros con encriptación de datos. ¿Puedo ayudarte en algo más?',
      devolucion: 'Tienes 30 días desde la entrega para devolver cualquier producto, completamente gratis. Ingresa al Portal Cliente, radica una solicitud de "Devolución" y adjunta fotos del producto. El reembolso se procesa en 3 a 5 días hábiles. ¿Puedo ayudarte en algo más?',
      coleccion: 'Tenemos colecciones de Mujer, Hombre, Niños de 6 a 14 años (niño y niña), Beauty y Accesorios. Los precios van desde $39.900 hasta $349.900 pesos colombianos. Toda nuestra moda es premium y sostenible. ¿Puedo ayudarte en algo más?',
      sostenible: 'En UrbanThread AI la sostenibilidad es nuestro pilar fundamental. Usamos materiales reciclados, procesos de bajo impacto ambiental y empaques 100% biodegradables. ¡Moda con conciencia ambiental! ¿Puedo ayudarte en algo más?',
      contacto: 'Puedes contactarnos por WhatsApp al +57 300 509 1114, por este chat las 24 horas, o por el formulario en la sección Contacto. Nuestros asesores atienden de lunes a viernes de 8AM a 6PM. ¿Puedo ayudarte en algo más?',
      cuenta: 'Para acceder al Portal Cliente, ingresa tu tipo y número de documento. Recibirás un código OTP de 6 dígitos en tu correo registrado. ¡Es muy fácil y seguro! ¿Puedo ayudarte en algo más?',
      hola: '¡Hola! Soy Zyla, tu asistente personal de UrbanThread AI. Estoy aquí para ayudarte con pedidos, colecciones, envíos, pagos, devoluciones y mucho más. ¿En qué puedo orientarte hoy?',
      gracias: '¡Con mucho gusto! Me alegra poder ayudarte. Si tienes alguna otra consulta en cualquier momento, no dudes en escribirme. ¡Que tengas un excelente día! ¿Puedo ayudarte en algo más?',
    };

    const keywords: Array<[string[], string]> = [
      [['hola', 'buenos', 'buenas', 'hey', 'saludos', 'hi', 'ola'], 'hola'],
      [['pedido', 'orden', 'compra', 'seguimiento', 'rastrear', 'estado'], 'pedido'],
      [['envio', 'entrega', 'despacho', 'llega', 'tarda', 'demora', 'domicilio', 'tiempo'], 'envio'],
      [['pago', 'pagar', 'tarjeta', 'nequi', 'daviplata', 'pse', 'metodo'], 'pago'],
      [['devolucion', 'devolver', 'cambio', 'reembolso', 'retornar'], 'devolucion'],
      [['coleccion', 'ropa', 'producto', 'catalogo', 'mujer', 'hombre', 'ninos', 'nina', 'nino', 'linea', 'prenda'], 'coleccion'],
      [['sostenible', 'ecologico', 'ambiente', 'verde', 'reciclado', 'eco'], 'sostenible'],
      [['contacto', 'telefono', 'whatsapp', 'llamar', 'correo', 'numero'], 'contacto'],
      [['cuenta', 'portal', 'acceder', 'login', 'otp', 'codigo', 'ingresar'], 'cuenta'],
      [['gracias', 'genial', 'perfecto', 'excelente', 'listo', 'vale', 'ok'], 'gracias'],
    ];

    for (const [words, key] of keywords) {
      if (words.some(w => lower.includes(w))) {
        response = responses[key] || response;
        break;
      }
    }

    return NextResponse.json({
      status: 'success',
      data: {
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response,
          createdAt: new Date().toISOString(),
        },
        conversationId,
      },
    });
  } catch (error) {
    console.error('chatbot error:', error);
    return NextResponse.json({
      status: 'success',
      data: {
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '¡Disculpa! Tuve un pequeño inconveniente. ¿Podrías repetir tu pregunta? Estoy aquí para ayudarte con lo que necesites.',
          createdAt: new Date().toISOString(),
        },
        conversationId: crypto.randomUUID(),
      },
    });
  }
}
