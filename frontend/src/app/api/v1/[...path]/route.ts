import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function proxyRequest(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const url = `${BACKEND_URL}${path}${req.nextUrl.search}`;

  const headers: Record<string, string> = {};
  
  const contentType = req.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;
  
  const auth = req.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      try {
        const body = await req.text();
        if (body) fetchOptions.body = body;
      } catch { /* no body */ }
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
    });
  } catch {
    return NextResponse.json(
      { status: 'error', errors: [{ message: 'Backend unavailable', code: 'BACKEND_ERROR' }] },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) { return proxyRequest(req); }
export async function POST(req: NextRequest) { return proxyRequest(req); }
export async function PUT(req: NextRequest) { return proxyRequest(req); }
export async function PATCH(req: NextRequest) { return proxyRequest(req); }
export async function DELETE(req: NextRequest) { return proxyRequest(req); }
