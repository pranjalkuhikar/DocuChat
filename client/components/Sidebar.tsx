'use client';

import { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
  activeDoc?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, activeDoc }) => {
  return (
    <aside className="w-96 border-r bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 flex flex-col gap-8 overflow-y-auto">
      {activeDoc && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Active Document
          </p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate mt-1">
            {activeDoc}
          </p>
        </div>
      )}

      {children}

      <div className="mt-auto pt-6 border-t dark:border-zinc-800">
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 font-medium">Powered by</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs rounded text-zinc-700 dark:text-zinc-300">
              Gemini
            </span>
            <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs rounded text-zinc-700 dark:text-zinc-300">
              LangChain
            </span>
            <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs rounded text-zinc-700 dark:text-zinc-300">
              Pinecone
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
