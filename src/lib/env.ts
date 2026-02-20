import { z } from "zod";

const envSchema = z.object({
    MONGODB_URI: z.string().default("mongodb://localhost:27017/bento-ai"),
    NEXTAUTH_SECRET: z.string().default("secret"),
    NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

let env: z.infer<typeof envSchema>;

try {
    env = envSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error("❌ Invalid environment variables:", JSON.stringify(error.format(), null, 2));
    } else {
        console.error("❌ Unknown error parsing environment variables:", error);
    }
    process.exit(1);
}

export { env };
