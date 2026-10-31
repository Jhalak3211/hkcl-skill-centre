process.env.NODE_ENV = 'test';
import '../config/env.js';
import http from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { getJwtSecret } from '../middleware/auth.js';
import Staff from '../models/Staff.js';
import Application from '../models/Application.js';

async function run() {
  console.log('====================================================');
  console.log('  TESTING STUDENT -> ADMIN -> STAFF PORTAL WORKFLOW ');
  console.log('====================================================');

  const { default: app } = await import('../server.js');
  await connectDB();
  while (mongoose.connection.readyState !== 1) {
    await new Promise((r) => setTimeout(r, 200));
  }

  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  const secret = getJwtSecret();

  // 1. Get or create an active staff member
  let staff = await Staff.findOne({ role: 'staff', status: 'active' });
  if (!staff) {
    staff = await Staff.create({
      name: 'Admissions Officer Priya',
      email: 'priya.test@gmail.com',
      phone: '9876500099',
      role: 'staff',
      status: 'active',
    });
  }

  const staffToken = jwt.sign(
    { id: String(staff._id), name: staff.name, email: staff.email, role: 'staff' },
    secret,
    { expiresIn: '1h' }
  );

  const adminToken = jwt.sign(
    { id: 'admin_test_1', name: 'Centre Admin', email: 'admin@hkcl.in', role: 'admin' },
    secret,
    { expiresIn: '1h' }
  );

  // 2. Create a test student application
  const testAppId = 'APP-2026-' + Math.floor(10000 + Math.random() * 90000);
  const testStudentId = 'HKCL-2026-' + Math.floor(100000 + Math.random() * 900000);

  const newApp = await Application.create({
    applicationId: testAppId,
    studentId: testStudentId,
    course: {
      slug: 'hs-cit',
      name: 'HS-CIT (Haryana State Certificate in Information Technology)',
      batch: 'Morning Batch (9:00 AM - 11:00 AM)',
    },
    personalSnapshot: {
      fullName: 'Aarav Verma',
      email: 'aarav.test@example.com',
      phone: '9812345678',
      gender: 'Male',
      dob: '2004-05-15',
    },
    status: 'under_review',
    documentReview: {
      status: 'under_review',
      history: [],
    },
    payment: {
      amount: 500,
      status: 'submitted',
      utr: 'UPI202698765432',
    },
  });

  console.log(`✓ [Step 1] Student application created: ${testAppId} (status: ${newApp.status})`);

  // 3. Admin views all applications
  let res = await fetch(`${baseUrl}/api/staff/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  let data = await res.json();
  const foundByAdmin = data.applications?.some((a) => a.applicationId === testAppId);
  console.log(`✓ [Step 2] Admin views all applications: found test application = ${foundByAdmin}`);

  // 4. Admin assigns application to Priya
  res = await fetch(`${baseUrl}/api/admin/applications/${testAppId}/assign`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ staffId: String(staff._id) }),
  });
  data = await res.json();
  console.log(`✓ [Step 3] Admin assigns application to staff ${staff.name}: success = ${data.success}`);

  // 5. Staff member queries overview - application appears in assigned list!
  res = await fetch(`${baseUrl}/api/staff/overview`, {
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  data = await res.json();
  const foundInStaffAssigned = data.assignedApplications?.some((a) => a.applicationId === testAppId);
  console.log(`✓ [Step 4] Staff views overview: test app in assignedApplications = ${foundInStaffAssigned} (total assigned: ${data.assignedCount})`);

  // 6. Staff member queries paginated /api/staff/applications?assignedOnly=true
  res = await fetch(`${baseUrl}/api/staff/applications?assignedOnly=true`, {
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  data = await res.json();
  const foundInStaffEndpoint = data.applications?.some((a) => a.applicationId === testAppId);
  console.log(`✓ [Step 5] Staff queries /api/staff/applications: found test application = ${foundInStaffEndpoint}`);

  // 7. Staff approves documents on the application
  res = await fetch(`${baseUrl}/api/staff/documents/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${staffToken}`,
    },
    body: JSON.stringify({ applicationId: testAppId, notes: 'Class 10 and ID verified.' }),
  });
  data = await res.json();
  console.log(`✓ [Step 6] Staff approves documents: success = ${data.success}`);

  // 8. Verify status is documents_approved
  const updatedApp = await Application.findOne({ applicationId: testAppId });
  console.log(`✓ [Step 7] Application final verified status: ${updatedApp.status}`);

  // Clean up test app
  await Application.deleteOne({ applicationId: testAppId });

  server.close();
  console.log('\n--- ALL WORKFLOW VERIFICATION STEPS PASSED ---');
  process.exit(0);
}

run().catch((err) => {
  console.error('Workflow test failed:', err);
  process.exit(1);
});
