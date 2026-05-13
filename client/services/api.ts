import { API_ENDPOINTS } from '@/config/api';
import { ChatResponse, UploadResponse, UrlResponse } from '@/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(errorMessage, response.status);
  }

  return data;
};

export const apiService = {
  async uploadPDF(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(API_ENDPOINTS.UPLOAD, {
      method: 'POST',
      body: formData,
    });

    return handleResponse(response);
  },

  async processURL(url: string): Promise<UrlResponse> {
    const response = await fetch(API_ENDPOINTS.URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    return handleResponse(response);
  },

  async sendMessage(message: string): Promise<ChatResponse> {
    const response = await fetch(API_ENDPOINTS.CHAT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    return handleResponse(response);
  },

  async clearDatabase(): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.CLEAR, {
      method: 'DELETE',
    });

    return handleResponse(response);
  },
};
