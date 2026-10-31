import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import '../config/env.js';

/**
 * EMAIL VERIFICATION & INVITATION SERVICE (Gmail SMTP via Nodemailer & Resend Fallback)
 * ---------------------------------------------------------------------------
 * Handles token generation, SHA-256 token hashing at rest, and email delivery.
 * Active provider is controlled via EMAIL_PROVIDER ('gmail' or 'resend').
 *
 * Gmail SMTP Configuration:
 * - EMAIL_PROVIDER=gmail
 * - SMTP_HOST=smtp.gmail.com
 * - SMTP_PORT=465
 * - SMTP_USER=info@hkcl.in
 * - SMTP_PASS (16-character Google App Password)
 * - EMAIL_FROM=HKCL Skill Centre <info@hkcl.in>
 */

export function createSmtpTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = (process.env.SMTP_USER || 'achariyainstitute@gmail.com').trim();
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '').trim();

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL on 465, TLS/STARTTLS on 587
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
  });
}

export function getEmailDiagnostics() {
  const provider = (process.env.EMAIL_PROVIDER || 'gmail').toLowerCase().trim();
  const defaultFrom = 'HKCL Skill Centre <achariyainstitute@gmail.com>';
  const fromAddress = process.env.EMAIL_FROM || defaultFrom;

  if (provider === 'gmail' || provider === 'smtp') {
    const user = (process.env.SMTP_USER || 'achariyainstitute@gmail.com').trim();
    const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '').trim();
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 465;
    const isPresent = Boolean(user && pass.length > 0);
    const isConfigured = Boolean(isPresent && !pass.includes('your_16_char'));

    return {
      provider: 'gmail',
      isConfigured,
      apiKeyPresent: isPresent,
      apiKeyFormatValid: isConfigured,
      keyPrefix: isPresent ? pass.substring(0, 3) + '***' : 'none',
      user,
      host,
      port,
      fromAddress,
    };
  }

  // Resend Fallback
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const isPresent = Boolean(apiKey.length > 0);
  const isValidFormat = Boolean(isPresent && apiKey.startsWith('re_') && !apiKey.includes('YourResendApiKey'));

  return {
    provider: 'resend',
    isConfigured: isValidFormat,
    apiKeyPresent: isPresent,
    apiKeyFormatValid: isValidFormat,
    keyPrefix: isPresent ? apiKey.substring(0, 5) + '...' : 'none',
    fromAddress,
  };
}

export function isEmailConfigured() {
  return getEmailDiagnostics().isConfigured;
}

export async function verifySmtpConnection() {
  const diag = getEmailDiagnostics();
  if (diag.provider !== 'gmail') {
    return {
      success: false,
      error: `Current active EMAIL_PROVIDER is '${diag.provider}', not Gmail SMTP.`,
    };
  }

  if (!diag.isConfigured) {
    return {
      success: false,
      error: 'Gmail SMTP credentials unconfigured (missing SMTP_PASS in server/.env). Please supply your 16-character Google App Password.',
      hint: 'Generate an App Password at: Google Account > Security > 2-Step Verification > App Passwords',
    };
  }

  try {
    const transporter = createSmtpTransporter();
    await transporter.verify();
    return {
      success: true,
      message: `SMTP connection established successfully to ${diag.host}:${diag.port} as ${diag.user}.`,
      host: diag.host,
      port: diag.port,
      user: diag.user,
    };
  } catch (err) {
    console.error('[EmailService] SMTP verification failed:', err.message);
    return {
      success: false,
      error: err.message || 'Failed to verify SMTP connection.',
      code: err.code,
      hint: err.code === 'EAUTH'
        ? 'Authentication failed. Please verify that SMTP_PASS is a 16-character Google App Password (not your normal Google account password).'
        : undefined,
    };
  }
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

export function generateStaffInvitationToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
  return { rawToken, tokenHash, expires };
}

export async function sendVerificationEmail({ email, fullName, studentId, rawToken }) {
  const diag = getEmailDiagnostics();
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const verificationUrl = `${clientOrigin}/admission/verify-email?token=${rawToken}`;
  const fromAddress = diag.fromAddress;

  if (!diag.isConfigured) {
    console.warn(`[EmailService] ${diag.provider.toUpperCase()} unconfigured. Cannot dispatch verification email to ${email}.`);
    return {
      sent: false,
      reason: 'MISSING_EMAIL_CONFIGURATION',
      error: diag.provider === 'gmail'
        ? 'Gmail SMTP password is unconfigured (SMTP_PASS missing in server/.env).'
        : 'Resend API key is unconfigured (RESEND_API_KEY).',
    };
  }

  const subject = 'Verify Your Email — HKCL Skill Centre Admission Portal';
  const html = `
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
  `;

  // 1. Gmail SMTP dispatch
  if (diag.provider === 'gmail') {
    try {
      const transporter = createSmtpTransporter();
      const info = await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject,
        html,
      });

      console.log(`[EmailService] Verification email accepted by Gmail SMTP (messageId: ${info.messageId}) for ${email}`);
      return {
        sent: true,
        id: info.messageId,
        message: `Verification email dispatched to ${email} via Gmail SMTP.`,
      };
    } catch (err) {
      console.error('[EmailService] Gmail SMTP error on verification email:', err.message || err);
      return {
        sent: false,
        reason: 'PROVIDER_ERROR',
        error: err.message || 'Gmail SMTP delivery failed.',
      };
    }
  }

  // 2. Resend API dispatch (fallback)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY.trim());
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject,
      html,
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

