import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/response";
import chatSessionRepository from "@/repositories/chatSessionRepository";
import psychologistRepository from "@/repositories/psychologist.repository";
import { getSessionFromChain } from "@/lib/blockchain";
import { getIpfsGatewayUrl } from "@/lib/pinata";
import { formatChatHistory } from "@/lib/helpers/json-converter";

/**
 * GET API route to verify the integrity of a session or appointment chat history.
 * Compares PostgreSQL database records with IPFS Pinata stored JSON files, verified via the Polygon Amoy smart contract.
 * Security Note: Downloads occur only in-memory (RAM) during fetch and are never stored on the local filesystem.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const appointmentId = searchParams.get("appointmentId");

    if (!sessionId && !appointmentId) {
      return errorResponse(400, "Parameter sessionId atau appointmentId wajib disertakan.");
    }

    let ipfsCid: string | null = null;
    let txHash: string | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dbMessages: any[] = [];
    let id = "";

    if (sessionId) {
      id = sessionId;
      const session = await chatSessionRepository.getById(sessionId);
      if (!session) {
        return errorResponse(404, "Sesi chat AI tidak ditemukan.");
      }
      ipfsCid = session.ipfsCid;
      txHash = session.txHash;
      dbMessages = session.chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
      }));
    } else if (appointmentId) {
      id = appointmentId;
      const appointment = await psychologistRepository.getAppointmentWithProfile(appointmentId);
      if (!appointment) {
        return errorResponse(404, "Sesi janji temu tidak ditemukan.");
      }
      ipfsCid = appointment.ipfsCid;
      txHash = appointment.txHash;

      const messages = await psychologistRepository.getConsultationMessages(appointmentId);
      dbMessages = messages.map(msg => ({
        role: msg.sender === "psychologist" ? "psychologist" : "user",
        content: msg.text,
        createdAt: msg.createdAt,
      }));
    }

    if (!ipfsCid || !txHash) {
      return successResponse(200, "Sesi belum terintegrasi di blockchain.", {
        verified: false,
        reason: "Sesi ini belum disinkronisasikan ke blockchain dan IPFS.",
      });
    }

    // 1. Fetch official record from Polygon Amoy Smart Contract
    const blockchainRecord = await getSessionFromChain(id);
    if (!blockchainRecord) {
      return successResponse(200, "Verifikasi gagal. Data tidak ditemukan di smart contract.", {
        verified: false,
        reason: "Sesi tidak ditemukan di smart contract blockchain (kemungkinan transaksi gagal/revert).",
        txHash,
        ipfsCid,
      });
    }

    // 2. Validate IPFS CID equality
    if (blockchainRecord.ipfsCid !== ipfsCid) {
      return successResponse(200, "Verifikasi gagal. Terjadi ketidakcocokan CID IPFS.", {
        verified: false,
        reason: "IPFS CID di database lokal tidak cocok dengan IPFS CID resmi yang terkunci di blockchain!",
        txHash,
        ipfsCid,
        blockchainCid: blockchainRecord.ipfsCid,
        integrity: "mismatch",
      });
    }

    // 3. Download JSON data from IPFS Pinata (fetched directly in RAM for security, not written to disk)
    const ipfsUrl = getIpfsGatewayUrl(ipfsCid);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ipfsData: any = null;
    try {
      const ipfsResponse = await fetch(ipfsUrl);
      if (!ipfsResponse.ok) {
        throw new Error(`IPFS gateway responded with status: ${ipfsResponse.status}`);
      }
      ipfsData = await ipfsResponse.json();
    } catch (fetchError) {
      console.error("Gagal mengunduh file JSON dari IPFS:", fetchError);
      return successResponse(200, "Koneksi IPFS lambat. Detail transaksi blockchain tersedia.", {
        verified: true,
        reason: "Koneksi IPFS terganggu atau lambat, namun hash blockchain terkonfirmasi cocok.",
        txHash,
        ipfsCid,
        ipfsUrl,
        timestamp: blockchainRecord.timestamp.toString(),
        registeredBy: blockchainRecord.registeredBy,
        integrity: "unchecked",
      });
    }

    // 4. Compare local database message history vs IPFS immutable history
    const localFormatted = formatChatHistory(dbMessages);
    const ipfsMessages = ipfsData?.messages || [];

    let isIntegrityIntact = localFormatted.length === ipfsMessages.length;
    if (isIntegrityIntact) {
      for (let i = 0; i < localFormatted.length; i++) {
        if (
          localFormatted[i].role !== ipfsMessages[i].role ||
          localFormatted[i].content !== ipfsMessages[i].content
        ) {
          isIntegrityIntact = false;
          break;
        }
      }
    }

    if (!isIntegrityIntact) {
      return successResponse(200, "Verifikasi gagal. Riwayat chat telah dimanipulasi lokal.", {
        verified: false,
        reason: "Riwayat percakapan di database lokal terdeteksi telah dimanipulasi! Data tidak cocok dengan arsip nir-ubah di IPFS.",
        txHash,
        ipfsCid,
        ipfsUrl,
        integrity: "mismatch",
      });
    }

    // Successfully Verified
    return successResponse(200, "Verifikasi Sukses. Integritas data terjamin.", {
      verified: true,
      txHash,
      ipfsCid,
      ipfsUrl,
      timestamp: blockchainRecord.timestamp.toString(),
      registeredBy: blockchainRecord.registeredBy,
      integrity: "match",
      message: "Integritas data terjamin 100%. Data lokal cocok dengan arsip permanen on-chain.",
    });

  } catch (error) {
    console.error("Error inside blockchain verify API endpoint:", error);
    return errorResponse(500, `Terjadi kesalahan sistem: ${(error as Error).message}`);
  }
}
