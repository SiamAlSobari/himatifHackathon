import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import OnboardingClient from "./onboarding-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding Mitra Spesialis",
  description: "Lengkapi profil mitra spesialis Anda untuk mulai melayani klien.",
};

export default async function PsychologistOnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/psikolog/login?callbackUrl=/psikolog/onboarding");
  }

  const role = (session.user as any).role;
  if (role !== "PSYCHOLOGY") {
    redirect("/dashboard");
  }

  // Fetch fresh user data from DB
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      isOnboarded: true,
      psychologistProfile: {
        select: {
          role: true,
          imageUrl: true,
        },
      },
    },
  });

  if (user?.isOnboarded) {
    redirect("/psikolog");
  }

  return (
    <OnboardingClient
      userName={user?.name ?? session.user.name ?? "Psikolog"}
      userEmail={user?.email ?? session.user.email ?? ""}
      roleTitle={user?.psychologistProfile?.role ?? ""}
      currentImageUrl={user?.psychologistProfile?.imageUrl ?? ""}
    />
  );
}
