"use server"

import { auth } from "@/auth"
import psychologistService from "@/services/psychologist.service"
import { revalidatePath } from "next/cache"

export async function bookAppointment(psychologistId: string, scheduledAt: Date) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const appointment = await psychologistService.bookAppointment(
    session.user.id,
    psychologistId,
    scheduledAt
  )

  revalidatePath("/arahkan")
  return appointment
}

export async function cancelAppointment(appointmentId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const updated = await psychologistService.cancelAppointment(
    appointmentId,
    session.user.id
  )

  revalidatePath("/arahkan")
  revalidatePath("/konsultasi")
  return updated
}

export async function completeAppointment(appointmentId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const updated = await psychologistService.completeAppointment(
    appointmentId,
    session.user.id
  )

  revalidatePath("/arahkan")
  revalidatePath("/konsultasi")
  return updated
}
