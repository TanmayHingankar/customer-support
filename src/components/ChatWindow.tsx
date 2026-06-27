'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, SendHorizonal, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import MessageBubble from '@/components/MessageBubble';

type MessageRecord = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

type ChatWindowProps = {
  conversationId: string | null;
  onConversationUpdated: () => void;
  onConversationCreated: (conversationId: string) => void;
};

export default function ChatWindow({ conversationId, onConversationUpdated, onConversationCreated }: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState<string | null>(null);

  useEffect(() => {
    async function loadConversation() {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      try {
        const res = await fetch(`/api/chat/${conversationId}`, { credentials: 'same-origin' });
        if (!res.ok) {
          throw new Error('Unable to load conversation.');
        }
        const data = await res.json();
        setMessages(data.messages.map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp).toISOString(),
        })));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Conversation load failed.');
      }
    }

    loadConversation();
  }, [conversationId]);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, conversationId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        const errMsg = data.error || data.details || data.raw || 'Message failed to send.';
        throw new Error(errMsg);
      }

      const nextConversationId = data.conversationId;
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: input, timestamp: new Date().toISOString() },
        { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() },
      ]);
      setInput('');
      onConversationUpdated();
      toast.success('Response delivered');
      if (nextConversationId && nextConversationId !== conversationId) {
        onConversationCreated(nextConversationId);
        window.history.replaceState({}, '', `/chat/${nextConversationId}`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unable to send message.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (value: 'helpful' | 'not_helpful') => {
    if (!conversationId) return;
    try {
      const res = await fetch('/api/chat/rating', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, rating: value }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to save rating');
      }
      setRating(value);
      onConversationUpdated();
      toast.success('Feedback saved');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Rating failed.';
      setError(msg);
      toast.error(msg);
    }
  };

  const lastAssistantMessage = useMemo(
    () => messages.slice().reverse().find((msg) => msg.role === 'assistant'),
    [messages]
  );

  return (
    <div className="glass-panel flex min-h-[calc(100vh-88px)] flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Live workspace</p>
          <h1 className="text-2xl font-semibold text-white">AI Support Chat</h1>
        </div>
        <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-200">
          Gemini 2.5 Flash
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-[28px] border border-white/10 bg-zinc-950/50 p-6 shadow-inner">
        {messages.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center text-center text-zinc-400">
            <div>
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-violet-300" />
              <p className="text-lg text-white">Start a new conversation</p>
              <p className="mt-2 text-sm">Ask your first support question to begin.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageBubble key={`${message.role}-${index}-${message.timestamp}`} role={message.role} content={message.content} />
            ))}
          </div>
        )}
      </div>

      {lastAssistantMessage && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
            <span>Rate the latest AI response</span>
            {rating && <span className="font-semibold text-white">Rated: {rating === 'helpful' ? 'Helpful' : 'Not Helpful'}</span>}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => handleRating('helpful')} className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25">
              <ThumbsUp className="h-4 w-4" /> Helpful
            </button>
            <button type="button" onClick={() => handleRating('not_helpful')} className="flex items-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/25">
              <ThumbsDown className="h-4 w-4" /> Not helpful
            </button>
          </div>
        </div>
      )}

      {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

      <form onSubmit={handleSend} className="rounded-[28px] border border-white/10 bg-zinc-950/70 p-4">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          placeholder="Ask your support question here..."
          required
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-zinc-400">Secure reply • Auto-saved to your history</span>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><SendHorizonal className="h-4 w-4" /> Send Message</>}
          </button>
        </div>
      </form>
    </div>
  );
}
