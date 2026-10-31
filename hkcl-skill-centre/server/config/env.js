import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the server folder first, then root folder as fallback
const serverEnv = path.resolve(__dirname, '../.env');
const rootEnv = path.resolve(__dirname, '../../.env');

dotenv.config({ path: serverEnv });
dotenv.config({ path: rootEnv });
dotenv.config();

export const isEnvLoaded = Boolean(process.env.RESEND_API_KEY || process.env.MONGODB_URI);
