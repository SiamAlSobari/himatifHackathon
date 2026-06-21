import { useQuery } from "@tanstack/react-query";

export interface VerifyResponse {
  success: boolean;
  status: number;
  message: string;
  error?: string;
  data: {
    verified: boolean;
    txHash?: string;
    ipfsCid?: string;
    ipfsUrl?: string;
    timestamp?: string;
    registeredBy?: string;
    integrity?: "match" | "mismatch" | "unchecked";
    reason?: string;
    message?: string;
  };
}

/**
 * Custom hook to verify the blockchain audit logs for an AI chat session or a psychologist appointment.
 * Utilizes TanStack Query to fetch and cache results.
 * @param params Query parameters containing sessionId (AI) or appointmentId (Psychologist)
 * @returns Query result containing verification data, loading status, and errors
 */
export function useBlockchainVerify(params: { sessionId?: string; appointmentId?: string }) {
  const { sessionId, appointmentId } = params;

  return useQuery<VerifyResponse>({
    queryKey: ["blockchain-verify", sessionId || appointmentId],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (sessionId) queryParams.set("sessionId", sessionId);
      if (appointmentId) queryParams.set("appointmentId", appointmentId);

      const response = await fetch(`/api/blockchain/verify?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blockchain verification data.");
      }
      return response.json();
    },
    enabled: !!(sessionId || appointmentId),
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
