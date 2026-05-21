/**
 * Robust JSON parser for Venice API responses.
 * Handles: plain JSON, markdown code blocks, nested JSON, partial responses.
 */
export function parseJsonResponse<T = unknown>(rawContent: string): T {
  let cleaned = rawContent.trim();

  // Strip markdown code blocks (```json ... ``` or ``` ... ```)
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  // Try direct parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // fall through
  }

  // Find the outermost JSON object in the text
  let braceCount = 0;
  let start = -1;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === '{') {
      if (braceCount === 0) start = i;
      braceCount++;
    } else if (ch === '}') {
      braceCount--;
      if (braceCount === 0 && start >= 0) {
        const jsonStr = cleaned.slice(start, i + 1);
        try {
          return JSON.parse(jsonStr) as T;
        } catch {
          // try next object
          start = -1;
        }
      }
    }
  }

  throw new Error(`Failed to parse JSON from response: ${cleaned.slice(0, 200)}`);
}
