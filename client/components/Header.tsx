'use client';

import { ReactNode } from 'react';

interface StatusMessageProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  type = 'info',
}) => {
  if (!message) return null;

  const colorMap = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div className={`text-sm font-medium ${colorMap[type]} animate-in fade-in duration-200`}>
      {message}
    </div>
  );
};

interface HeaderProps {
  status: string;
  onReset: () => void;
  onResetDB: () => void;
  isClearing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  onReset,
  onResetDB,
  isClearing,
}) => {
  const statusType = status.includes('Error')
    ? 'error'
    : status.includes('successfully')
      ? 'success'
      : 'info';

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            DocuChat
          </h1>
          <p className="text-xs text-zinc-500">AI Document Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {status && <StatusMessage message={status} type={statusType} />}

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset conversation"
            className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onResetDB}
            disabled={isClearing}
            title="Clear all vectors from database"
            className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClearing ? 'Clearing...' : 'Clear DB'}
          </button>
        </div>
      </div>
    </header>
  );
};
