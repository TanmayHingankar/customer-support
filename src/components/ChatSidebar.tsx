'use client';

import { MessageSquarePlus, Search } from 'lucide-react';

type ConversationSummary = {
  _id: string;
  title: string;
  lastMessage: string;
  rating: number | null;
  createdAt: string;
};

type ChatSidebarProps = {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
};

export default function ChatSidebar({ conversations, selectedId, onSelectConversation, onNewChat }: ChatSidebarProps) {
  return (
    <aside className="glass-panel flex h-full min-h-[calc(100vh-88px)] w-full flex-col gap-4 p-4 md:w-80">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Workspace</p>
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
        </div>
        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3.5 py-2 text-sm font-medium text-white transition hover:scale-[1.02]"
        >
          <MessageSquarePlus className="h-4 w-4" /> New
        </button>
      </div>

      <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-400">
        <Search className="h-4 w-4" />
        <input className="w-full bg-transparent outline-none placeholder:text-zinc-500" placeholder="Search" />
      </label>

      <div className="flex-1 space-y-3 overflow-y-auto px-1">
        {conversations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
            No conversations yet. Start by asking a question.
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              type="button"
              key={conversation._id}
              onClick={() => onSelectConversation(conversation._id)}
              className={`w-full rounded-3xl border p-4 text-left transition-all duration-300 ${
                selectedId === conversation._id
                  ? 'border-violet-400/50 bg-violet-500/10 shadow-[0_10px_35px_rgba(139,92,246,0.18)]'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="font-semibold text-white">{conversation.title}</div>
              <div className="mt-2 line-clamp-2 text-sm text-zinc-400">{conversation.lastMessage}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <span>{new Date(conversation.createdAt).toLocaleString()}</span>
                <span>{conversation.rating ? `Rating: ${conversation.rating}` : 'Pending'}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
