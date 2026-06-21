import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import OnboardingForm from "@/components/onboarding/OnboardingForm"
import type { OnboardingFormData } from "@/lib/types/onboarding"

export const metadata = {
  title: "Onboarding • Verimind",
  description:
    "Bikin Verimind lebih kenal kamu. 5 pertanyaan ringan, ± 60 detik, 100% privat.",
}

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/onboarding")
  }

  // If user already has usia + jenisKelamin, skip onboarding -> screening
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      usia: true,
      jenisKelamin: true,
      kontakDarurat: true,
    },
  })

  if (user?.usia && user?.jenisKelamin) {
    redirect("/screening")
  }

  const initialData: Partial<OnboardingFormData> = {
    usia: user?.usia ?? null,
    jenisKelamin: (user?.jenisKelamin as OnboardingFormData["jenisKelamin"]) ?? null,
    kontakDarurat: user?.kontakDarurat ?? "",
  }

  return (
    <OnboardingForm
      userName={user?.name ?? session.user.name ?? null}
      userEmail={user?.email ?? session.user.email ?? null}
      initialData={initialData}
    />
  )
}
