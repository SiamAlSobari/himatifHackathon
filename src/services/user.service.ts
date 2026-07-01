import userRepository from "@/repositories/user.repository";
import psychologistRepository from "@/repositories/psychologist.repository";
import screeningRepository from "@/repositories/screening.repository";
import screeningService from "./screening.service";
import { ActivityRecommendation } from "@/lib/types/dashboard";
import { getJakartaDateComponents } from "@/lib/utils";

export class UserService {
  async resolveLoginDestination(userId: string): Promise<string> {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      return "/login";
    }

    if (user.role === "PSYCHOLOGY") {
      if (!user.isOnboarded) {
        return "/psikolog/onboarding";
      }
      return "/psikolog";
    }

    if (!user.usia || !user.jenisKelamin) {
      return "/onboarding";
    }

    const hasScreenedToday = await screeningService.checkDailyScreeningStatus(userId);
    if (!hasScreenedToday) {
      return "/screening";
    }

    return "/dashboard";
  }

  async getUserDashboardData(userId: string) {
    const user = await userRepository.getUserProfile(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const hasScreenedToday = await screeningService.checkDailyScreeningStatus(userId);

    // 1. Mood Chart Data
    const moodData = [];
    const now = new Date();
    const dayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    
    // Fetch last 15 screenings to get baseline
    const recentScreenings = await screeningRepository.getScreeningsByUserId(userId, 15);
    
    // Sort chronologically (oldest to newest)
    const sortedScreenings = [...recentScreenings].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    // Calculate last 7 days ending with today
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      last7Days.push(d);
    }
    
    for (let i = 0; i < 7; i++) {
      const targetDay = last7Days[i];
      const targetDayStr = targetDay.toDateString();
      
      const screeningOnDay = sortedScreenings.find((s) => {
        return s.createdAt.toDateString() === targetDayStr;
      });
      
      let wellnessValue = 0;
      let dayScreeningResults = null;
      
      if (screeningOnDay) {
        wellnessValue = Math.round(((21 - screeningOnDay.score) / 21) * 100);
        
        try {
          const answers = JSON.parse(screeningOnDay.answer) as { qNumber: number; score: number }[];
          
          // GAD-7 Anxiety sub-scale: Q3 (DASS-28), Q6 (GAD-1), Q7 (GAD-6)
          const anxietyAns = answers.filter((a) => a.qNumber === 3 || a.qNumber === 6 || a.qNumber === 7);
          const anxietyScore = anxietyAns.reduce((sum, a) => sum + a.score, 0);
          const anxietyProgress = Math.round((anxietyScore / 9) * 100);
          let anxietyStatus: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
          if (anxietyScore <= 2) {
            anxietyStatus = "Rendah";
          } else if (anxietyScore <= 5) {
            anxietyStatus = "Sedang";
          } else {
            anxietyStatus = "Tinggi";
          }
          
          // PSS Stress sub-scale: Q1 (DASS-13), Q2 (DASS-15), Q4 (DASS-33), Q5 (PHQ-1)
          const stressAns = answers.filter((a) => a.qNumber === 1 || a.qNumber === 2 || a.qNumber === 4 || a.qNumber === 5);
          const stressScore = stressAns.reduce((sum, a) => sum + a.score, 0);
          const stressProgress = Math.round((stressScore / 12) * 100);
          let stressStatus: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
          if (stressScore <= 3) {
            stressStatus = "Rendah";
          } else if (stressScore <= 7) {
            stressStatus = "Sedang";
          } else {
            stressStatus = "Tinggi";
          }
          
          dayScreeningResults = [
            { label: "Kecemasan (GAD-7)", status: anxietyStatus, progress: anxietyProgress },
            { label: "Stres (PSS)", status: stressStatus, progress: stressProgress },
          ];
        } catch (err) {
          console.error("Failed to parse screening answers on day:", err);
        }
      }
      
      moodData.push({
        day: dayLabels[targetDay.getDay()],
        value: wellnessValue,
        isToday: i === 6,
        dateStr: targetDayStr,
        hasData: !!screeningOnDay,
        screeningResults: dayScreeningResults,
      });
    }

    // 2. Screening Summary
    const latestScreening = await screeningRepository.getLatestScreeningResult(userId);
    let anxietyProgress = 0;
    let anxietyStatus: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
    let stressProgress = 0;
    let stressStatus: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
    
    if (latestScreening) {
      try {
        const answers = JSON.parse(latestScreening.answer) as { qNumber: number; score: number }[];
        
        // GAD-7 Anxiety sub-scale: Q3 (DASS-28), Q6 (GAD-1), Q7 (GAD-6)
        const anxietyAns = answers.filter((a) => a.qNumber === 3 || a.qNumber === 6 || a.qNumber === 7);
        const anxietyScore = anxietyAns.reduce((sum, a) => sum + a.score, 0);
        anxietyProgress = Math.round((anxietyScore / 9) * 100);
        if (anxietyScore <= 2) {
          anxietyStatus = "Rendah";
        } else if (anxietyScore <= 5) {
          anxietyStatus = "Sedang";
        } else {
          anxietyStatus = "Tinggi";
        }
        
        // PSS Stress sub-scale: Q1 (DASS-13), Q2 (DASS-15), Q4 (DASS-33), Q5 (PHQ-1)
        const stressAns = answers.filter((a) => a.qNumber === 1 || a.qNumber === 2 || a.qNumber === 4 || a.qNumber === 5);
        const stressScore = stressAns.reduce((sum, a) => sum + a.score, 0);
        stressProgress = Math.round((stressScore / 12) * 100);
        if (stressScore <= 3) {
          stressStatus = "Rendah";
        } else if (stressScore <= 7) {
          stressStatus = "Sedang";
        } else {
          stressStatus = "Tinggi";
        }
      } catch (err) {
        console.error("Failed to parse screening answers:", err);
      }
    }
    
    const screeningResults = [
      { label: "Kecemasan (GAD-7)", status: anxietyStatus, progress: anxietyProgress },
      { label: "Stres (PSS)", status: stressStatus, progress: stressProgress },
    ];

    // 3. Dynamic Activity Recommendations
    let activityRecommendations: ActivityRecommendation[] = [
      {
        id: "activity-1",
        title: "Journaling Syukur",
        description: "Tuliskan 3 hal yang membuatmu tersenyum hari ini.",
        ctaLabel: "Buka Jurnal",
        icon: "journal" as const,
      },
      {
        id: "activity-2",
        title: "Afirmasi Positif",
        description: "Memperkuat pikiran positif dan rasa percaya diri untuk menjalani hari.",
        ctaLabel: "Mulai Membaca",
        icon: "journal" as const,
      },
    ];
    
    if (latestScreening) {
      if (latestScreening.score >= 14) {
        activityRecommendations = [
          {
            id: "activity-1",
            title: "Latihan Pernapasan 4-7-8",
            description: "Membantu menurunkan detak jantung dan menenangkan sistem saraf segera.",
            ctaLabel: "Mulai Latihan",
            icon: "meditation" as const,
          },
          {
            id: "activity-2",
            title: "Rileksasi Otot Progresif",
            description: "Pelepasan ketegangan fisik akibat tingkat kecemasan yang tinggi.",
            ctaLabel: "Mulai 5 Menit",
            icon: "meditation" as const,
          },
        ];
      } else if (latestScreening.score >= 10) {
        activityRecommendations = [
          {
            id: "activity-1",
            title: "Meditasi Fokus",
            description: "Membantu menjernihkan pikiran dan kecemasan berlebihan.",
            ctaLabel: "Mulai 10 Menit",
            icon: "meditation" as const,
          },
          {
            id: "activity-2",
            title: "Jalan Santai 15 Menit",
            description: "Mengubah suasana untuk menyegarkan pikiran dan mengurangi ketegangan.",
            ctaLabel: "Catat Aktivitas",
            icon: "journal" as const,
          },
        ];
      }
    }

    // 4. Upcoming Appointments (Schedule)
    const upcomingAppointments = await psychologistRepository.getUserUpcomingAppointments(userId);
    
    const formatAppointmentDate = (scheduledAt: Date): string => {
      const date = new Date(scheduledAt);
      
      const nowJakarta = getJakartaDateComponents(now);
      const dateJakarta = getJakartaDateComponents(date);

      const today = new Date(nowJakarta.year, nowJakarta.month, nowJakarta.day);
      const tomorrow = new Date(nowJakarta.year, nowJakarta.month, nowJakarta.day);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const targetDate = new Date(dateJakarta.year, dateJakarta.month, dateJakarta.day);
      
      const timeStr = date.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit"
      }).replace(".", ":");

      if (targetDate.getTime() === today.getTime()) {
        return `Hari ini, ${timeStr}`;
      } else if (targetDate.getTime() === tomorrow.getTime()) {
        return `Besok, ${timeStr}`;
      } else {
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        return `${dateJakarta.day} ${months[dateJakarta.month]}, ${timeStr}`;
      }
    };

    const scheduleItems = upcomingAppointments.map((appt) => {
      return {
        id: appt.id,
        name: appt.psychologistProfile.user.name || "Psikolog",
        role: appt.psychologistProfile.role,
        avatarUrl: appt.psychologistProfile.imageUrl,
        dateLabel: formatAppointmentDate(appt.scheduledAt),
      };
    });

    return {
      user: {
        name: user.name || user.email || "Pengguna",
        image: user.image,
        email: user.email,
        usia: user.usia,
        jenisKelamin: user.jenisKelamin,
      },
      isOnboarded: user.isOnboarded,
      hasScreenedToday,
      moodData,
      screeningResults,
      activityRecommendations,
      scheduleItems,
    };
  }
}

const userService = new UserService();
export default userService;
