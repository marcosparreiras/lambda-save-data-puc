import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    DB_URL_PRODUCTION: z.string().url(),
    DB_URL_TEST: z.string().url(),
    GOOGLE_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
