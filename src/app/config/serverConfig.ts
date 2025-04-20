import {z} from "zod";

/*
 * The schema for the server-side environment variables
 * These variables should be defined in:
 * * the app/.env.development.local file for the local environment
 * * the Vercel's UI for the deployed environment
 * They must not be tracked by Git
 * They are SECRET, and not exposed to the client side
 */

const serverConfigSchema = z.object({
    COINGECKO_API_KEY: z.string(),
    CRON_SECRET: z.string(),
    OPENAI_API_KEY: z.string(),
    TWITTER_BEARER_TOKEN: z.string(),
});

const serverConfig = serverConfigSchema.safeParse({
    COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
});

if (!serverConfig.success) {
    console.error("Invalid environment variables:", serverConfig.error.format());
    throw new Error("Invalid environment variables");
}

export default serverConfig.data;
