import './config/env.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { seedInitialAdmin } from './config/seedAdmin.js';
import { getEmailDiagnostics } from './services/emailService.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import advertisementRoutes from './routes/advertisementRoutes.js';

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

// Connect to MongoDB, run duplicate audit, and auto-seed admin & default advertisement
connectDB().then(() => {
  seedInitialAdmin().catch((err) => console.warn('[SeedAdmin] Notice:', err.message));
  import('./controllers/authController.js')
    .then(({ auditExistingDuplicates }) => auditExistingDuplicates())
    .catch(() => {});
  import('./models/Advertisement.js').then(async ({ default: Advertisement }) => {
    const count = await Advertisement.countDocuments().catch(() => 0);
    if (count === 0) {
      await Advertisement.create({
        title: 'Admissions Open 2026: HS-CIT & Advanced IT Programs',
        description: 'Join Haryana Knowledge Corporation Limited certified computer and skill development programs at our authorized Sirsa centre. Hands-on practical training with government-recognized certification.',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        ctaText: 'Apply for Admission',
        ctaUrl: '/admission/personal-details',
        badge: 'New Batch 2026',
        status: 'published',
        displayOrder: 0,
      }).catch(() => {});
    }
  }).catch(() => {});
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/advertisements', advertisementRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'HKCL Skill Centre Portal Backend',
    version: '2.0.0',
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
      error:
        'Upload payload exceeds the allowed size limit (maximum 20MB). Please compress photos or documents before uploading.',
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

// Start HTTP server only if not in test suite environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[HKCL Server] Running on http://localhost:${PORT}`);
    console.log(`[HKCL Server] Accepting origins: ${CLIENT_ORIGIN}`);
    const emailDiag = getEmailDiagnostics();
    console.log(`[HKCL Server] Email Service Configured: ${emailDiag.isConfigured} (Key present: ${emailDiag.apiKeyPresent}, valid: ${emailDiag.apiKeyFormatValid}, prefix: ${emailDiag.keyPrefix}, from: "${emailDiag.fromAddress}")`);
  });
}

// Auto-reloaded configuration
export default app;
