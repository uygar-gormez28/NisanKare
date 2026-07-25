import { NextResponse } from 'next/server';
import { createResumableUploadSession } from '@/lib/googleDrive';
import { UploadSessionRequest } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body: UploadSessionRequest = await request.json();
    const { filename, mimeType, fileSize } = body;

    if (!filename || !mimeType || !fileSize) {
      return NextResponse.json(
        { success: false, error: 'Eksik parametreler (filename, mimeType, fileSize gereklidir).' },
        { status: 400 }
      );
    }

    // Basic MIME type validation
    const allowedMimePrefixes = ['image/'];
    const isImage = allowedMimePrefixes.some((prefix) => mimeType.toLowerCase().startsWith(prefix));

    if (!isImage) {
      return NextResponse.json(
        { success: false, error: 'Yalnızca görsel dosyaları (JPG, PNG, HEIC vb.) yüklenebilir.' },
        { status: 400 }
      );
    }

    // 50MB per file upper sanity limit
    if (fileSize > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Dosya boyutu çok yüksek (maksimum 50MB tekil dosya sınırı).' },
        { status: 400 }
      );
    }

    const uploadUrl = await createResumableUploadSession(filename, mimeType, fileSize);

    return NextResponse.json({
      success: true,
      uploadUrl,
    });
  } catch (error: unknown) {
    console.error('Upload session creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Sunucu tarafında bilinmeyen bir hata oluştu.';

    return NextResponse.json(
      {
        success: false,
        error: `Yükleme oturumu başlatılamadı: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
