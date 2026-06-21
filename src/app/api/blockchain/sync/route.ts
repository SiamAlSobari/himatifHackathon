import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/response";
import { auth } from "@/auth";
import blockchainSyncService from "@/services/blockchain-sync.service";
import chatSessionRepository from "@/repositories/chatSessionRepository";
import psychologistRepository from "@/repositories/psychologist.repository";

/**
 * POST API route to manually trigger blockchain & IPFS synchronization (Redeploy/Retry Sync)
 * for a completed session or appointment chat history.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user) {
      return errorResponse(401, "Anda harus masuk log terlebih dahulu.");
    }

    const userId = session.user.id;
    const body = await request.json();
    const { sessionId, appointmentId } = body;

    if (!sessionId && !appointmentId) {
      return errorResponse(400, "Parameter sessionId atau appointmentId wajib disediakan.");
    }

    // 2. Process AI Chat Session sync
    if (sessionId) {
      const chatSession = await chatSessionRepository.getById(sessionId);
      if (!chatSession) {
        return errorResponse(404, "Sesi chat tidak ditemukan.");
      }

      // Check ownership
      if (chatSession.userId !== userId) {
        return errorResponse(403, "Anda tidak memiliki akses untuk menyinkronkan sesi ini.");
      }

      if (chatSession.status !== "COMPLETED" && chatSession.status !== "SEALED") {
        return errorResponse(400, "Hanya sesi chat yang sudah selesai (COMPLETED) yang dapat disinkronkan.");
      }

      console.log(`Manual trigger: Syncing ChatSession ${sessionId} to blockchain...`);
      const result = await blockchainSyncService.syncChatSession(sessionId);
      if (!result) {
        return errorResponse(500, "Gagal mengunggah ke IPFS atau menandatangani transaksi blockchain.");
      }

      return successResponse(200, "Sesi chat berhasil disinkronkan ke blockchain.", result);
    }

    // 3. Process Psychologist Appointment sync
    if (appointmentId) {
      const appointment = await psychologistRepository.getAppointmentWithProfile(appointmentId);
      if (!appointment) {
        return errorResponse(404, "Janji temu tidak ditemukan.");
      }

      // Verify the requester is either the client or the psychologist
      const isClient = appointment.userId === userId;
      const isPsychologist = appointment.psychologistProfile.userId === userId;
      if (!isClient && !isPsychologist) {
        return errorResponse(403, "Anda tidak memiliki wewenang untuk menyinkronkan janji temu ini.");
      }

      if (appointment.status !== "COMPLETED") {
        return errorResponse(400, "Hanya janji temu dengan status COMPLETED yang dapat disinkronkan.");
      }

      console.log(`Manual trigger: Syncing Appointment ${appointmentId} to blockchain...`);
      const result = await blockchainSyncService.syncAppointmentSession(appointmentId);
      if (!result) {
        return errorResponse(500, "Gagal menyelaraskan sesi konsultasi dengan blockchain.");
      }

      return successResponse(200, "Sesi konsultasi berhasil disinkronkan ke blockchain.", result);
    }

    return errorResponse(400, "Permintaan tidak valid.");
  } catch (error) {
    console.error("Eror pada manual blockchain sync endpoint:", error);
    return errorResponse(500, `Kesalahan sistem: ${(error as Error).message}`);
  }
}
