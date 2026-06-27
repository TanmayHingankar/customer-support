import { NextResponse } from 'next/server';
import Conversation, { getConversationModel } from '@/models/Conversation';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    verifyAuth(request);
    const ConversationModel = await getConversationModel();

    const stats = await ConversationModel.aggregate([
      {
        $facet: {
          totalConversations: [{ $count: 'count' }],
          ratedStats: [
            { $match: { rating: { $ne: null } } },
            {
              $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                positiveCount: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
                negativeCount: { $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] } },
              },
            },
          ],
        },
      },
    ]);

    const totalConversations = stats[0]?.totalConversations?.[0]?.count ?? 0;
    const ratedStats = stats[0]?.ratedStats?.[0] ?? { averageRating: 0, positiveCount: 0, negativeCount: 0 };

    return NextResponse.json({
      totalConversations,
      averageRating: Number((ratedStats.averageRating ?? 0).toFixed(2)),
      positiveCount: ratedStats.positiveCount,
      negativeCount: ratedStats.negativeCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to load analytics.' }, { status: 500 });
  }
}
