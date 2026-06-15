export interface Psychologist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  imageUrl: string;
  experienceYears: number;
  tags: string[];
  strNumber?: string;
  practiceLocation?: string;
}

export interface ActiveAppointment {
  id: string;
  scheduledAt: string;
  psychologist: Psychologist;
}

export interface ClientProfile {
  name: string;
  image?: string;
  email: string;
  usia?: number | null;
  jenisKelamin?: string | null;
}

export interface Message {
  id: string;
  sender: "psychologist" | "user";
  text: string;
  time: string;
}
