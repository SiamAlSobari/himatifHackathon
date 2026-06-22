"use server"

import { auth } from "@/auth"
import psychologistService from "@/services/psychologist.service"
import { revalidatePath } from "next/cache"
import { pusherServer } from "@/lib/pusher/pusher-server"

export async function bookAppointment(psychologistId: string, scheduledAtStr: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const scheduledAt = new Date(scheduledAtStr)
  if (isNaN(scheduledAt.getTime())) {
    throw new Error("Format tanggal tidak valid")
  }

  const appointment = await psychologistService.bookAppointment(
    session.user.id,
    psychologistId,
    scheduledAt
  )

  // Notify the psychologist in real-time to refresh their dashboard
  await pusherServer.trigger(`user-${appointment.psychologistProfile.userId}`, "booking-requested", {});

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

  // Realtime notification update
  await pusherServer.trigger(`user-${session.user.id}`, "appointment-updated", {
    activeAppointment: null
  });

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
