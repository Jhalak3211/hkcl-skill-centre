import { useState } from 'react';
import { CheckCircle2, Loader2, Send, Phone, MessageCircle } from 'lucide-react';
import Button from './Button.jsx';
import { submitEnquiry } from '../services/enquiryService.js';
import { courses } from '../data/courses.js';
import { siteConfig } from '../data/siteConfig.js';
import { WhatsAppIcon } from './SocialIcons.jsx';

export default function EnquiryForm({ initialCourse = '', className = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: initialCourse,
    message: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await submitEnquiry(formData);
      setSubmissionResult(res);
      setStatus('success');

      // Attempt to open WhatsApp in a new tab with pre-filled message
      if (res.whatsappUrl) {
        try {
          window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
        } catch (_) {
          // If popup is blocked by browser, user can click the button on screen
        }
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try calling the centre directly.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      course: initialCourse,
      message: '',
    });
    setStatus('idle');
    setErrorMessage('');
    setSubmissionResult(null);
  };

  if (status === 'success' && submissionResult) {
    const { whatsappUrl, enquiry } = submissionResult;
    return (
      <div
        className={`rounded-2xl border border-emerald-200 bg-emerald-50/90 p-6 sm:p-8 text-center backdrop-blur-md ${className}`}
        role="alert"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-2xs">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-emerald-950 sm:text-2xl">
          Enquiry Received &amp; Prepared!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-emerald-800">
          Your enquiry for <strong>{enquiry.course}</strong> has been recorded. Connect with our admission desk on WhatsApp to receive immediate batch timings and fee structure.
        </p>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#20ba59] hover:shadow-md active:scale-[0.99]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={`tel:${siteConfig.contact.phoneE164}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-2xs transition-all duration-200 hover:bg-emerald-50"
          >
            <Phone className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span>Call {siteConfig.contact.phoneDisplay}</span>
          </a>
        </div>

        {/* Enquiry Summary */}
        <div className="mt-6 rounded-xl border border-emerald-200/80 bg-white/80 p-4 text-left text-xs sm:text-sm text-slate-700">
          <p className="font-semibold text-brand-950">Submitted Details:</p>
          <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
            <div><span className="text-slate-500">Name:</span> {enquiry.name}</div>
            <div><span className="text-slate-500">Phone:</span> {enquiry.phone}</div>
            <div><span className="text-slate-500">Course:</span> {enquiry.course}</div>
            {enquiry.email && <div><span className="text-slate-500">Email:</span> {enquiry.email}</div>}
          </div>
          {enquiry.message && (
            <div className="mt-2 text-slate-600">
              <span className="text-slate-500">Query:</span> {enquiry.message}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-950"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-brand-100/90 bg-white/80 p-6 shadow-xs backdrop-blur-md sm:p-8 ${className}`}
      noValidate
    >
      <h3 className="text-xl font-semibold text-brand-950">
        Send an Online Enquiry
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Leave your details and we will get back to you with syllabus, fee structure and upcoming batches.
      </p>

      {status === 'error' && (
        <div
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-sm text-rose-700"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="enquiry-name" className="block text-sm font-medium text-brand-950">
            Full Name <span className="text-rose-600">*</span>
          </label>
          <input
            id="enquiry-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            className="mt-1.5 min-h-11 w-full rounded-xl border border-brand-200/90 bg-white px-4 text-sm text-brand-950 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="enquiry-phone" className="block text-sm font-medium text-brand-950">
            Phone Number <span className="text-rose-600">*</span>
          </label>
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 98765 43210"
            className="mt-1.5 min-h-11 w-full rounded-xl border border-brand-200/90 bg-white px-4 text-sm text-brand-950 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="enquiry-email" className="block text-sm font-medium text-brand-950">
            Email Address (Optional)
          </label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. rahul@example.com"
            className="mt-1.5 min-h-11 w-full rounded-xl border border-brand-200/90 bg-white px-4 text-sm text-brand-950 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Course Interest */}
        <div>
          <label htmlFor="enquiry-course" className="block text-sm font-medium text-brand-950">
            Course of Interest
          </label>
          <select
            id="enquiry-course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="mt-1.5 min-h-11 w-full rounded-xl border border-brand-200/90 bg-white px-3.5 text-sm text-brand-950 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">General Enquiry / Select Course</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="enquiry-message" className="block text-sm font-medium text-brand-950">
            Message / Query (Optional)
          </label>
          <textarea
            id="enquiry-message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Ask about batch timings, fees, or course details..."
            className="mt-1.5 w-full rounded-xl border border-brand-200/90 bg-white p-3.5 text-sm text-brand-950 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-brand-800 hover:shadow-md active:scale-[0.99] disabled:opacity-70"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Submitting enquiry...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>Submit Enquiry</span>
          </>
        )}
      </button>
    </form>
  );
}
