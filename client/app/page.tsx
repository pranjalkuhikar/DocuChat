"use client";

import { useEffect, useState } from "react";
import {
  Header,
  Sidebar,
  FileUpload,
  URLAnalyzer,
  MessageList,
  ChatInput,
} from "@/components";
import { useChat, useDocumentUpload, useScrollToBottom } from "@/hooks";
import { apiService } from "@/services/api";

export default function Home() {
  const [status, setStatus] = useState("");
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [input, setInput] = useState("");

  const { messages, isChatting, sendMessage, addMessage, resetMessages } =
    useChat();
  const { isUploading, error, uploadPDF, processURL, clearError } =
    useDocumentUpload();
  const { messagesEndRef, scrollToBottom } = useScrollToBottom();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatting, scrollToBottom]);

  const handleFileUpload = async (file: File) => {
    clearError();
    setStatus("Uploading PDF...");
    const result = await uploadPDF(file);

    if (result.success) {
      setStatus("PDF processed successfully! ✅");
      setActiveDoc(file.name);
      addMessage(
        "assistant",
        `I've analyzed the PDF: **${file.name}**. You can now ask questions about it!`,
      );
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    clearError();
    setStatus("Analyzing URL...");
    const result = await processURL(url);

    if (result.success) {
      setStatus("URL processed successfully! ✅");
      setActiveDoc(url);
      addMessage(
        "assistant",
        `I've analyzed the content from: **${url}**. You can now ask questions about it!`,
      );
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatting) return;

    const userMessage = input.trim();
    setInput("");
    const result = await sendMessage(userMessage);

    if (!result.success) {
      setStatus(`Error: ${result.error}`);
    }
  };

  const handleResetSession = () => {
    resetMessages();
    setActiveDoc(null);
    setStatus("");
    setInput("");
  };

  const handleResetDB = async () => {
    if (!confirm("Delete all vectors from Pinecone? This cannot be undone.")) {
      return;
    }

    setIsClearing(true);
    setStatus("Clearing database...");

    try {
      await apiService.clearDatabase();
      setStatus("Database cleared ✅");
      handleResetSession();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Failed to clear database"}`,
      );
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header
        status={status}
        onReset={handleResetSession}
        onResetDB={handleResetDB}
        isClearing={isClearing}
      />

      <main className="flex-1 flex overflow-hidden">
        <Sidebar activeDoc={activeDoc}>
          <FileUpload
            onFileSelect={handleFileUpload}
            isLoading={isUploading}
            error={error}
          />

          <URLAnalyzer
            onSubmit={handleUrlSubmit}
            isLoading={isUploading}
            error={error}
          />
        </Sidebar>

        <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950">
          <MessageList
            messages={messages}
            isLoading={isChatting}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSendMessage}
            isDisabled={isChatting || isUploading}
          />
        </div>
      </main>
    </div>
  );
}
