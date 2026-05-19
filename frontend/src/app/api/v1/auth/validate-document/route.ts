import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentType, documentNumber } = body;

    if (!documentType || !documentNumber) {
      return NextResponse.json(
        { status: 'error', errors: [{ message: 'Tipo y número de documento son requeridos', code: 'VALIDATION_ERROR' }] },
        { status: 400 }
      );
    }

    // 1. Activar flujo n8n y capturar response
    let n8nData: Record<string, unknown> | null = null;
    try {
      const tipoDocumentoLabel: Record<string, string> = {
        CC: 'Cédula de Ciudadanía',
        CE: 'Cédula de Extranjería',
        NIT: 'Número de Identificación Tributaria',
        PP: 'Pasaporte',
        TI: 'Tarjeta de Identidad',
      };
      const n8nResponse = await fetch('https://segurobolivar-trial.app.n8n.cloud/webhook/numero_de_identifica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Tipodocumento: tipoDocumentoLabel[documentType] || documentType,
          Numerodocumento: documentNumber,
        }),
        signal: AbortSignal.timeout(25000),
      });
      if (n8nResponse.ok) {
        const responseData = await n8nResponse.json();
        // n8n puede devolver un array o un objeto
        n8nData = Array.isArray(responseData) ? responseData[0] : responseData;
      }
    } catch (e) {
      console.error('[n8n] Webhook error:', e);
    }

    // 2. Buscar cliente en la base de datos local
    const client = await prisma.client.findFirst({
      where: { documentType, documentNumber },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        documentType: true,
        documentNumber: true,
        emails: { select: { email: true }, take: 1 },
      },
    });

    // 3. Si n8n devolvió documentos y el cliente existe, guardarlos en la BD
    if (client && n8nData) {
      const n8nBody = (n8nData as { response?: { body?: Record<string, unknown> } })?.response?.body || n8nData;
      const documentos = (n8nBody as Record<string, unknown>).documentos as Array<Record<string, unknown>> 
        || (n8nBody as Record<string, unknown>).files as Array<Record<string, unknown>>
        || (n8nBody as Record<string, unknown>).archivos as Array<Record<string, unknown>>
        || [];

      if (Array.isArray(documentos) && documentos.length > 0) {
        // Obtener o crear un DocumentType genérico
        let docType = await prisma.documentType.findFirst({ where: { code: 'GENERAL' } });
        if (!docType) {
          docType = await prisma.documentType.create({
            data: { code: 'GENERAL', name: 'Documento General', isActive: true },
          });
        }

        // Eliminar documentos anteriores del cliente (siempre última versión)
        await prisma.clientDocument.deleteMany({ where: { clientId: client.id } });

        // Insertar nuevos documentos
        for (const doc of documentos) {
          const fileName = (doc.fileName || doc.name || 'documento') as string;
          const mimeType = (doc.mimeType || 'application/octet-stream') as string;
          const fileId = (doc.fileId || doc.id || '') as string;
          const downloadUrl = fileId 
            ? `https://drive.google.com/uc?export=download&id=${fileId}`
            : '';
          const viewUrl = fileId
            ? `https://drive.google.com/file/d/${fileId}/preview`
            : '';

          await prisma.clientDocument.create({
            data: {
              clientId: client.id,
              documentTypeId: docType.id,
              fileName,
              filePath: viewUrl || downloadUrl || fileId,
              fileSize: 0,
              mimeType,
              status: 'active',
              uploadedBy: 'n8n-webhook',
            },
          });
        }
      }
    }

    // 4. Responder al frontend
    if (client) {
      const primaryEmail = client.emails[0]?.email || '';
      const [user, domain] = primaryEmail.split('@');
      const maskedEmail = user
        ? `${user.substring(0, 2)}${'*'.repeat(Math.max(0, user.length - 2))}@${domain || ''}`
        : '';

      return NextResponse.json({
        status: 'success',
        data: {
          found: true,
          client: {
            firstName: client.firstName,
            lastName: client.lastName,
            documentType: client.documentType,
            documentNumber: client.documentNumber,
            maskedEmail,
          },
        },
      });
    }

    return NextResponse.json({
      status: 'success',
      data: { found: false, message: 'Cliente no encontrado en el sistema' },
    });
  } catch (error) {
    console.error('validate-document error:', error);
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }] },
      { status: 500 }
    );
  }
}
