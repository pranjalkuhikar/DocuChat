export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  UPLOAD: `${API_URL}/api/upload`,
  URL: `${API_URL}/api/url`,
  CHAT: `${API_URL}/api/chat`,
  CLEAR: `${API_URL}/api/clear`,
} as const;

export const FILE_LIMITS = {
  MAX_SIZE_MB: 25,
  MAX_SIZE_BYTES: 25 * 1024 * 1024,
} as const;

export const MESSAGE_LIMITS = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 500,
} as const;
