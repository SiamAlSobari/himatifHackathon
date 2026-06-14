import { auth } from "@/auth"
import { db } from "@/lib/db"

export type AuthDestination =
  | "/onboarding"
  | "/screening"
  | "/dashboard"

/**
 * Determines where to send a user after a successful login based on
 * their profile completeness:
 *
 * 1. Profile incomplete (no usia/jenisKelamin) -> /onboarding
 * 2. Profile complete but no screening yet -> /screening
 * 3. Everything done -> /dashboard
 */
export async function getPostLoginDestination(
  fallback: string = "/dashboard"
): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    return fallback
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      usia: true,
      jenisKelamin: true,
      screenings: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true },
      },
    },
  })

  if (!user?.usia || !user?.jenisKelamin) {
    return "/onboarding"
  }

  if (!user.screenings || user.screenings.length === 0) {
    return "/screening"
  }

  return "/dashboard"
}
