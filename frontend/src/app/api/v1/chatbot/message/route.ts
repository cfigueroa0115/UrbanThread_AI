import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `Eres Zyla, la asistente virtual de UrbanThread AI, una plataforma de moda premium sostenible en Colombia.

Tu personalidad:
- Eres amable, cordial y profesional
- Hablas en español colombiano de forma natural y cálida
- Eres experta en moda, sostenibilidad y servicio al cliente
- Siempre ofreces ayuda adicional al final de tus respuestas

Información clave de UrbanThread AI:
- Colecciones: Mujer, Hombre, Niños (6-14 años), Beauty y Accesorios
- Envío gratis en compras mayores a $149.900 COP
- Tiempos de entrega: 3-5 días hábiles ciudades principales, 5-8 días otras zonas
- Métodos de pago: Tarjeta crédito/débito, PSE, Nequi, Daviplata, Pago contra entrega
- Devoluciones: 30 días desde la entrega, gratis
- Garantía: 30 días por defectos de fabricación
- Portal Cliente: Acceso con documento + código OTP por correo
- WhatsApp: +57 300 509 1114
- Horario asesores: Lunes a Viernes 8AM-6PM, Sábados 9AM-1PM
- Chatbot disponible 24/7
- Sostenibilidad: Materiales reciclados, procesos de bajo impacto, empaques biodegradables
- Radicación de solicitudes: Proceso guiado en el Portal Cliente

Reglas:
- Responde de forma concisa (máximo 3-4 oraciones)
- Si no sabes algo, sugiere contactar por WhatsApp o el Portal Cliente
- No inventes información sobre productos específicos
- Siempre sé positiva y orientada a soluciones`;

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
    let response = '¡Hola! Soy Zyla, tu asistente de UrbanThread AI. ¿En qué puedo ayudarte? Puedo orientarte sobre pedidos, colecciones, envíos, pagos, devoluciones o el Portal Cliente.';

    const responses: Record<string, string> = {
      pedido: 'Para consultar tu pedido, ingresa al Portal Cliente con tu documento. En "Mis Pedidos" verás el estado actualizado. Si necesitas el número de seguimiento, también lo encuentras ahí. ¿Necesitas ayuda con algo más?',
      envio: 'Los envíos tardan 3-5 días hábiles en ciudades principales y 5-8 días en otras zonas. ¡El envío es gratis en compras mayores a $149.900! ¿Te puedo ayudar con algo más?',
      pago: 'Aceptamos tarjeta crédito/débito, PSE, Nequi, Daviplata y pago contra entrega. Todos los pagos son 100% seguros. ¿Hay algo más en lo que pueda ayudarte?',
      devolucion: 'Tienes 30 días desde la entrega para devolver. Ingresa al Portal Cliente, radica una solicitud de "Devolución" y adjunta fotos del producto. El reembolso se procesa en 3-5 días hábiles. ¿Necesitas más información?',
      coleccion: 'Tenemos colecciones de Mujer, Hombre, Niños (6-14 años), Beauty y Accesorios. Toda nuestra moda es premium y sostenible. Puedes explorarlas desde la página principal. ¿Te interesa alguna en particular?',
      sostenible: 'En UrbanThread AI la sostenibilidad es nuestro pilar. Usamos materiales reciclados, procesos de bajo impacto ambiental y empaques 100% biodegradables. ¡Moda con conciencia! ¿Quieres saber más?',
      contacto: 'Puedes contactarnos por WhatsApp al +57 300 509 1114, por este chat 24/7, o por el formulario en la sección Contacto. Nuestros asesores atienden de lunes a viernes 8AM-6PM. ¿En qué más te ayudo?',
      cuenta: 'Para acceder al Portal Cliente, ingresa tu tipo y número de documento. Recibirás un código OTP de 6 dígitos en tu correo registrado. ¡Es muy fácil y seguro! ¿Necesitas ayuda con el acceso?',
      hola: '¡Hola! Soy Zyla, tu asistente personal de UrbanThread AI. Estoy aquí para ayudarte con pedidos, colecciones, envíos, pagos, devoluciones y mucho más. ¿En qué puedo orientarte hoy?',
      gracias: '¡Con mucho gusto! Me alegra poder ayudarte. Si tienes alguna otra consulta, no dudes en escribirme. ¡Que tengas un excelente día! 🌟',
    };

    const keywords: Array<[string[], string]> = [
      [['hola', 'buenos', 'buenas', 'hey', 'saludos', 'hi'], 'hola'],
      [['pedido', 'orden', 'compra', 'seguimiento', 'rastrear'], 'pedido'],
      [['envio', 'entrega', 'despacho', 'llega', 'tarda', 'demora', 'domicilio'], 'envio'],
      [['pago', 'pagar', 'tarjeta', 'nequi', 'daviplata', 'pse'], 'pago'],
      [['devolucion', 'devolver', 'cambio', 'reembolso'], 'devolucion'],
      [['coleccion', 'ropa', 'producto', 'catalogo', 'mujer', 'hombre', 'ninos'], 'coleccion'],
      [['sostenible', 'ecologico', 'ambiente', 'verde', 'reciclado'], 'sostenible'],
      [['contacto', 'telefono', 'whatsapp', 'llamar', 'correo'], 'contacto'],
      [['cuenta', 'portal', 'acceder', 'login', 'otp', 'codigo'], 'cuenta'],
      [['gracias', 'genial', 'perfecto', 'excelente', 'listo'], 'gracias'],
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
