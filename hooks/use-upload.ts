import { useState, useCallback } from 'react';
import { uploadService } from '@/services';
import { toast } from 'sonner';

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface UseUploadReturn extends UploadState {
  uploadFile: (file: File) => Promise<{ key: string; success: boolean }>;
  reset: () => void;
}

export function useUpload(): UseUploadReturn {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const uploadFile = useCallback(async (file: File): Promise<{ key: string; success: boolean }> => {
    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > maxSize) {
      const error = 'File size must be less than 10MB';
      setState(prev => ({ ...prev, error }));
      toast.error(error);
      throw new Error(error);
    }

    if (!allowedTypes.includes(file.type)) {
      const error = 'Only JPEG, PNG, WebP, and GIF files are allowed';
      setState(prev => ({ ...prev, error }));
      toast.error(error);
      throw new Error(error);
    }

    setState({
      isUploading: true,
      progress: 0,
      error: null,
    });

    try {
      const result = await uploadService.uploadFile(file, (progress) => {
        setState(prev => ({ ...prev, progress }));
      });

      setState({
        isUploading: false,
        progress: 100,
        error: null,
      });

      toast.success('File uploaded successfully!');
      
      return {
        key: result.file_info.key,
        success: true,
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Upload failed';
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
    });
  }, []);

  return {
    ...state,
    uploadFile,
    reset,
  };
}
