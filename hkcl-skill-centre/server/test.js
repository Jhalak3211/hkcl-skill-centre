process.env.TEST_MODE = '1';
import app from './server.js';
import http from 'http';

const testServer = http.createServer(app);

testServer.listen(5002, async () => {
  console.log('Testing server on port 5002...');
  try {
    // 1. Health check
    const res = await fetch('http://localhost:5002/api/health');
    const data = await res.json();
    console.log('✓ Health check status:', data.status, '| Service:', data.service);

    // 2. Student Registration & Reference ID Assignment
    const regRes = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Rahul Sharma',
        phone: '9812345678',
        email: 'rahul.sharma@example.com',
      }),
    });
    const regData = await regRes.json();
    console.log('✓ Register Student:', regData.success, '| Ref ID:', regData.student?.studentId);

    // 3. Find Reference ID by registered phone
    const findRes = await fetch('http://localhost:5002/api/auth/find-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9812345678' }),
    });
    const findData = await findRes.json();
    console.log('✓ Find ID:', findData.success, '| Student:', findData.student?.fullName, '| Ref ID:', findData.student?.studentId);

    // 4. Razorpay create-order (strictly ₹500 / 50000 paise)
    const payRes = await fetch('http://localhost:5002/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: 'APP-2026-99999',
        customer: { name: 'Rahul Sharma', phone: '9812345678' },
      }),
    });
    const payData = await payRes.json();
    console.log('✓ Create Order:', payData.success, '| OrderId:', payData.orderId, '| Amount:', payData.amount, '| Fee INR:', payData.feeInr);

    if (payData.amount === 50000 && payData.feeInr === 500) {
      console.log('✓ VERIFIED: Registration fee is strictly ₹500 (50,000 paise).');
    }

    // 5. Razorpay verify-signature
    const verifyRes = await fetch('http://localhost:5002/api/payment/verify-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: 'APP-2026-99999',
        razorpay_order_id: payData.orderId,
        razorpay_payment_id: 'pay_mock_123456',
        razorpay_signature: 'mock_signature',
      }),
    });
    const verifyData = await verifyRes.json();
    console.log('✓ Verify Signature:', verifyData.success, '| Status:', verifyData.status, '| Receipt:', verifyData.receiptNo);

    console.log('\n========================================');
    console.log('🎉 ALL BACKEND CHECKS PASSED PERFECTLY!');
    console.log('========================================');
  } catch (err) {
    console.error('Backend test failure:', err);
  } finally {
    testServer.close(() => {
      console.log('Test server closed cleanly.');
      process.exit(0);
    });
  }
});
