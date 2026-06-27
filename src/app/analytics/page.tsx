'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Gauge, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AnalyticsCards from '@/components/AnalyticsCards';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalConversations: 0,
    averageRating: 0,
    positiveCount: 0,
    negativeCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) {
          throw new Error('Unable to load analytics data.');
        }
        const data = await res.json();
        setStats(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Analytics load failed.');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel p-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Performance</p>
              <h1 className="text-3xl font-semibold text-white">Analytics Dashboard</h1>
              <p className="mt-2 text-zinc-400">Monitor overall conversation volume and response quality.</p>
            </div>
            <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">Realtime insights</div>
          </div>
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-zinc-400">
              Loading analytics...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
          ) : (
            <div className="space-y-6">
              <AnalyticsCards data={stats} />
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-violet-300" />
                    <h2 className="text-lg font-semibold text-white">Weekly activity</h2>
                  </div>
                  <div className="flex h-40 items-end gap-3 rounded-3xl border border-white/10 bg-zinc-950/50 p-4">
                    {[44, 68, 54, 76, 82, 90, 96].map((value, index) => (
                      <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-violet-600 to-fuchsia-500" style={{ height: `${value}%` }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-violet-300" />
                    <h2 className="text-lg font-semibold text-white">Response quality</h2>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-zinc-950/50 p-8">
                    <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl font-semibold text-white">
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <p className="text-sm text-zinc-400">Average customer rating</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