export async function sendStaffInvitationEmail({ email, name, rawToken, designation, invitedBy }) {
  const diag = getEmailDiagnostics();
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const inviteUrl = `${clientOrigin}/staff/accept-invite?token=${rawToken}`;
  const fromAddress = diag.fromAddress;

  console.log(`[EmailService] Staff invite dispatch request for ${email}: Provider=${diag.provider}, Configured=${diag.isConfigured}`);

  if (!diag.isConfigured) {
    const errorMsg = diag.provider === 'gmail'
      ? 'Gmail SMTP password is unconfigured (SMTP_PASS missing in server/.env). For immediate testing/setup, use the direct invitation link.'
      : 'Email provider is unconfigured. For immediate testing/setup, use the direct invitation link.';

    console.warn(`[EmailService] ${diag.provider.toUpperCase()} unconfigured. Staff invitation link for ${email}: ${inviteUrl}`);
    return {
      sent: false,
      isConfigured: false,
      provider: diag.provider,
      reason: 'MISSING_EMAIL_CONFIGURATION',
      error: errorMsg,
      inviteUrl,
    };
  }

  const subject = 'Staff Invitation — HKCL Skill Centre Portal';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 22px;">HKCL Skill Centre</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Staff Administration Portal • Sirsa</p>
      </div>
      <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0 0 10px 0; color: #1e293b; font-size: 15px;">Hello <strong>${name || 'Staff Member'}</strong>,</p>
        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">
          You have been invited by <strong>${invitedBy || 'the Centre Administrator'}</strong> to join the HKCL Skill Centre admissions and staff team as <strong>${designation || 'Admissions Officer'}</strong>.
        </p>
        <p style="margin: 12px 0 0 0; color: #475569; font-size: 14px; line-height: 1.5;">
          Please click the button below to accept your invitation and set your account password:
        </p>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${inviteUrl}" style="background-color: #1e3a8a; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
          Accept Invitation &amp; Set Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px; line-height: 1.4;">
        This invitation link is valid for 48 hours and can only be used once. If the button above does not work, copy and paste this URL into your browser:
        <br />
        <a href="${inviteUrl}" style="color: #2563eb; word-break: break-all;">${inviteUrl}</a>
      </p>
    </div>
  `;

  // 1. Gmail SMTP Dispatch via Nodemailer
  if (diag.provider === 'gmail') {
    try {
      const transporter = createSmtpTransporter();
      const info = await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject,
        html,
      });

      console.log(`[EmailService] Invitation email accepted by Gmail SMTP (messageId: ${info.messageId}) for ${email}`);
      return {
        sent: true,
        isConfigured: true,
        provider: 'gmail',
        id: info.messageId,
        message: `Invitation email dispatched to ${email} via Gmail SMTP.`,
        inviteUrl,
      };
    } catch (err) {
      console.error('[EmailService] Gmail SMTP error on staff invite:', err.message || err);
      return {
        sent: false,
        isConfigured: true,
        provider: 'gmail',
        reason: 'PROVIDER_ERROR',
        error: err.message || 'Gmail SMTP delivery failed.',
        inviteUrl,
      };
    }
  }

  // 2. Resend API Dispatch (Fallback)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY.trim());
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.warn('[EmailService] Resend API provider response on staff invite:', error.message || error);
      return {
        sent: false,
        isConfigured: true,
        provider: 'resend',
        reason: 'PROVIDER_ERROR',
        error: error.message || 'Email delivery failed.',
        inviteUrl,
      };
    }

    console.log(`[EmailService] Invitation email successfully accepted by Resend (id: ${data?.id}) for ${email}`);
    return {
      sent: true,
      isConfigured: true,
      provider: 'resend',
      id: data?.id,
      message: `Invitation email dispatched to ${email}.`,
      inviteUrl,
    };
  } catch (err) {
    console.error('[EmailService] Exception on staff invite email:', err.message || err);
    return {
      sent: false,
      isConfigured: true,
      provider: 'resend',
      reason: 'PROVIDER_ERROR',
      error: err.message || 'Unexpected failure while sending staff invitation email.',
      inviteUrl,
    };
  }
}
