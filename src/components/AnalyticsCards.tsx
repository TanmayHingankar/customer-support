'use client';

import { BarChart3, MessageSquareText, Star, ThumbsUpDown } from 'lucide-react';

type AnalyticsData = {
  totalConversations: number;
  averageRating: number;
  positiveCount: number;
  negativeCount: number;
};

const cards = [
  { title: 'Total conversations', value: (data: AnalyticsData) => data.totalConversations, icon: MessageSquareText },
  { title: 'Average rating', value: (data: AnalyticsData) => data.averageRating.toFixed(1), icon: Star },
  { title: 'Positive ratings', value: (data: AnalyticsData) => data.positiveCount, icon: ThumbsUpDown },
  { title: 'Negative ratings', value: (data: AnalyticsData) => data.negativeCount, icon: BarChart3 },
];

export default function AnalyticsCards({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="glass-panel p-6 transition hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">{card.title}</p>
              <div className="rounded-2xl bg-violet-500/15 p-2 text-violet-300">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">{card.value(data)}</p>
            <p className="mt-2 text-sm text-zinc-400">{index === 0 ? 'Live support volume' : index === 1 ? 'Customer satisfaction' : 'Feedback trends'}</p>
          </div>
        );
      })}
    </div>
  );
}
