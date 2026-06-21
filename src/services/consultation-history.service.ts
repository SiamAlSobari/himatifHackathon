import appointmentRepository from "@/repositories/appointment.repository";
import psychologistRepository from "@/repositories/psychologist.repository";
import { ConsultationHistoryListItem, ConsultationHistoryMessage } from "@/lib/types/consultation-history";

export class ConsultationHistoryService {
  async getCompletedConsultations(userId: string, role: string): Promise<ConsultationHistoryListItem[]> {
    if (role === "PSYCHOLOGY") {
      const profile = await psychologistRepository.getPsychologistProfileByUserId(userId);
      if (!profile) {
        throw new Error("Profil psikolog tidak ditemukan");
      }

      const appointments = await appointmentRepository.getPsychologistCompletedAppointments(profile.id);
      return appointments.map((appt) => {
        return {
          id: appt.id,
          scheduledAt: appt.scheduledAt.toISOString(),
          status: appt.status,
          otherPartyName: appt.user.name || appt.user.email || "Klien",
          otherPartyImage: appt.user.image,
          otherPartyRole: appt.user.usia ? `Pasien · ${appt.user.usia} Tahun` : "Pasien",
          otherPartyEmail: appt.user.email,
          ipfsCid: appt.ipfsCid,
          txHash: appt.txHash,
        };
      });
    } else {
      const appointments = await appointmentRepository.getUserCompletedAppointments(userId);
      return appointments.map((appt) => {
        return {
          id: appt.id,
          scheduledAt: appt.scheduledAt.toISOString(),
          status: appt.status,
          otherPartyName: appt.psychologistProfile.user.name || appt.psychologistProfile.user.email || "Psikolog",
          otherPartyImage: appt.psychologistProfile.imageUrl,
          otherPartyRole: appt.psychologistProfile.role,
          otherPartyEmail: appt.psychologistProfile.user.email,
          ipfsCid: appt.ipfsCid,
          txHash: appt.txHash,
        };
      });
    }
  }

  async getConsultationMessages(appointmentId: string, userId: string): Promise<ConsultationHistoryMessage[]> {
    const appt = await appointmentRepository.getAppointmentWithParticipants(appointmentId);
    if (!appt) {
      throw new Error("Janji temu tidak ditemukan");
    }

    // Verify authorized participant (user or psychologist)
    const isUser = appt.userId === userId;
    const isPsychologist = appt.psychologistProfile.userId === userId;

    if (!isUser && !isPsychologist) {
      throw new Error("Tidak memiliki akses untuk riwayat chat ini");
    }

    const messages = await psychologistRepository.getConsultationMessages(appointmentId);

    return messages.map((msg) => {
      const msgDate = new Date(msg.createdAt);
      const time = msgDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return {
        id: msg.id,
        sender: msg.sender as "psychologist" | "user",
        text: msg.text,
        createdAt: msg.createdAt.toISOString(),
        time,
      };
    });
  }
}

const consultationHistoryService = new ConsultationHistoryService();
export default consultationHistoryService;
