import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message || '';

    // Simple fallback response - the frontend chatbot has its own knowledge base
    return NextResponse.json({
      status: 'success',
      data: {
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Gracias por tu mensaje. Nuestro equipo de UrbanThread AI está aquí para ayudarte. ¿En qué más puedo asistirte?`,
          createdAt: new Date().toISOString(),
        },
        conversationId: body.conversationId || crypto.randomUUID(),
      },
    });
  } catch (error) {
    console.error('chatbot error:', error);
    return NextResponse.json({
      status: 'success',
      data: {
        message: { id: crypto.randomUUID(), role: 'assistant', content: 'Lo siento, hubo un error. ¿Puedes intentar de nuevo?', createdAt: new Date().toISOString() },
        conversationId: crypto.randomUUID(),
      },
    });
  }
}
