import {z} from "zod";


const clientConfigSchema = z.object({
    RECAPTCHA_SITE_KEY: z.string().optional(),
});

const clientConfig = clientConfigSchema.safeParse({
    RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
});

if (!clientConfig.success) {
    console.error("Invalid environment variables:", clientConfig.error.format());
    throw new Error("Invalid environment variables");
}

export default clientConfig.data;
