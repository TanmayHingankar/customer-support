import { NextResponse } from 'next/server';
import Conversation, { getConversationModel } from '@/models/Conversation';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = verifyAuth(request);
    const ConversationModel = await getConversationModel();
    const conversation = await ConversationModel.findOne({ _id: params.id, userId: auth.userId }).lean();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json({ error: 'Unable to fetch conversation.' }, { status: 500 });
  }
}
