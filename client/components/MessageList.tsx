"use client";

import ReactMarkdown from "react-markdown";
import { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-300`}
        >
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 border dark:border-zinc-700 shadow-sm"
            }`}
          >
            {msg.role === "user" ? (
              <p>{msg.content}</p>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 mb-2 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-4 mb-2 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  h1: ({ children }) => (
                    <h1 className="text-base font-bold mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-sm font-bold mb-1">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mb-1">{children}</h3>
                  ),
                  code: ({ children }) => (
                    <code className="bg-zinc-100 dark:bg-zinc-700 px-1 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic my-2">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl px-4 py-3 text-sm shadow-sm border dark:border-zinc-700">
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
