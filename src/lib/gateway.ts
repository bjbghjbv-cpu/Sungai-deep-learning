import "server-only";

const BASE_URL = process.env.RELINK_BASE_URL ?? "https://api.relink-gateway.biz.id/v1";
const API_KEY = process.env.RELINK_API_KEY ?? "";
const VISION_MODEL = process.env.VISION_MODEL ?? "gpt-5.6";
const LLM_MODEL = process.env.LLM_MODEL ?? "deepseek-v4-pro";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
}

interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  json?: boolean;
  maxTokens?: number;
}

async function chat(options: ChatOptions): Promise<string> {
  if (!API_KEY) {
    throw new Error("RELINK_API_KEY belum diatur di .env");
  }

  const body: Record<string, unknown> = {
    model: options.model ?? LLM_MODEL,
    messages: options.messages,
    temperature: options.temperature ?? 0.2,
  };
  if (options.maxTokens) body.max_tokens = options.maxTokens;
  if (options.json) body.response_format = { type: "json_object" };

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gateway error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

export function visionChat(messages: ChatMessage[], maxTokens = 1200) {
  return chat({ model: VISION_MODEL, messages, json: true, maxTokens, temperature: 0.1 });
}

export function llmChat(messages: ChatMessage[], maxTokens = 700) {
  return chat({ model: LLM_MODEL, messages, maxTokens, temperature: 0.4 });
}

export function extractJson<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end < 0 || end < start) {
    throw new Error(`Respons model bukan JSON: ${raw.slice(0, 300)}`);
  }
  const slice = candidate.slice(start, end + 1);
  try {
    return JSON.parse(slice) as T;
  } catch {
    throw new Error(`Gagal mengurai JSON dari model: ${raw.slice(0, 300)}`);
  }
}
