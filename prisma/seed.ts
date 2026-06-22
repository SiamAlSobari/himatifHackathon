import { envConfig } from "@/lib/constants/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { seedPsychologists } from "./seeders/psychologies";

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: envConfig.DatabaseUrl! }),
})

async function main() {
    await seedPsychologists(prisma)
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
        await prisma.$disconnect();
    });