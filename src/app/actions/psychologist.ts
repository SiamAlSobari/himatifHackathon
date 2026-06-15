"use server"

import { auth } from "@/auth"
import psychologistService from "@/services/psychologist.service"
import { revalidatePath } from "next/cache"
import { pusherServer } from "@/lib/pusher/pusher-server"

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

  // Realtime notification update
  await pusherServer.trigger(`user-${session.user.id}`, "appointment-updated", {
    activeAppointment: {
      id: appointment.id,
      scheduledAt: appointment.scheduledAt.toISOString(),
      psychologist: {
        id: appointment.psychologist.id,
        name: appointment.psychologist.name,
        role: appointment.psychologist.role,
        imageUrl: appointment.psychologist.imageUrl,
      }
    }
  });

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
