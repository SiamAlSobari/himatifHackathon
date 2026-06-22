export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const cron = await import("node-cron");
    const { default: cronJobService } = await import("@/services/cron-job.service");

    console.log("CronJobService: Registering node-cron jobs...");

    // Schedule: Every 1 hour ("0 * * * *")
    cron.schedule("0 * * * *", async () => {
      console.log("CronJobService: Running scheduled job to close and sync stale chat sessions...");
      try {
        const result = await cronJobService.closeAndSyncStaleChatSessions();
        console.log("CronJobService: Scheduled job result:", result);
      } catch (error) {
        console.error("CronJobService: Scheduled job failed with error:", error);
      }
    });
  }
}
