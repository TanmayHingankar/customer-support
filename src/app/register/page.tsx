'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <div className="glass-panel relative w-full max-w-md p-8 sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-300">Northstar AI</p>
            <h1 className="text-2xl font-semibold text-white">Create account</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              placeholder="Alex Morgan"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
              placeholder="you@company.com"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 pr-12 text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 via-violet-600 to-fuchsia-500 px-4 py-3 font-medium text-white shadow-[0_12px_40px_rgba(139,92,246,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(139,92,246,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-violet-300 transition hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
