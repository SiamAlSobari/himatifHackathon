import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function AIResponseFormatter<T>(jsonStr: string): T {
  if (!jsonStr || typeof jsonStr !== "string") {
    throw new Error("AIResponseFormatter received empty or invalid input");
  }

  try {
    // 1. Hapus tag <think>...</think> yang ditutup dengan benar
    let cleanedJson = jsonStr.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // 2. Jika masih terdapat tag <think> yang tidak ditutup, potong hingga ke block JSON atau '{'
    if (cleanedJson.includes("<think>")) {
      const jsonIndex = cleanedJson.indexOf("```json");
      if (jsonIndex !== -1) {
        cleanedJson = cleanedJson.substring(jsonIndex);
      } else {
        const braceIndex = cleanedJson.indexOf("{");
        if (braceIndex !== -1) {
          cleanedJson = cleanedJson.substring(braceIndex);
        }
      }
    }

    // 3. Cari blok ```json ... ``` secara fleksibel
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/i;
    const match = cleanedJson.match(jsonBlockRegex);

    if (match) {
      cleanedJson = match[1].trim();
    } else {
      // 4. Jika tidak ada block markdown, ambil substring dari '{' pertama ke '}' terakhir
      const firstBrace = cleanedJson.indexOf("{");
      const lastBrace = cleanedJson.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedJson = cleanedJson.substring(firstBrace, lastBrace + 1).trim();
      }
    }

    // 5. Parse hasil pembersihan
    const parsed = JSON.parse(cleanedJson) as T;

    // 6. Validasi minimal: pastikan ada field 'suggestion' atau 'metaData'
    const obj = parsed as unknown as Record<string, unknown>;
    if (!obj.suggestion && !obj.metaData && !obj.balasan_ai) {
      throw new Error("Parsed JSON missing required fields (suggestion/metaData)");
    }

    return parsed;
  } catch (error) {
    console.error("Failed to parse JSON. Raw input was:", jsonStr.substring(0, 500));
    throw new Error(`Invalid JSON format: ${(error as Error).message}`);
  }
}
