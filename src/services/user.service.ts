import userRepository from "@/repositories/user.repository";
import screeningService from "./screening.service";

export class UserService {
  async resolveLoginDestination(userId: string): Promise<string> {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      return "/login";
    }

    if (user.role === "PSYCHOLOGY") {
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
}

const userService = new UserService();
export default userService;
