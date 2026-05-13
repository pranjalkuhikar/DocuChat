'use client';

import { useState } from 'react';

interface URLAnalyzerProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const URLAnalyzer: React.FC<URLAnalyzerProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onSubmit(url);
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Analyze URL
      </h2>
      <div className="space-y-2">
        <input
          type="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400 dark:placeholder-zinc-500 disabled:opacity-50 transition-all"
          aria-label="Enter URL to analyze"
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {isLoading ? 'Analyzing...' : 'Analyze URL'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  );
};
