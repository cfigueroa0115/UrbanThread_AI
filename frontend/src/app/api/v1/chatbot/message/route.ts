import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `Eres Zyla, la asistente virtual de UrbanThread AI, una plataforma de moda premium sostenible en Colombia.

Tu personalidad:
- Eres amable, cordial, cálida y profesional
- Hablas en español colombiano de forma natural y cercana
- Eres experta en moda, sostenibilidad y servicio al cliente
- SIEMPRE terminas tus respuestas con "¿Puedo ayudarte en algo más?" para dar cercanía y calidez

Reglas OBLIGATORIAS:
- TODOS los precios SIEMPRE en pesos colombianos. Ejemplo: "$149.900 pesos colombianos". NUNCA uses dólares, USD ni COP.
- Responde de forma concisa pero completa (3-5 oraciones máximo)
- SIEMPRE cierra con "¿Puedo ayudarte en algo más?"
- Si no sabes algo, sugiere contactar por WhatsApp al +57 300 509 1114
- No inventes información sobre productos específicos
- Sé positiva, orientada a soluciones y empática

Información clave de UrbanThread AI:
- Colecciones: Mujer, Hombre, Niños (6-14 años niño y niña), Beauty y Accesorios
- Precios: Desde $39.900 pesos colombianos (accesorios) hasta $349.900 pesos colombianos (chaquetas premium)
- Envío gratis en compras mayores a $149.900 pesos colombianos
- Tiempos de entrega: 3-5 días hábiles ciudades principales, 5-8 días otras zonas
- Métodos de pago: Tarjeta crédito/débito, PSE, Nequi, Daviplata, Pago contra entrega
- Devoluciones: 30 días desde la entrega, completamente gratis
- Garantía: 30 días por defectos de fabricación
- Portal Cliente: Acceso con documento + código OTP de 6 dígitos por correo
- WhatsApp: +57 300 509 1114
- Horario asesores: Lunes a Viernes 8AM-6PM, Sábados 9AM-1PM
- Chatbot Zyla disponible 24/7
- Sostenibilidad: Materiales reciclados, procesos de bajo impacto, empaques biodegradables
- Radicación de solicitudes: Proceso guiado paso a paso en el Portal Cliente
- Niños: Línea UrbanThread Kids para niños y niñas de 6 a 14 años`;

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
