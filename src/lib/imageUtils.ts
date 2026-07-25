import { SelectedFile } from './types';

/**
 * Formats file size in bytes to human-readable format (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Checks if a file is HEIC/HEIF format (common on iPhones)
 */
export function isHeicFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  return (
    fileName.endsWith('.heic') ||
    fileName.endsWith('.heif') ||
    fileType === 'image/heic' ||
    fileType === 'image/heif'
  );
}

/**
 * Converts HEIC/HEIF images to JPEG using heic2any on client side if needed
 */
export async function convertHeicIfNeeded(selectedFile: SelectedFile): Promise<SelectedFile> {
  if (!isHeicFile(selectedFile.file)) {
    return selectedFile;
  }

  try {
    const heic2anyModule = (await import('heic2any')).default;
    const convertedBlob = await heic2anyModule({
      blob: selectedFile.file,
      toType: 'image/jpeg',
      quality: 0.9,
    });

    const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    const newFileName = selectedFile.name.replace(/\.(heic|heif)$/i, '.jpg');

    const convertedFile = new File([resultBlob], newFileName, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    if (selectedFile.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(convertedFile);

    return {
      ...selectedFile,
      file: convertedFile,
      name: convertedFile.name,
      size: convertedFile.size,
      type: 'image/jpeg',
      previewUrl: newPreviewUrl,
      heicConverted: true,
    };
  } catch (error) {
    console.warn('HEIC conversion failed, using original file:', error);
    return selectedFile;
  }
}

/**
 * Chunked Upload helper with automatic retry for mobile networks.
 * Uses 1MB chunks (exact multiple of 256KB) for maximum stability on cellular 3G/4G/5G connections.
 */
export async function uploadFileDirectToDrive(
  file: File,
  uploadUrl: string,
  onProgress: (percent: number) => void
): Promise<void> {
  const CHUNK_SIZE = 1024 * 1024; // 1 MB per chunk (1,048,576 bytes = 4 * 256 KB)
  const totalSize = file.size;
  let start = 0;

  onProgress(5);

  while (start < totalSize) {
    const end = Math.min(start + CHUNK_SIZE, totalSize);
    const chunk = file.slice(start, end);
    const contentRange = `bytes ${start}-${end - 1}/${totalSize}`;

    let success = false;
    let attempts = 0;
    let lastError = '';

    // Automatic retry up to 3 times per chunk in case of mobile network stutters
    while (!success && attempts < 3) {
      attempts++;
      try {
        const res = await fetch('/api/upload-chunk', {
          method: 'POST',
          headers: {
            'x-upload-url': uploadUrl,
            'content-range': contentRange,
            'content-type': file.type || 'image/jpeg',
          },
          body: chunk,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Yükleme hatası (HTTP ${res.status})`);
        }

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Parça yükleme başarısız oldu.');
        }

        success = true;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : 'Ağ hatası';
        if (lastError.includes('Failed to fetch')) {
          lastError = 'Mobil internet bağlantısı anlık olarak kesildi. Yeniden deneniyor...';
        }
        
        if (attempts < 3) {
          // Wait 1 second before retrying chunk
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    if (!success) {
      throw new Error(`Bağlantı hatası: ${lastError}`);
    }

    start = end;
    const progressPercent = Math.min(Math.round((start / totalSize) * 100), 100);
    onProgress(progressPercent);
  }
}
