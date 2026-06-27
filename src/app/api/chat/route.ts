import { NextResponse } from 'next/server';
import Conversation, { getConversationModel } from '@/models/Conversation';
import { verifyAuth } from '@/lib/auth';
import { getOpenAI } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const auth = verifyAuth(request);
    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const ConversationModel = await getConversationModel();
    let conversation;

    if (conversationId) {
      conversation = await ConversationModel.findOne({ _id: conversationId, userId: auth.userId });
    }

    if (!conversation) {
      conversation = new ConversationModel({ userId: auth.userId, messages: [], rating: null });
    }

    conversation.messages.push({ role: 'user', content: message, timestamp: new Date() });

    const historyMessages = conversation.messages.slice(-20).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Allow a development-only local reply for debugging (skip OpenAI call)
    // debugLocal bypass is allowed for local testing
    const debugLocalHeader = request.headers.get('x-debug-local-reply');
    console.log('chat route debug header:', debugLocalHeader);
    try {
      console.log('chat route header keys:', Array.from(request.headers.keys()).join(','));
    } catch (e) {
      console.log('chat route: failed to list headers', e);
    }
    const debugLocal = debugLocalHeader === '1';
    let reply: string;
    if (debugLocal) {
      reply = 'Debug reply: Gemini call skipped (development mode).';
    } else {
      const response = await getOpenAI().chat.completions.create({
        model: 'gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful customer support assistant. Answer concisely and professionally.',
          },
          ...historyMessages,
        ],
      });

      reply = response.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response at this time.';
    }
    conversation.messages.push({ role: 'assistant', content: reply, timestamp: new Date() });

    if (!conversation.title && conversation.messages.length > 0) {
      const firstUserMessage = conversation.messages.find((item) => item.role === 'user');
      conversation.title = firstUserMessage?.content.slice(0, 50).trim() ?? 'Support conversation';
    }

    await conversation.save();

    return NextResponse.json({ reply, conversationId: conversation._id.toString() });
  } catch (error) {
    console.error('Chat POST error:', error);
    const message = error instanceof Error ? error.message : JSON.stringify(error);

    // Try to extract an HTTP status code prefix from the error message (e.g. "429 ...")
    let status = 500;
    let clientMessage = message;
    const m = typeof message === 'string' ? message.match(/^(\d{3})\s+([\s\S]*)$/) : null;
    if (m) {
      status = parseInt(m[1], 10) || 500;
      clientMessage = m[2].trim();
    }

    return NextResponse.json(
      { error: clientMessage || 'Chat request failed.', raw: message },
      { status }
    );
  }
}
