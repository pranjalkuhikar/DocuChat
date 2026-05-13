export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  message: string;
  fileName: string;
}

export interface ChatResponse {
  response: string;
}

export interface UrlResponse {
  message: string;
  url: string;
}
