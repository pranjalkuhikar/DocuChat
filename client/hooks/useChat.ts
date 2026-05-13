import { useState, useCallback } from 'react';
import { Message } from '@/types';
import { apiService, ApiError } from '@/services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your document assistant. Upload a PDF or provide a URL to get started.",
    },
  ]);
  const [isChatting, setIsChatting] = useState(false);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      addMessage('user', userMessage);
      setIsChatting(true);

      try {
        const response = await apiService.sendMessage(userMessage);
        addMessage('assistant', response.response);
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'Failed to send message';
        addMessage('assistant', `Error: ${errorMessage}`);
        return { success: false, error: errorMessage };
      } finally {
        setIsChatting(false);
      }
    },
    [addMessage],
  );

  const resetMessages = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Session reset. Upload a new document to begin.',
      },
    ]);
  }, []);

  return {
    messages,
    isChatting,
    sendMessage,
    addMessage,
    resetMessages,
  };
};
