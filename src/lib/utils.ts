import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function AIResponseFormatter<T>(jsonStr: string): T {
  try {
    let cleanedJson = jsonStr.trim();
    const jsonBlockRegex = /^```json\s*([\s\S]*?)\s*```$/i;
    const match = cleanedJson.match(jsonBlockRegex);

    if (match) {
      cleanedJson = match[1].trim();
    }

    // 3. Parse hasil pembersihan
    return JSON.parse(cleanedJson) as T;
  } catch (error) {
    console.error("Failed to parse JSON. Raw input was:", jsonStr);
    // Sangat disarankan untuk melempar error asli atau info tambahan untuk debugging
    throw new Error(`Invalid JSON format: ${(error as Error).message}`);
  }
}
