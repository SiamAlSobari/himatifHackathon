import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile data");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch profile data");
      return json.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; usia: number; jenisKelamin: string }) => {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal memperbarui profil");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memperbarui profil");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-data"] });
    },
  });
}

export function useUpdatePhoneNumber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kontakDarurat: phoneNumber }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui nomor telepon");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memperbarui nomor telepon");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-data"] });
    },
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      const res = await fetch("/api/profile/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengirim kode verifikasi");
      }
      return json.data;
    },
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { phoneNumber: string; otpCode: string }) => {
      const res = await fetch("/api/profile/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memverifikasi kode OTP");
      }
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-data"] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword?: string; newPassword?: string }) => {
      const res = await fetch("/api/profile/password/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memperbarui kata sandi");
      }
      return json.data;
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/auth/password/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengirim link reset password");
      }
      return json.data;
    },
  });
}

export function useConfirmPasswordReset() {
  return useMutation({
    mutationFn: async (data: { token?: string; email?: string; newPassword?: string }) => {
      const res = await fetch("/api/auth/password/reset-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengatur ulang kata sandi");
      }
      return json.data;
    },
  });
}


