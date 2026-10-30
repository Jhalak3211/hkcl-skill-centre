import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory or root directory
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config(); // fallback to current working directory if exists

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import staffRoutes from './routes/staffRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: [CLIENT_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
// Support base64 document uploads (photo, signature, marksheets, ID proof)
// 20MB limit accommodates representative applicant documents while preventing DoS
app.use(
  express.json({
    limit: '20mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Connect to MongoDB and run duplicate audit
connectDB().then(() => {
  import('./controllers/authController.js')
    .then(({ auditExistingDuplicates }) => auditExistingDuplicates())
    .catch(() => {});
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/staff', staffRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'HKCL Skill Centre Portal Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    feeConfig: {
      registrationFeeInr: 500,
      currency: 'INR',
    },
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      success: false,
      code: 'PAYLOAD_TOO_LARGE',
      error: 'Upload payload exceeds the allowed size limit (maximum 20MB). Please compress photos or documents before uploading.',
    });
  }
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred.',
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection]', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err);
});

// Start Server when executed directly
const isMainModule =
  process.argv[1] &&
  (process.argv[1].replace(/\\/g, '/').endsWith('/server.js') ||
   process.argv[1].replace(/\\/g, '/').endsWith('/server/server.js'));

if (isMainModule) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  HKCL Skill Centre API Server is running on port ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Registration Fee: INR 500 (Strictly enforced)`);
    console.log(`=======================================================`);
  });
}

export default app;
