import '../config/env.js';
import { getEmailDiagnostics, verifySmtpConnection } from '../services/emailService.js';

console.log('====================================================');
console.log('  HKCL SKILL CENTRE — GMAIL SMTP VERIFICATION TEST  ');
console.log('====================================================\n');

const diag = getEmailDiagnostics();
console.log('Active Email Provider:', diag.provider);
console.log('SMTP Host:            ', diag.host || 'N/A');
console.log('SMTP Port:            ', diag.port || 'N/A');
console.log('SMTP User:            ', diag.user || 'N/A');
console.log('SMTP Password Set:    ', diag.apiKeyPresent ? 'YES (configured)' : 'NO (missing)');
console.log('Sender Address:       ', diag.fromAddress);
console.log('Config Valid:         ', diag.isConfigured);
console.log('----------------------------------------------------');

if (!diag.isConfigured) {
  console.log('\n[NOTICE] SMTP_PASS is currently empty or unconfigured in server/.env.');
  console.log(`To complete setup for ${diag.user}:`);
  console.log('1. Go to your Google Account > Security > 2-Step Verification > App Passwords');
  console.log('2. Create an App Password for "HKCL Skill Centre Portal"');
  console.log('3. Paste the 16-character password into server/.env as SMTP_PASS=xxxx xxxx xxxx xxxx');
  console.log('4. Re-run: node server/scripts/verify-smtp.js\n');
  process.exit(0);
}

console.log('\nConnecting to Gmail SMTP server...');
verifySmtpConnection().then((result) => {
  if (result.success) {
    console.log('\n✓ [PASS] SMTP connection verified successfully!');
    console.log('  Server is ready to dispatch emails from:', diag.fromAddress);
    process.exit(0);
  } else {
    console.log('\n✗ [FAIL] SMTP connection could not be established.');
    console.log('  Error:', result.error);
    if (result.hint) {
      console.log('  Hint:', result.hint);
    }
    process.exit(1);
  }
}).catch((err) => {
  console.error('\n✗ [ERROR] Unexpected exception:', err.message);
  process.exit(1);
});
