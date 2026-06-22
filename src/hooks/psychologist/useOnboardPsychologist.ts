import { useMutation } from "@tanstack/react-query";

export function useOnboardPsychologist() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/psikolog/onboarding", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan onboarding psikolog.");
      }
      return json.data;
    },
  });
}
