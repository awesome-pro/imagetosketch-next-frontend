import { api } from "@/lib/api";

export interface PresignedUrlResponse {
  presigned_url: string;
  key: string;
  file_url: string;
  expires_in: number;
}

export interface UploadConfirmResponse {
  success: boolean;
  message: string;
  file_info: {
    key: string;
    size: number;
    etag: string;
    last_modified: string;
    content_type: string;
  };
}

export interface DownloadUrlResponse {
  download_url: string;
  key: string;
  expires_in: number;
}

const uploadService = {
  /**
   * Get presigned URL for direct S3 upload
   */
  getPresignedUrl: async (filename: string, contentType: string): Promise<PresignedUrlResponse> => {
    const response = await api.post<PresignedUrlResponse>('/upload/presigned-url', null, {
      params: {
        filename,
        content_type: contentType,
      },
    });
    return response.data;
  },

  /**
   * Upload file directly to S3 using presigned URL
   */
  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  },

  /**
   * Confirm upload completion
   */
  confirmUpload: async (key: string, etag?: string): Promise<UploadConfirmResponse> => {
    const response = await api.post<UploadConfirmResponse>('/upload/confirm', null, {
      params: {
        key,
        etag,
      },
    });
    return response.data;
  },

  /**
   * Get download URL for a file
   */
  getDownloadUrl: async (key: string): Promise<DownloadUrlResponse> => {
    const response = await api.get<DownloadUrlResponse>(`/upload/download-url/${encodeURIComponent(key)}`);
    return response.data;
  },

  /**
   * Complete upload flow: get presigned URL, upload to S3, and confirm
   */
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<UploadConfirmResponse> => {
    try {
      onProgress?.(10);
      
      // Step 1: Get presigned URL
      const presignedData = await uploadService.getPresignedUrl(file.name, file.type);
      onProgress?.(30);
      
      // Step 2: Upload to S3
      await uploadService.uploadToS3(presignedData.presigned_url, file);
      onProgress?.(80);
      
      // Step 3: Confirm upload
      const confirmData = await uploadService.confirmUpload(presignedData.key);
      onProgress?.(100);
      
      return confirmData;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  },
};

export default uploadService;
