import { PinataChatHistoryMessage, PinataUploadPayload } from "@/lib/types/blockchain";

/**
 * Utility helper to convert raw data objects and chat histories
 * into structured JSON payloads and File/Blob/Buffer objects suitable for IPFS Pinata storage.
 */

/**
 * Maps raw chat messages (AI or Psychologist consultation) to the standardized PinataChatHistoryMessage structure.
 * @param messages Array of raw message objects from the database (PostgreSQL)
 * @returns Standardized message list for IPFS
 */
export function formatChatHistory(
  messages: Array<{
    role: string;
    content: string;
    createdAt: Date | string;
  }>
): PinataChatHistoryMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.createdAt).toISOString(),
  }));
}

/**
 * Constructs the standardized payload structure for Pinata upload.
 * @param sessionId The unique ID of the chat session or appointment
 * @param messages The standardized message list
 * @param metadata Optional custom metadata dictionary (e.g. user ID, scores)
 * @returns Fully constructed PinataUploadPayload object
 */
export function buildPinataPayload(
  sessionId: string,
  messages: PinataChatHistoryMessage[],
  metadata?: Record<string, unknown>
): PinataUploadPayload {
  return {
    sessionId,
    timestamp: new Date().toISOString(),
    messages,
    metadata,
  };
}

/**
 * Converts any standard JSON-serializable object into a browser Blob with MIME type application/json.
 * @param payload The object to convert
 * @returns A Blob representing the json file
 */
export function convertJsonToBlob(payload: Record<string, unknown> | PinataUploadPayload): Blob {
  const jsonString = JSON.stringify(payload, null, 2);
  return new Blob([jsonString], { type: "application/json" });
}

/**
 * Converts any standard JSON-serializable object into a Node.js Buffer with UTF-8 encoding.
 * Useful for backend Server Actions or API Routes.
 * @param payload The object to convert
 * @returns A Buffer representing the json file
 */
export function convertJsonToBuffer(payload: Record<string, unknown> | PinataUploadPayload): Buffer {
  const jsonString = JSON.stringify(payload, null, 2);
  return Buffer.from(jsonString, "utf-8");
}
