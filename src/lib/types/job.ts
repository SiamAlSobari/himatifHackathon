export interface CronJobSessionResult {
  sessionId: string;
  status: "success" | "failed";
  ipfsCid?: string;
  txHash?: string;
  error?: string;
}

export interface CronJobResponse {
  success: boolean;
  message: string;
  processedCount: number;
  results: CronJobSessionResult[];
}
