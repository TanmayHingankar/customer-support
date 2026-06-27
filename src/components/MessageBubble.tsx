'use client';

import { Sparkles, UserRound } from 'lucide-react';

type MessageBubbleProps = {
  role: 'user' | 'assistant';
  content: string;
};

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  return (
    <div className={`flex ${role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] rounded-3xl border p-4 shadow-[0_16px_45px_rgba(0,0,0,0.25)] ${role === 'assistant' ? 'border-white/10 bg-white/10 text-zinc-100' : 'border-violet-400/30 bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-500 text-white'}`}>
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] opacity-80">
          {role === 'assistant' ? <Sparkles className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
          {role === 'assistant' ? 'Northstar AI' : 'You'}
        </div>
        <p className="whitespace-pre-wrap break-words text-sm leading-7">{content}</p>
      </div>
    </div>
  );
}
