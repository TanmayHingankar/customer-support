import { NextResponse } from 'next/server';
import Conversation, { getConversationModel } from '@/models/Conversation';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const auth = verifyAuth(request);
    const body = await request.json();
    const { conversationId, rating } = body;

    if (!conversationId || !rating) {
      return NextResponse.json({ success: false, error: 'Conversation ID and rating are required.' }, { status: 400 });
    }

    const numericRating = rating === 'helpful' ? 5 : rating === 'not_helpful' ? 1 : null;
    if (!numericRating) {
      return NextResponse.json({ success: false, error: 'Invalid rating value.' }, { status: 400 });
    }

    const ConversationModel = await getConversationModel();
    const updated = await ConversationModel.findOneAndUpdate(
      { _id: conversationId, userId: auth.userId },
      { rating: numericRating },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Conversation not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Unable to save rating.' }, { status: 500 });
  }
}
