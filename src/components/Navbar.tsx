'use client';

import Link from 'next/link';
import { Bell, Brain, ChartColumn, FileText, LogOut, MessageSquareText, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/chat" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_10px_30px_rgba(139,92,246,0.35)]">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-300">Northstar AI</p>
            <p className="text-base font-semibold text-white">Customer Support</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-2 text-sm text-zinc-300 md:flex">
          <Link href="/chat" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">
            <MessageSquareText className="h-4 w-4" /> Chat
          </Link>
          <Link href="/analytics" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">
            <ChartColumn className="h-4 w-4" /> Analytics
          </Link>
          <Link href="/upload" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white">
            <FileText className="h-4 w-4" /> Upload PDF
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button type="button" className="rounded-full border border-white/10 bg-white/10 p-2.5 text-zinc-300 transition hover:bg-white/15 hover:text-white">
            <Bell className="h-4 w-4" />
          </button>
          {!loading && !user && (
            <Link href="/login" className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02]">
              Sign in
            </Link>
          )}
          {!loading && user && (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
                {user.name?.[0] || 'U'}
              </div>
              <button type="button" onClick={logout} className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
