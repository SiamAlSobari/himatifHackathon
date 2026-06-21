import chatSessionRepository from "@/repositories/chatSessionRepository";
import psychologistRepository from "@/repositories/psychologist.repository";
import appointmentRepository from "@/repositories/appointment.repository";
import { BlockchainSessionType } from "@/lib/types/blockchain";
import { uploadJsonToPinata } from "@/lib/pinata";
import { registerSessionOnChain } from "@/lib/blockchain";
import { formatChatHistory, buildPinataPayload } from "@/lib/helpers/json-converter";
import { pusherServer } from "@/lib/pusher/pusher-server";

/**
 * Service to handle the synchronization of chat histories (AI & Psychologist Consultation)
 * to Pinata IPFS and Polygon Amoy Blockchain.
 */
export class BlockchainSyncService {
  /**
   * Synchronizes a completed AI Chat Session (Very AI) to IPFS and the Polygon Amoy blockchain.
   * @param sessionId The completed chat session ID
   * @returns The IPFS CID and blockchain Transaction Hash
   */
  async syncChatSession(sessionId: string): Promise<{ ipfsCid: string; txHash: string } | null> {
    try {
      console.log(`Starting blockchain synchronization for ChatSession: ${sessionId}`);
      
      // 1. Fetch Chat Session with messages
      const session = await chatSessionRepository.getById(sessionId);
      if (!session) {
        console.error(`ChatSession ${sessionId} not found.`);
        return null;
      }

      if (session.chatMessages.length === 0) {
        console.log(`ChatSession ${sessionId} has no messages. Skipping synchronization.`);
        return null;
      }

      // 2. Format and construct payload
      const formattedMessages = formatChatHistory(
        session.chatMessages.map(msg => ({
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
        }))
      );

      const payload = buildPinataPayload(sessionId, formattedMessages, {
        userId: session.userId,
        summary: session.sessionSummary?.summary || "",
        createdAt: session.createdAt.toISOString(),
      });

      // 3. Upload to IPFS Pinata
      console.log(`Uploading ChatSession ${sessionId} to Pinata IPFS...`);
      const pinataResult = await uploadJsonToPinata(payload);
      const ipfsCid = pinataResult.IpfsHash;
      console.log(`Uploaded to Pinata. CID: ${ipfsCid}`);

      // 4. Register Session on Blockchain
      console.log(`Registering ChatSession ${sessionId} on Polygon Amoy Testnet...`);
      const txHash = await registerSessionOnChain(
        sessionId,
        BlockchainSessionType.AI,
        ipfsCid
      );
      console.log(`Registered on-chain. TxHash: ${txHash}`);

      // 5. Save CID and Transaction Hash in PostgreSQL DB
      await chatSessionRepository.updateBlockchainData(sessionId, ipfsCid, txHash);
      console.log(`Saved blockchain credentials to PostgreSQL for ChatSession: ${sessionId}`);

      // 6. Trigger real-time UI updates via Pusher
      await pusherServer.trigger(`user-${session.userId}`, "blockchain-synced", {
        sessionId,
        type: "AI",
        ipfsCid,
        txHash,
      });

      return { ipfsCid, txHash };
    } catch (error) {
      console.error(`Error in syncChatSession for session ${sessionId}:`, error);
      // Fail-safe: We log error, but do not crash the app
      return null;
    }
  }

  /**
   * Synchronizes a completed Psychologist Consultation Appointment to IPFS and the Polygon Amoy blockchain.
   * @param appointmentId The completed appointment ID
   * @returns The IPFS CID and blockchain Transaction Hash
   */
  async syncAppointmentSession(appointmentId: string): Promise<{ ipfsCid: string; txHash: string } | null> {
    try {
      console.log(`Starting blockchain synchronization for Appointment: ${appointmentId}`);

      // 1. Fetch Appointment and Consultation Messages
      const appointment = await psychologistRepository.getAppointmentWithProfile(appointmentId);
      if (!appointment) {
        console.error(`Appointment ${appointmentId} not found.`);
        return null;
      }

      const messages = await psychologistRepository.getConsultationMessages(appointmentId);
      if (messages.length === 0) {
        console.log(`Appointment ${appointmentId} has no consultation messages. Skipping synchronization.`);
        return null;
      }

      // 2. Format and construct payload
      const formattedMessages = formatChatHistory(
        messages.map(msg => ({
          role: msg.sender === "psychologist" ? "psychologist" : "user",
          content: msg.text,
          createdAt: msg.createdAt,
        }))
      );

      const payload = buildPinataPayload(appointmentId, formattedMessages, {
        userId: appointment.userId,
        psychologistId: appointment.psychologistId,
        scheduledAt: appointment.scheduledAt.toISOString(),
      });

      // 3. Upload to IPFS Pinata
      console.log(`Uploading Appointment ${appointmentId} to Pinata IPFS...`);
      const pinataResult = await uploadJsonToPinata(payload);
      const ipfsCid = pinataResult.IpfsHash;
      console.log(`Uploaded to Pinata. CID: ${ipfsCid}`);

      // 4. Register Session on Blockchain
      console.log(`Registering Appointment ${appointmentId} on Polygon Amoy Testnet...`);
      const txHash = await registerSessionOnChain(
        appointmentId,
        BlockchainSessionType.Psychologist,
        ipfsCid
      );
      console.log(`Registered on-chain. TxHash: ${txHash}`);

      // 5. Save CID and Transaction Hash in PostgreSQL DB
      await appointmentRepository.updateBlockchainData(appointmentId, ipfsCid, txHash);
      console.log(`Saved blockchain credentials to PostgreSQL for Appointment: ${appointmentId}`);

      // 6. Trigger real-time UI updates via Pusher
      await pusherServer.trigger(`appointment-${appointmentId}`, "blockchain-synced", {
        appointmentId,
        type: "Psychologist",
        ipfsCid,
        txHash,
      });

      // Also trigger user-specific notification for dashboard/history UI updates
      await pusherServer.trigger(`user-${appointment.userId}`, "blockchain-synced", {
        appointmentId,
        type: "Psychologist",
        ipfsCid,
        txHash,
      });

      return { ipfsCid, txHash };
    } catch (error) {
      console.error(`Error in syncAppointmentSession for appointment ${appointmentId}:`, error);
      // Fail-safe
      return null;
    }
  }
}

export const blockchainSyncService = new BlockchainSyncService();
export default blockchainSyncService;
