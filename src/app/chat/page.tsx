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

export default function ChatPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat/history', { credentials: 'same-origin' });
      if (!res.ok) {
        throw new Error('Unable to load conversation history.');
      }
      const history = await res.json();
      setConversations(history);
      if (!selectedId && history.length > 0) {
        setSelectedId(history[0]._id);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleNewChat = () => {
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <ChatSidebar
            conversations={conversations}
            selectedId={selectedId}
            onSelectConversation={setSelectedId}
            onNewChat={handleNewChat}
          />
          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="glass-panel p-12 text-center text-zinc-400">
                Loading conversations...
              </div>
            ) : (
              <ChatWindow
                conversationId={selectedId}
                onConversationUpdated={loadHistory}
                onConversationCreated={setSelectedId}
              />
            )}
            {error && <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
