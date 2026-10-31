process.env.NODE_ENV = 'test';
import '../config/env.js';
import http from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { getJwtSecret } from '../middleware/auth.js';
import { clearRateLimits } from '../middleware/rateLimiter.js';
import Staff from '../models/Staff.js';

async function runTests() {
  const { default: app } = await import('../server.js');
  console.log('====================================================');
  console.log('  TESTING ADMIN & STAFF AUTH, ROUTING & SECURITY     ');
  console.log('====================================================');

  await connectDB();
  while (mongoose.connection.readyState !== 1) {
    await new Promise((r) => setTimeout(r, 200));
  }

  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Tokens
  const secret = getJwtSecret();
  const adminToken = jwt.sign(
    { id: 'admin_test_1', name: 'Centre Admin', email: 'admin@hkcl.in', role: 'admin' },
    secret,
    { expiresIn: '1h' }
  );

  const staffToken = jwt.sign(
    { id: 'staff_test_1', name: 'Desk Staff', email: 'staff@example.com', role: 'staff' },
    secret,
    { expiresIn: '1h' }
  );

  const studentToken = jwt.sign(
    { studentId: 'HKCL-2026-000001', email: 'student@example.com' },
    secret,
    { expiresIn: '1h' }
  );

  console.log('\n--- Test Group 1: Role-Based Access Control on Admin API ---');

  // 1. Unauthenticated request to /api/admin/overview
  let res = await fetch(`${baseUrl}/api/admin/overview`);
  let data = await res.json().catch(() => ({}));
  assert(res.status === 401, 'Unauthenticated request to /api/admin/overview rejected with 401');

  // 2. Staff token to /api/admin/overview
  res = await fetch(`${baseUrl}/api/admin/overview`, {
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  data = await res.json().catch(() => ({}));
  assert(res.status === 403, 'Staff token to /api/admin/overview rejected with 403 Forbidden');

  // 3. Student token to /api/admin/overview
  res = await fetch(`${baseUrl}/api/admin/overview`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  data = await res.json().catch(() => ({}));
  assert(res.status === 403, 'Student token to /api/admin/overview rejected with 403 Forbidden');

  // 4. Admin token to /api/admin/overview
  res = await fetch(`${baseUrl}/api/admin/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  data = await res.json().catch(() => ({}));
  assert(res.status === 200 && data.success === true, 'Admin token to /api/admin/overview granted with 200 OK');

  console.log('\n--- Test Group 2: Rate Limiting on Admin Login Attempts ---');
  clearRateLimits();

  const ip = '192.168.1.100';
  let lastStatus = 0;
  let retryAfterHeader = null;

  for (let i = 1; i <= 6; i++) {
    res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify({
        identifier: 'brute_force_target@hkcl.in',
        password: 'wrong_password_' + i,
      }),
    });
    lastStatus = res.status;
    retryAfterHeader = res.headers.get('retry-after');
  }

  assert(lastStatus === 429, '6th admin login attempt triggers 429 Too Many Requests');
  assert(Boolean(retryAfterHeader), '429 response contains Retry-After header');

  clearRateLimits();

  console.log('\n--- Test Group 3: Staff Inactive / Deactivated Status Enforcement ---');

  // Setup test staff accounts in MongoDB
  const pendingEmail = 'test.pending.' + Date.now() + '@example.com';
  const deactivatedEmail = 'test.deactivated.' + Date.now() + '@example.com';
  const activeEmail = 'test.active.' + Date.now() + '@example.com';

  const hashedPassword = await bcrypt.hash('SamplePassword@123', 10);

  await Staff.create([
    {
      name: 'Pending Staff',
      email: pendingEmail,
      phone: '9876500001',
      role: 'staff',
      status: 'pending',
    },
    {
      name: 'Deactivated Staff',
      email: deactivatedEmail,
      phone: '9876500002',
      role: 'staff',
      status: 'deactivated',
      password: hashedPassword,
    },
    {
      name: 'Active Staff',
      email: activeEmail,
      phone: '9876500003',
      role: 'staff',
      status: 'active',
      password: hashedPassword,
    },
  ]);

  // Attempt login as pending staff
  res = await fetch(`${baseUrl}/api/admin/staff-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: pendingEmail, password: 'AnyPassword@123' }),
  });
  data = await res.json().catch(() => ({}));
  assert(res.status === 403 && data.code === 'INVITATION_PENDING', 'Pending staff login rejected with 403 INVITATION_PENDING');

  // Attempt login as deactivated staff
  res = await fetch(`${baseUrl}/api/admin/staff-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: deactivatedEmail, password: 'SamplePassword@123' }),
  });
  data = await res.json().catch(() => ({}));
  assert(res.status === 403 && data.code === 'ACCOUNT_DEACTIVATED', 'Deactivated staff login rejected with 403 ACCOUNT_DEACTIVATED');

  // Attempt login as active staff
  res = await fetch(`${baseUrl}/api/admin/staff-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: activeEmail, password: 'SamplePassword@123' }),
  });
  data = await res.json().catch(() => ({}));
  assert(res.status === 200 && data.success === true, 'Active staff login succeeds with 200 OK');

  // Clean up test staff
  await Staff.deleteMany({ email: { $in: [pendingEmail, deactivatedEmail, activeEmail] } });

  console.log('\n--- Test Group 4: Student Passwordless Login Remains Functional ---');
  res = await fetch(`${baseUrl}/api/auth/find-id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent.student@example.com' }),
  });
  data = await res.json().catch(() => ({}));
  assert(res.status === 404 && data.success === false, 'Student passwordless find-id endpoint is intact and responsive');

  server.close();

  console.log('\n====================================================');
  console.log(`  SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
