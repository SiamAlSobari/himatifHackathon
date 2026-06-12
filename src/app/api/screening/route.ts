import { ScreeningRequest } from "@/lib/types/screening";
import screeningService from "@/services/screening.service";

export async function POST(request: Request) {
    const { type, answers } = await request.json() as ScreeningRequest;

    const result = await screeningService.calculateScreeningScore({ type, answers });
    return new Response(JSON.stringify(result), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}