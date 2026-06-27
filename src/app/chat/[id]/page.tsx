'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';

type ConversationSummary = {
  _id: string;
  title: string;
  lastMessage: string;
  rating: number | null;
  createdAt: string;
};

export default function ChatConversationPage({ params }: { params: { id: string } }) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(params.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat/history');
      if (!res.ok) {
        throw new Error('Unable to load conversation history.');
      }
      const history = await res.json();
      setConversations(history);
      if (!params.id && history.length > 0) {
        setSelectedId(history[0]._id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <ChatSidebar
            conversations={conversations}
            selectedId={selectedId}
            onSelectConversation={setSelectedId}
            onNewChat={() => setSelectedId(null)}
          />
          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-soft">
                Loading conversations...
              </div>
            ) : (
              <ChatWindow
                conversationId={selectedId}
                onConversationUpdated={loadHistory}
                onConversationCreated={setSelectedId}
              />
            )}
            {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
