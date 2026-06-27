import { getOpenAI } from '@/lib/openai';

declare global {
  var ragStore: {
    chunks: Array<{
      id: string;
      text: string;
      embedding: number[];
      source: string;
      createdAt: Date;
    }>;
  };
}

const store = globalThis.ragStore || { chunks: [] };
globalThis.ragStore = store;

type AddChunk = { text: string; source: string };

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function chunkText(text: string, chunkSize = 500, overlap = 100) {
  const normalized = normalizeText(text);
  const chunks: string[] = [];

  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length);
    chunks.push(normalized.slice(start, end));
    if (end === normalized.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks.filter(Boolean);
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

export async function storePdfChunks(chunks: AddChunk[]) {
  for (const chunkData of chunks) {
    const contentChunks = chunkText(chunkData.text, 500, 100);
    for (const content of contentChunks) {
      const embeddingResult = await getOpenAI().embeddings.create({
        model: 'text-embedding-004',
        input: content,
      });
      const embedding = embeddingResult.data[0].embedding;
      store.chunks.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        text: content,
        embedding,
        source: chunkData.source,
        createdAt: new Date(),
      });
    }
  }

  return store.chunks.length;
}

export async function queryPdf(question: string, topK = 3) {
  const normalizedQuestion = normalizeText(question);
  const embeddingResult = await getOpenAI().embeddings.create({
    model: 'text-embedding-004',
    input: normalizedQuestion,
  });
  const questionEmbedding = embeddingResult.data[0].embedding;

  const scored = store.chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}
