import { auth } from "@/auth"
import { db } from "@/lib/db"
import { errorResponse, successResponse } from "@/lib/response"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized")
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        usia: true,
        jenisKelamin: true,
        screenings: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true },
        },
      },
    })

    let destination = "/dashboard"

    if (user?.role === "PSYCHOLOGY") {
      destination = "/psikolog"
    } else if (!user?.usia || !user?.jenisKelamin) {
      destination = "/onboarding"
    } else if (!user.screenings || user.screenings.length === 0) {
      destination = "/screening"
    }

    return successResponse(200, "Destination resolved", { destination })
  } catch (error) {
    console.error("[/api/auth/destination] error:", error)
    return successResponse(200, "Fallback to dashboard", { destination: "/dashboard" })
  }
}
