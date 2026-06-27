import { NextResponse } from 'next/server';
import Conversation, { getConversationModel } from '@/models/Conversation';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const auth = verifyAuth(request);
    const ConversationModel = await getConversationModel();

    const conversations = await ConversationModel.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .lean();

    const history = conversations.map((conversation) => {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      return {
        _id: conversation._id.toString(),
        title: conversation.title || 'New conversation',
        lastMessage: lastMessage?.content.slice(0, 100) ?? '',
        rating: conversation.rating,
        createdAt: conversation.createdAt,
      };
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Could not load chat history.' }, { status: 500 });
  }
}
