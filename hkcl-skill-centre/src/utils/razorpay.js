/**
 * RAZORPAY PAYMENT GATEWAY UTILITIES & INTEGRATION SPECIFICATION
 * ---------------------------------------------------------------------------
 * Architecture for HKCL Skill Centre Registration Fee (₹500):
 *
 * 1. Client initiates checkout -> POST /api/payment/create-order
 *    Backend verifies student application and calls Razorpay Orders API:
 *    razorpay.orders.create({
 *      amount: 50000, // ₹500.00 in smallest currency unit (paise)
 *      currency: 'INR',
 *      receipt: `RCPT-${applicationId}`,
 *      notes: { applicationId, studentId, courseSlug }
 *    });
 *
 * 2. Razorpay Checkout modal opens on client with returned `order_id` and public `key_id`.
 *    (Client code NEVER holds or exposes RAZORPAY_KEY_SECRET).
 *
 * 3. On successful authorization, client posts gateway response to backend:
 *    POST /api/payment/verify-signature
 *    {
 *      razorpay_order_id,
 *      razorpay_payment_id,
 *      razorpay_signature,
 *      applicationId
 *    }
 *
 * 4. Backend computes HMAC SHA256 of (order_id + "|" + payment_id) using key_secret
 *    and compares with razorpay_signature.
 *    Only upon mathematical signature match is the application locked and marked paid.
 */

export const REGISTRATION_FEE_INR = 500;
export const REGISTRATION_FEE_PAISE = 50000;

/**
 * Dynamically loads Razorpay checkout script from official CDN.
 */
export const loadRazorpayCheckoutScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Razorpay checkout script from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Production endpoint specification for Express backend:
 * POST /api/payment/create-order
 */
export async function createBackendPaymentOrder(applicationData) {
  try {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: applicationData.id,
        amount: REGISTRATION_FEE_PAISE,
        currency: 'INR',
        customer: {
          name: applicationData.personal?.fullName,
          phone: applicationData.personal?.phone,
          email: applicationData.personal?.email,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Server returned ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    // Backend offline / not deployed
    return {
      success: false,
      isBackendOffline: true,
      error: err.message,
    };
  }
}

/**
 * Production endpoint specification for Express backend:
 * POST /api/payment/verify-signature
 */
export async function verifyBackendPaymentSignature(paymentResponse, applicationId) {
  try {
    const response = await fetch('/api/payment/verify-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Signature verification failed on server');
    }

    return await response.json();
  } catch (err) {
    return {
      success: false,
      isBackendOffline: true,
      error: err.message,
    };
  }
}
