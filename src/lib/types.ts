export interface SelectedFile {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
  status: 'idle' | 'preparing' | 'uploading' | 'completed' | 'error';
  progress: number; // 0 to 100
  errorMessage?: string;
  heicConverted?: boolean;
}

export interface UploadSessionRequest {
  filename: string;
  mimeType: string;
  fileSize: number;
}

export interface UploadSessionResponse {
  success: boolean;
  uploadUrl?: string;
  error?: string;
  fileId?: string;
}
