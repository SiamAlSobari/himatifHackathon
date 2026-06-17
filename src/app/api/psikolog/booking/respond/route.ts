import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  const role = (session.user as any).role;
  if (role !== "PSYCHOLOGY") {
    return errorResponse(403, "Forbidden - Hanya psikolog yang dapat mengakses endpoint ini");
  }

  try {
    const { appointmentId, action } = await request.json();

    if (!appointmentId || !action || (action !== "ACCEPT" && action !== "DECLINE")) {
      return errorResponse(400, "appointmentId dan action (ACCEPT/DECLINE) wajib diisi");
    }

    const updated = await psychologistService.respondToBooking(appointmentId, action, session.user.id);
    
    return successResponse(200, `Booking berhasil ${action === "ACCEPT" ? "diterima" : "ditolak"}`, updated);
  } catch (error: any) {
    console.error("[/api/psikolog/booking/respond] error:", error);
    return errorResponse(500, error.message || "Gagal memproses booking");
  }
}
