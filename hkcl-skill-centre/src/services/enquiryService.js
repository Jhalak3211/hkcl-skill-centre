/**
 * Enquiry Service
 * ---------------------------------------------------------------------------
 * Handles student enquiry submissions.
 * In a frontend-only deployment without an active backend server, enquiries are
 * formatted and delivered directly to the official HKCL admission desk via WhatsApp
 * and phone, with persistent client-side backup in localStorage.
 * When the backend API is connected in the future, it seamlessly synchronizes with MongoDB.
 */

import { apiRequest } from './api.js';
import { siteConfig } from '../data/siteConfig.js';

/**
 * @typedef {Object} EnquiryData
 * @property {string} name - Student's full name
 * @property {string} phone - Contact phone number
 * @property {string} [email] - Optional email address
 * @property {string} [course] - Course slug or title of interest
 * @property {string} [message] - Student query or notes
 */

/**
 * Submits an enquiry form.
 *
 * @param {EnquiryData} data
 * @returns {Promise<{ success: boolean, message: string, whatsappUrl: string, enquiry: EnquiryData }>}
 */
export async function submitEnquiry(data) {
  // Validate required fields
  if (!data.name || !data.name.trim()) {
    throw new Error('Please enter your full name.');
  }

  const cleanPhone = (data.phone || '').replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    throw new Error('Please enter a valid 10-digit phone number.');
  }

  const timestamp = new Date().toISOString();
  const enquiryPayload = {
    ...data,
    name: data.name.trim(),
    phone: cleanPhone,
    email: data.email?.trim() || '',
    course: data.course?.trim() || 'General Enquiry',
    message: data.message?.trim() || '',
    submittedAt: timestamp,
  };

  // 1. Save locally to localStorage so inquiries are never lost
  try {
    const existing = JSON.parse(localStorage.getItem('hkcl_enquiries') || '[]');
    existing.unshift({ id: Date.now().toString(), ...enquiryPayload });
    localStorage.setItem('hkcl_enquiries', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    // Ignore localStorage storage exceptions
  }

  // 2. Format pre-filled WhatsApp message for the official coordinator
  const whatsappLines = [
    `*Admission Enquiry - HKCL Skill Centre*`,
    `*Student Name:* ${enquiryPayload.name}`,
    `*Phone:* ${enquiryPayload.phone}`,
    enquiryPayload.email ? `*Email:* ${enquiryPayload.email}` : null,
    `*Course Interest:* ${enquiryPayload.course}`,
    enquiryPayload.message ? `*Message:* ${enquiryPayload.message}` : null,
    `_Sent via official website enquiry desk_`,
  ].filter(Boolean);

  const whatsappMessage = encodeURIComponent(whatsappLines.join('\n'));
  const whatsappNumber = siteConfig.contact.whatsappNumber || '917988919393';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // 3. Attempt backend API if endpoint is deployed
  try {
    await apiRequest('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryPayload),
    });
  } catch (error) {
    // Backend offline / not deployed on Vercel frontend; fallback safely
  }

  return {
    success: true,
    message: 'Enquiry prepared successfully! Connect directly with the centre coordinator on WhatsApp or call.',
    whatsappUrl,
    enquiry: enquiryPayload,
  };
}
