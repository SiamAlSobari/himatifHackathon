import { PinataUploadPayload, PinataUploadResponse } from "./types/blockchain";

/**
 * Pinata Client Service for uploading structured data to IPFS (InterPlanetary File System).
 */

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_API_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

/**
 * Uploads a standardized JSON payload to Pinata IPFS via pinJSONToIPFS REST API endpoint.
 * @param payload The structured payload containing session ID, messages, and metadata
 * @returns PinataUploadResponse containing the IpfsHash (CID) and metadata
 */
export async function uploadJsonToPinata(
  payload: PinataUploadPayload
): Promise<PinataUploadResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (PINATA_JWT) {
    headers["Authorization"] = `Bearer ${PINATA_JWT}`;
  } else if (PINATA_API_KEY && PINATA_API_SECRET) {
    headers["pinata_api_key"] = PINATA_API_KEY;
    headers["pinata_secret_api_key"] = PINATA_API_SECRET;
  } else {
    throw new Error(
      "Pinata authentication is not configured. Please define PINATA_JWT or both PINATA_API_KEY and PINATA_API_SECRET in environment variables."
    );
  }

  const filename = `verimind-session-${payload.sessionId}.json`;

  try {
    const response = await fetch(PINATA_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        pinataContent: payload,
        pinataMetadata: {
          name: filename,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.IpfsHash) {
      throw new Error("Invalid response from Pinata API: IpfsHash (CID) is missing.");
    }

    return {
      IpfsHash: data.IpfsHash,
      PinSize: data.PinSize || 0,
      Timestamp: data.Timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error uploading JSON to Pinata IPFS:", error);
    throw error;
  }
}

/**
 * Constructs the absolute gateway URL for a given IPFS CID.
 * Uses PINATA_GATEWAY_URL from environment variables if defined, otherwise falls back to public Pinata gateway.
 * @param cid The IPFS Content Identifier (IpfsHash)
 * @returns The absolute URL to fetch the file contents
 */
export function getIpfsGatewayUrl(cid: string): string {
  const gateway = process.env.PINATA_GATEWAY_URL || "https://gateway.pinata.cloud/ipfs/";
  const baseUrl = gateway.endsWith("/") ? gateway : `${gateway}/`;
  return `${baseUrl}${cid}`;
}
