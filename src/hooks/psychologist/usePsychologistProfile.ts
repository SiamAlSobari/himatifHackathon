import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdatePsychologistProfilePayload } from "@/lib/types/psychologist-profile";

const QUERY_KEY = ["psikolog-profile-data"];

// ─── Fetch psychologist profile ───────────────────────────────────────────────
export function usePsychologistProfile() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/psikolog/profile");
      if (!res.ok) throw new Error("Gagal memuat data profil psikolog");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat data profil psikolog");
      return json.data;
    },
  });
}

// ─── Update general profile (name, role, specialty, exp) ─────────────────────
export function useUpdatePsychologistProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdatePsychologistProfilePayload) => {
      const res = await fetch("/api/psikolog/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal memperbarui profil");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

// ─── Update phone number (after OTP verify) ───────────────────────────────────
export function useUpdatePsychologistPhoneNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (kontakDarurat: string) => {
      const res = await fetch("/api/psikolog/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kontakDarurat }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal memperbarui nomor telepon");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

// ─── Send OTP to phone number (reuses user OTP endpoint) ─────────────────────
export function useSendPsychologistOtp() {
  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      const res = await fetch("/api/profile/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal mengirim kode verifikasi");
      return json.data;
    },
  });
}

// ─── Verify OTP and update phone number ──────────────────────────────────────
export function useVerifyPsychologistOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { phoneNumber: string; otpCode: string }) => {
      const res = await fetch("/api/profile/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal memverifikasi kode OTP");
      return json.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

// ─── Update password (reuses common password endpoint) ────────────────────────
export function useUpdatePsychologistPassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await fetch("/api/profile/password/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal memperbarui kata sandi");
      return json.data;
    },
  });
}
