/**
 * Venice AI API Client
 * OpenAI-compatible interface for Venice's chat, TTS, and web search endpoints
 */

const VENICE_API_KEY = process.env.VENICE_API_KEY;
const VENICE_API_BASE = process.env.VENICE_API_BASE || 'https://api.venice.ai/api/v1';

if (!VENICE_API_KEY) {
  console.warn('⚠️  VENICE_API_KEY not set. Set it in .env.local');
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: 'none' | 'low' | 'medium' | 'high';
  responseFormat?: { type: 'json_schema'; json_schema?: object };
  enableWebSearch?: boolean;
  stream?: boolean;
}

export interface ChatResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
      reasoning_content?: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface StreamChunk {
  id: string;
  model: string;
  choices: Array<{
    delta: {
      role?: string;
      content?: string;
      reasoning_content?: string;
    };
    finish_reason?: string;
  }>;
}

export interface TTSOptions {
  model: string;
  input: string;
  voice: string;
  speed?: number;
}

/**
 * Non-streaming chat completion
 */
export async function veniceChat(options: ChatOptions): Promise<ChatResponse> {
  const body: Record<string, unknown> = {
    model: options.model,
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4000,
  };

  if (options.reasoningEffort) body.reasoning_effort = options.reasoningEffort;
  if (options.responseFormat) body.response_format = options.responseFormat;
  if (options.enableWebSearch) body.venice_parameters = { enable_web_search: 'on' };

  const response = await fetch(`${VENICE_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VENICE_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Venice API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Streaming chat completion — returns async iterator of chunks
 */
export async function* veniceChatStream(
  options: ChatOptions
): AsyncGenerator<StreamChunk> {
  const body: Record<string, unknown> = {
    model: options.model,
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4000,
    stream: true,
  };

  if (options.reasoningEffort) body.reasoning_effort = options.reasoningEffort;
  if (options.responseFormat) body.response_format = options.responseFormat;
  if (options.enableWebSearch) body.venice_parameters = { enable_web_search: 'on' };

  const response = await fetch(`${VENICE_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VENICE_API_KEY}`,
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Venice API error (${response.status}): ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            yield JSON.parse(data);
          } catch {
            // skip malformed chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Text-to-Speech — returns audio blob URL
 */
export async function veniceTTS(options: TTSOptions): Promise<ArrayBuffer> {
  const response = await fetch(`${VENICE_API_BASE}/audio/speech`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VENICE_API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model,
      input: options.input,
      voice: options.voice,
      speed: options.speed ?? 1.0,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Venice TTS error (${response.status}): ${errorText}`);
  }

  return response.arrayBuffer();
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
}
