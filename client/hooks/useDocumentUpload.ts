import { useState, useCallback } from 'react';
import { apiService, ApiError } from '@/services/api';
import { FILE_LIMITS } from '@/config/api';

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!file) return 'No file selected';

    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed';
    }

    if (file.size > FILE_LIMITS.MAX_SIZE_BYTES) {
      return `File size exceeds ${FILE_LIMITS.MAX_SIZE_MB}MB limit`;
    }

    return null;
  }, []);

  const uploadPDF = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return { success: false, error: validationError };
      }

      setIsUploading(true);
      try {
        const response = await apiService.uploadPDF(file);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to upload PDF';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile],
  );

  const processURL = useCallback(async (url: string) => {
    setError(null);

    if (!url) {
      setError('URL is required');
      return { success: false, error: 'URL is required' };
    }

    setIsUploading(true);
    try {
      const response = await apiService.processURL(url);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Failed to process URL';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isUploading,
    error,
    uploadPDF,
    processURL,
    clearError,
  };
};
