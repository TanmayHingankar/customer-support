'use client';

import { useState } from 'react';
import { FileUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!file) {
      setError('Please select a PDF file first.');
      toast.error('Please select a PDF file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed.');
      }
      setMessage(data.message || 'PDF processed successfully.');
      toast.success(data.message || 'PDF processed successfully.');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Upload failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <FileUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Knowledge base</p>
              <h1 className="text-3xl font-semibold text-white">Upload PDF for RAG</h1>
            </div>
          </div>
          <p className="text-zinc-400">Upload a PDF document so the AI can answer questions using its content.</p>

          <form onSubmit={handleUpload} className="mt-8 space-y-6">
            <label className="block">
              <span className="mb-3 block text-sm font-medium text-zinc-300">PDF File</span>
              <div className="rounded-[28px] border border-dashed border-violet-400/25 bg-zinc-950/60 p-6 text-center transition hover:border-violet-400/45">
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-violet-300" />
                <p className="text-sm text-zinc-300">Drag & drop your document here or click to browse</p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="mt-4 block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 via-violet-600 to-fuchsia-500 px-6 py-3 font-medium text-white shadow-[0_12px_40px_rgba(139,92,246,0.35)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Uploading…' : 'Upload PDF'}
            </button>

            {message && <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</p>}
            {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
