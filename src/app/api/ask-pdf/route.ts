import { NextResponse } from 'next/server';
import { queryPdf } from '@/lib/rag';
import { getOpenAI } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ success: false, error: 'Question is required.' }, { status: 400 });
    }

    const results = await queryPdf(question);
    if (results.length === 0) {
      return NextResponse.json({ success: false, error: 'No PDF context available. Upload a document first.' }, { status: 404 });
    }

    const contextText = results.map((item) => item.text).join('\n\n');
    const response = await getOpenAI().chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that answers questions from document context.',
        },
        {
          role: 'user',
          content: `Use the following context from the uploaded PDF to answer the question. Context:\n${contextText}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = response.choices?.[0]?.message?.content?.trim() ?? 'Unable to generate an answer from the document content.';
    return NextResponse.json({ success: true, answer });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to answer question from PDF.' }, { status: 500 });
  }
}
