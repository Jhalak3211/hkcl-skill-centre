import crypto from 'crypto';
import { Resend } from 'resend';

/**
 * EMAIL VERIFICATION SERVICE (Resend SDK)
 * ---------------------------------------------------------------------------
 * Handles token generation, SHA-256 token hashing at rest, and email delivery via Resend.
 * Credentials are read exclusively from environment variables:
 * - RESEND_API_KEY
 * - EMAIL_FROM
 * - CLIENT_ORIGIN
 */

export function isEmailConfigured() {
  const apiKey = process.env.RESEND_API_KEY;
  return Boolean(apiKey && apiKey.trim().startsWith('re_') && !apiKey.includes('YourResendApiKey'));
}

export function hashToken(rawToken) {
  if (!rawToken) return null;
  return crypto.createHash('sha256').update(String(rawToken).trim()).digest('hex');
}

export function generateVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { rawToken, tokenHash, expires };
}

export async function sendVerificationEmail({ email, fullName, studentId, rawToken }) {
  if (!isEmailConfigured()) {
    console.warn(`[EmailService] Missing RESEND_API_KEY in environment. Cannot dispatch email to ${email}.`);
    return {
      sent: false,
      reason: 'MISSING_EMAIL_CONFIGURATION',
      error: 'Resend API key is unconfigured (RESEND_API_KEY). Email delivery could not be performed.',
    };
  }

  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const verificationUrl = `${clientOrigin}/admission/verify-email?token=${rawToken}`;
  const fromAddress = process.env.EMAIL_FROM || 'HKCL Skill Centre <onboarding@resend.dev>';

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: 'Verify Your Email — HKCL Skill Centre Admission Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 22px;">HKCL Skill Centre</h2>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Haryana Knowledge Corporation Limited</p>
          </div>
          <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px 0; color: #1e293b; font-size: 15px;">Dear <strong>${fullName || 'Student'}</strong>,</p>
            <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
              Thank you for registering at HKCL Skill Centre. Your Student Reference ID is <strong style="color: #1e3a8a;">${studentId}</strong>.
              Please click the button below to verify your email address and activate your student portal account:
            </p>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verificationUrl}" style="background-color: #f97316; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.4;">
            This single-use link expires in 24 hours. If the button above does not work, copy and paste this link into your browser:
            <br />
            <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[EmailService] Resend API error:', error);
      return {
        sent: false,
        reason: 'PROVIDER_ERROR',
        error: error.message || 'Resend provider rejected email dispatch.',
      };
    }

    return {
      sent: true,
      id: data?.id,
      message: `Verification email dispatched to ${email}.`,
    };
  } catch (err) {
    console.error('[EmailService] Network/SDK exception:', err);
    return {
      sent: false,
      reason: 'PROVIDER_ERROR',
      error: err.message || 'Unexpected failure while sending verification email.',
    };
  }
}
