/**
 * Types & Interfaces for Blockchain and Pinata IPFS Integrations
 */

export enum BlockchainSessionType {
  AI = 0,
  Psychologist = 1,
}

export interface PinataChatHistoryMessage {
  role: "USER" | "ASSISTANT" | "psychologist" | "user" | string;
  content: string;
  createdAt: string;
}

export interface PinataUploadPayload {
  sessionId: string;
  timestamp: string;
  messages: PinataChatHistoryMessage[];
  metadata?: Record<string, unknown>;
}

export interface PinataUploadResponse {
  IpfsHash: string; // The CID (Content Identifier) from IPFS
  PinSize: number;
  Timestamp: string;
}

export interface BlockchainSessionRecord {
  id: string;
  sessionType: BlockchainSessionType;
  ipfsCid: string;
  timestamp: bigint;
  registeredBy: string;
}
