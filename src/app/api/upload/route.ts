import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { storePdfChunks } from '@/lib/rag';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No PDF file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);
    const text = data.text || '';

    if (!text.trim()) {
      return NextResponse.json({ success: false, error: 'Uploaded PDF contains no readable text.' }, { status: 400 });
    }

    await storePdfChunks([{ text, source: 'uploaded-pdf' }]);

    return NextResponse.json({ success: true, message: 'PDF uploaded and processed successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process uploaded PDF.' }, { status: 500 });
  }
}
