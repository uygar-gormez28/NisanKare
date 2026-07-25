import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// Disable body parser limits for Next.js route if needed, 3MB chunks are small enough
export const maxDuration = 60; // 60 seconds max execution per chunk

export async function POST(request: Request) {
  try {
    const uploadUrl = request.headers.get('x-upload-url');
    const contentRange = request.headers.get('content-range');
    const contentType = request.headers.get('content-type') || 'image/jpeg';

    if (!uploadUrl || !contentRange) {
      return NextResponse.json(
        { success: false, error: 'Eksik header bilgileri (x-upload-url ve content-range gereklidir).' },
        { status: 400 }
      );
    }

    // Read chunk arrayBuffer from incoming request
    const chunkBuffer = await request.arrayBuffer();

    // Forward chunk to Google Drive Resumable Upload Session URL
    const googleResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Content-Range': contentRange,
      },
      body: chunkBuffer,
    });

    // Google Drive returns 308 for incomplete uploads, 200/201 for complete
    if (googleResponse.status === 308 || googleResponse.status === 200 || googleResponse.status === 201) {
      return NextResponse.json({
        success: true,
        status: googleResponse.status,
        completed: googleResponse.status === 200 || googleResponse.status === 201,
      });
    }

    const errorText = await googleResponse.text();
    console.error(`Google Drive chunk upload error (${googleResponse.status}):`, errorText);

    return NextResponse.json(
      {
        success: false,
        error: `Google Drive yükleme hatası (${googleResponse.status}): ${googleResponse.statusText}`,
      },
      { status: googleResponse.status }
    );
  } catch (error: unknown) {
    console.error('Upload chunk error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen sunucu hatası';
    return NextResponse.json(
      { success: false, error: `Parça yüklenirken sunucu hatası: ${errorMessage}` },
      { status: 500 }
    );
  }
}
