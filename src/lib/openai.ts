type GeminiMessage = {
  role: string;
  content: string;
};

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  return key;
}

async function requestGemini<T>(endpoint: string, body: unknown): Promise<T> {
  const apiKey = getGeminiApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${endpoint}?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message ?? JSON.stringify(data);
    throw new Error(`${response.status} ${message}`);
  }

  return data as T;
}

function buildGeminiPayload(messages: GeminiMessage[]) {
  const systemMessage = messages.find((message) => message.role === 'system');
  const historyMessages = messages.filter((message) => message.role !== 'system');

  return {
    ...(systemMessage
      ? {
          systemInstruction: {
            parts: [{ text: systemMessage.content }],
          },
        }
      : {}),
    contents: historyMessages.length > 0
      ? historyMessages.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        }))
      : [{ role: 'user', parts: [{ text: '' }] }],
  };
}

export function getOpenAI() {
  return {
    chat: {
      completions: {
        create: async (payload: { model: string; messages: GeminiMessage[] }) => {
          const data = await requestGemini<any>('gemini-2.5-flash:generateContent', {
            ...buildGeminiPayload(payload.messages),
            generationConfig: { temperature: 0.7 },
          });

          const reply = data?.candidates?.[0]?.content?.parts
            ?.map((part: { text?: string }) => part?.text ?? '')
            .join('')
            .trim();

          if (!reply) {
            throw new Error('Gemini returned an empty response.');
          }

          return {
            choices: [{ message: { content: reply } }],
          };
        },
      },
    },
    embeddings: {
      create: async (payload: { model: string; input: string | string[] }) => {
        const inputText = Array.isArray(payload.input) ? payload.input.join('\n') : payload.input;
        const data = await requestGemini<any>('text-embedding-004:embedContent', {
          model: 'models/text-embedding-004',
          content: { parts: [{ text: inputText }] },
        });

        const values = data?.embedding?.values ?? [];
        if (!Array.isArray(values) || values.length === 0) {
          throw new Error('Gemini embedding response was empty.');
        }

        return {
          data: [{ embedding: values }],
        };
      },
    },
  };
}
