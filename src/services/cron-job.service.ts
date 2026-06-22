import chatSessionRepository from "@/repositories/chatSessionRepository";
import blockchainSyncService from "./blockchain-sync.service";
import type { CronJobResponse, CronJobSessionResult } from "@/lib/types/job";

export class CronJobService {
  /**
   * Automatically closes and synchronizes active AI Chat sessions that have been open for more than 24 hours.
   */
  async closeAndSyncStaleChatSessions(): Promise<CronJobResponse> {
    try {
      console.log("CronJobService: Starting check for stale AI chat sessions...");

      // 1. Calculate cutoff time (24 hours ago)
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const staleSessions = await chatSessionRepository.getActiveSessionsOlderThan(cutoff);

      console.log(`CronJobService: Found ${staleSessions.length} stale active sessions to process.`);

      const results: CronJobSessionResult[] = [];

      if (staleSessions.length > 0) {
        const sessionIds = staleSessions.map((s) => s.id);
        await chatSessionRepository.updateManyStatus(sessionIds, "COMPLETED");
        console.log(`CronJobService: Updated ${sessionIds.length} sessions status to COMPLETED via updateMany`);
      }

      for (const session of staleSessions) {
        const sessionId = session.id;
        try {
          // Trigger IPFS and Polygon chain synchronization for the completed session
          const syncResult = await blockchainSyncService.syncChatSession(sessionId);

          if (syncResult) {
            results.push({
              sessionId,
              status: "success",
              ipfsCid: syncResult.ipfsCid,
              txHash: syncResult.txHash,
            });
            console.log(`CronJobService: Successfully synced session ${sessionId} to blockchain.`);
          } else {
            results.push({
              sessionId,
              status: "failed",
              error: "Blockchain sync returned null result.",
            });
            console.warn(`CronJobService: Blockchain sync failed for session ${sessionId}.`);
          }
        } catch (sessionErr: any) {
          console.error(`CronJobService: Error processing session ${sessionId}:`, sessionErr);
          results.push({
            sessionId,
            status: "failed",
            error: sessionErr.message || "Unknown error during processing",
          });
        }
      }

      return {
        success: true,
        message: `Processed ${staleSessions.length} stale sessions.`,
        processedCount: staleSessions.length,
        results,
      };
    } catch (error: any) {
      console.error("CronJobService: Stale session cron job failed:", error);
      return {
        success: false,
        message: error.message || "Failed during cron job execution",
        processedCount: 0,
        results: [],
      };
    }
  }
}

const cronJobService = new CronJobService();
export default cronJobService;
