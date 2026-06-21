import { db } from "./db"
import bcrypt from "bcrypt"

export async function seedPsychologists() {
  const count = await db.user.count({
    where: { role: "PSYCHOLOGY" }
  })
  if (count > 0) {
    return
  }

  const psychologists = [
    {
      name: "Dr. Aris Setiawan, M.Psi",
      email: "aris@verimind.com",
      role: "Psikolog Klinis",
      specialty: "Penanganan Trauma & PTSD",
      rating: 4.9,
      experienceYears: 12,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOPE0iHDewVQwoRemvHKP1sUn4wKEEmKgOB1EzwCSUz7mTWvRnq9-iVeO5gOFVhwIiNchpmMkw2OwXO8upOgfOYdVStNBeF84e0RxwvQ08riWjOP7cAGXVO7rhYeGmNXkwIBVjsbyYepGknFGxWoh6fmaEIYnf9uC5276UAbawOP16umXkzxtR_jS_zbF2se6qDKf-8BUTsFHPvIDiBMHw32Xx70jNz2nspNzU_58_9YDrmktTYho3yuMtLRRbPcbydOU3gf-P1SE",
      availability: "AVAILABLE",
      busyUntil: null,
      tags: ["Trauma"],
    },
    {
      name: "Dr. Sarah Wijaya, Sp.KJ",
      email: "sarah@verimind.com",
      role: "Psikiater",
      specialty: "Gangguan Kecemasan & Mood",
      rating: 4.8,
      experienceYears: 8,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZEkzRzM1hH7ctLmw7UnFsdgSVbjGFffatnJ3OispS5Oml3vKt1BjzJyWYtJPiMbKNaAOeGTnkv2LR3LNqHnDMblzed77ighORA22sSpPQ86tZ8qfUhlMCYm4Q73HwHQVVsRA5O05AyYhN_c2jI0AB-txZilTq0P0vuniN931zMkpZVwEuhcEn0gYnFoz96rRhAv8s22hh-l_M6pspnFFnnMDSQ_DwB5aeCA_Akc3aRSalTUAZLU1eQ27juU81QVwX8aBRD64TKBE",
      availability: "AVAILABLE",
      busyUntil: null,
      tags: ["Depresi", "Kecemasan"],
    },
    {
      name: "Dika Pratama, S.Psi",
      email: "dika@verimind.com",
      role: "Konselor Sebaya",
      specialty: "Kesehatan Mental Remaja",
      rating: 4.7,
      experienceYears: 5,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDXCmom37p7KOT7vAQKBoVfsrIiI-5icbaZ32bi1XXN9K0aD6kJNUfO2Jt2ZGwBurmvM7-SS04E0XzB4VLlsXV20bHOuIvWAEP-GzCtd2Q04u6wbfJW8E5h6vtqRyZTXK3Ua7db-S98P59CDVX_vm8rHO1ZfOnNkl9vtZ_o-_hHP1nOBOJgg_lNA3r2-s6lUc3mTMu_aRACIkuzZ_-IsqV6jzQ2rEBLDY5_sZAA2vQBUn0AhP2iFd2v8dTiN3swprTdOJy3MskdEk",
      availability: "BUSY",
      busyUntil: "16:00",
      tags: ["Remaja"],
    },
  ]

  const passwordHash = await bcrypt.hash("password123", 12)

  for (const psych of psychologists) {
    const user = await db.user.create({
      data: {
        name: psych.name,
        email: psych.email,
        passwordHash,
        role: "PSYCHOLOGY",
        isOnboarded: true,
      }
    })

    await db.psychologistProfile.create({
      data: {
        userId: user.id,
        role: psych.role,
        specialty: psych.specialty,
        rating: psych.rating,
        experienceYears: psych.experienceYears,
        imageUrl: psych.imageUrl,
        availability: psych.availability,
        busyUntil: psych.busyUntil,
        tags: psych.tags,
      }
    })
  }

  console.log("Psychologists seeded successfully!")
}
