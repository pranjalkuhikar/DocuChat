"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your document assistant. Upload a PDF or provide a URL to get started." }
  ]);
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">DocuChat</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Documentation
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-full hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors">
            Connect Wallet
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Upload & URL */}
        <div className="w-1/3 border-r bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 flex flex-col gap-8 overflow-y-auto">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Upload Document</h2>
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-500 transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-800/50">
              <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Click to upload or drag and drop</p>
                <p className="text-xs text-zinc-500">PDF (MAX. 10MB)</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Analyze URL</h2>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://example.com/article"
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze URL
              </button>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t dark:border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              Powered by Gemini & LangChain
            </p>
          </div>
        </div>

        {/* Right Area - Chat Interface */}
        <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                      : "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 border dark:border-zinc-700"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center"
            >
              <input
                type="text"
                placeholder="Ask a question about your document..."
                className="w-full pl-4 pr-12 py-3 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
