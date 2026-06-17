import { useMutation } from "@tanstack/react-query";

export function useRegisterPsychologist() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/psikolog/register", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mendaftarkan akun psikolog.");
      }
      return json.data;
    },
  });
}
