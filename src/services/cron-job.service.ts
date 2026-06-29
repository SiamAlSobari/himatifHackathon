import chatSessionRepository from "@/repositories/chatSessionRepository";
import appointmentRepository from "@/repositories/appointment.repository";
import blockchainSyncService from "./blockchain-sync.service";
import type { CronJobResponse, CronJobSessionResult } from "@/lib/types/job";
import { db } from "@/lib/db";

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

  /**
   * Automatically marks stale/expired appointments as EXPIRED if they have passed their active slot (e.g. 30 minutes since scheduled time).
   */
  async expireStaleAppointments(): Promise<CronJobResponse> {
    try {
      console.log("CronJobService: Starting check for stale appointments...");

      // 1. Calculate cutoff time (30 minutes ago)
      const cutoff = new Date(Date.now() - 30 * 60 * 1000);

      // 2. Find appointments with status PENDING, APPROVED, or SCHEDULED that are past the cutoff
      const staleAppointments = await db.appointment.findMany({
        where: {
          status: {
            in: ["PENDING", "APPROVED", "SCHEDULED"]
          },
          scheduledAt: {
            lt: cutoff
          }
        },
        select: {
          id: true
        }
      });

      console.log(`CronJobService: Found ${staleAppointments.length} stale appointments to mark as EXPIRED.`);

      const results: CronJobSessionResult[] = [];

      if (staleAppointments.length > 0) {
        const appointmentIds = staleAppointments.map((a) => a.id);
        await db.appointment.updateMany({
          where: {
            id: {
              in: appointmentIds
            }
          },
          data: {
            status: "EXPIRED"
          }
        });

        for (const apptId of appointmentIds) {
          results.push({
            sessionId: apptId,
            status: "success"
          });
        }
        console.log(`CronJobService: Successfully marked ${appointmentIds.length} appointments as EXPIRED.`);
      }

      return {
        success: true,
        message: `Processed ${staleAppointments.length} stale appointments.`,
        processedCount: staleAppointments.length,
        results
      };
    } catch (error: any) {
      console.error("CronJobService: Expire stale appointments cron job failed:", error);
      return {
        success: false,
        message: error.message || "Failed during cron job execution",
        processedCount: 0,
        results: []
      };
    }
  }

  /**
   * Scans for and retries synchronization for completed AI chat sessions and psychologist appointments that failed to sync.
   */
  async syncUnsyncedSessionsAndAppointments(): Promise<CronJobResponse> {
    try {
      console.log("CronJobService: Starting sync retry queue for failed sessions and appointments...");
      
      const unsyncedSessions = await chatSessionRepository.getUnsyncedCompletedSessions();
      const unsyncedAppointments = await appointmentRepository.getUnsyncedCompletedAppointments();
      
      console.log(`CronJobService: Found ${unsyncedSessions.length} unsynced chat sessions and ${unsyncedAppointments.length} unsynced appointments.`);

      const results: CronJobSessionResult[] = [];

      // 1. Retry Chat Sessions
      for (const session of unsyncedSessions) {
        const sessionId = session.id;
        try {
          const syncResult = await blockchainSyncService.syncChatSession(sessionId);
          if (syncResult) {
            results.push({
              sessionId,
              status: "success",
              ipfsCid: syncResult.ipfsCid,
              txHash: syncResult.txHash,
            });
            console.log(`CronJobService Retry: Successfully synced session ${sessionId} to blockchain.`);
          } else {
            results.push({
              sessionId,
              status: "failed",
              error: "Blockchain sync returned null.",
            });
          }
        } catch (err: any) {
          console.error(`CronJobService Retry: Error syncing session ${sessionId}:`, err);
          results.push({
            sessionId,
            status: "failed",
            error: err.message || "Unknown error during sync retry",
          });
        }
      }

      // 2. Retry Appointments
      for (const appt of unsyncedAppointments) {
        const appointmentId = appt.id;
        try {
          const syncResult = await blockchainSyncService.syncAppointmentSession(appointmentId);
          if (syncResult) {
            results.push({
              sessionId: appointmentId,
              status: "success",
              ipfsCid: syncResult.ipfsCid,
              txHash: syncResult.txHash,
            });
            console.log(`CronJobService Retry: Successfully synced appointment ${appointmentId} to blockchain.`);
          } else {
            results.push({
              sessionId: appointmentId,
              status: "failed",
              error: "Blockchain sync returned null.",
            });
          }
        } catch (err: any) {
          console.error(`CronJobService Retry: Error syncing appointment ${appointmentId}:`, err);
          results.push({
            sessionId: appointmentId,
            status: "failed",
            error: err.message || "Unknown error during sync retry",
          });
        }
      }

      return {
        success: true,
        message: `Processed ${unsyncedSessions.length} chat sessions and ${unsyncedAppointments.length} appointments.`,
        processedCount: unsyncedSessions.length + unsyncedAppointments.length,
        results,
      };
    } catch (error: any) {
      console.error("CronJobService: Unsynced session sync cron job failed:", error);
      return {
        success: false,
        message: error.message || "Failed during sync retry execution",
        processedCount: 0,
        results: [],
      };
    }
  }
}

const cronJobService = new CronJobService();
export default cronJobService;
