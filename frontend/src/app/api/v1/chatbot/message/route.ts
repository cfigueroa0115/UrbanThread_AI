import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `Eres Zyla, la fashion assistant de UrbanThread AI, una plataforma de moda premium sostenible en Colombia.

Tu rol principal:
- Eres una ASISTENTE DE MODA Y ESTILO personal
- Recomiendas looks, outfits y prendas según el contexto del cliente
- Conoces tendencias, combinaciones y estilos
- Eres experta en moda sostenible y premium

Tu personalidad:
- Amable, cálida, cercana y profesional
- Hablas en español colombiano natural
- Eres aspiracional pero accesible
- SIEMPRE cierras con "¿Puedo ayudarte en algo más?"

Reglas OBLIGATORIAS de precios:
- TODOS los precios en formato: COP $XX.XXX (ejemplo: COP $149.900)
- NUNCA uses dólares, USD, ni "pesos colombianos" escrito. Solo "COP $"
- Rangos: COP $39.900 (accesorios) hasta COP $349.900 (chaquetas premium)

PRIORIDAD DE RESPUESTA — Cuando el usuario pregunte por:
- "qué me pongo" / "look" / "outfit" / "recomiéndame" / "algo casual" / "algo fresco" / "sostenible" / "para hoy"
DEBES responder con recomendación de MODA siguiendo esta estructura:
1. Saludo usando el nombre del cliente si lo menciona
2. Referencia a su ciudad y clima si lo menciona
3. Recomendación de estilo general (1 línea)
4. 2-4 prendas específicas con precio en COP
5. Cierre invitando a explorar más

Ejemplo de respuesta ideal:
"¡Hola Paola! Hoy en Bogotá con 20°C te recomiendo un look fresco y versátil. Te sugiero: Blusa Urbana Soft (COP $129.900), Pantalón Wide Leg Breeze (COP $189.900) y Tenis Urban Light (COP $219.900). Es un combo perfecto para el clima templado. ¿Puedo ayudarte en algo más?"

NO respondas con tiempos de envío, logística o soporte cuando pregunten por moda/looks.

Información de UrbanThread AI:
- Colecciones: Mujer, Hombre, Niños (6-14 años), Beauty, Accesorios
- Envío gratis en compras mayores a COP $149.900
- Entrega: 3-5 días hábiles ciudades principales
- Pagos: Tarjeta, PSE, Nequi, Daviplata, Contra entrega
- Devoluciones: 30 días gratis
- WhatsApp: +57 300 509 1114
- Sostenibilidad: Materiales reciclados, empaques biodegradables
- Chatbot Zyla disponible 24/7
- Línea Kids: UrbanThread Kids (6-14 años)`;

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
