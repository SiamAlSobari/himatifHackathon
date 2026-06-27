export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const getPath = (p: string) => p;
    const cron = await import(getPath("node-cron"));
    const cronJobService = (await import(getPath("./services/cron-job.service"))).default;

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

    // Schedule: Every 30 minutes to retry unsynced completed sessions and appointments
    cron.schedule("*/30 * * * *", async () => {
      console.log("CronJobService: Running scheduled retry queue for unsynced sessions and appointments...");
      try {
        const result = await cronJobService.syncUnsyncedSessionsAndAppointments();
        console.log("CronJobService Retry Queue: Scheduled job result:", result);
      } catch (error) {
        console.error("CronJobService Retry Queue: Scheduled job failed with error:", error);
      }
    });
  }
}
