import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import Button from './Button.jsx';
import { submitEnquiry } from '../services/enquiryService.js';
import { courses } from '../data/courses.js';

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
      await submitEnquiry(formData);
      setStatus('success');
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
  };

  if (status === 'success') {
    return (
      <div
        className={`rounded-2xl border border-emerald-200 bg-emerald-50/90 p-8 text-center backdrop-blur-md ${className}`}
        role="alert"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-emerald-950">
          Enquiry Received!
        </h3>
        <p className="mt-2 text-sm text-emerald-800">
          Thank you for reaching out. A representative from HKCL Skill Centre will contact you shortly with batch and admission details.
        </p>
        <Button variant="secondary" className="mt-6" onClick={handleReset}>
          Send another enquiry
        </Button>
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
