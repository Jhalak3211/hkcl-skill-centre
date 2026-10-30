import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, AlertCircle, CheckCircle2, ArrowLeft, Lock } from 'lucide-react';
import AdmissionLayout from '../../components/admission/AdmissionLayout.jsx';
import ReviewSection from '../../components/admission/ReviewSection.jsx';
import FormActions from '../../components/admission/FormActions.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';

export default function ReviewApplication() {
  const navigate = useNavigate();
  const { application, submitApplication, isLocked } = useAdmission();

  const [declaration, setDeclaration] = useState(
    application.declarationAccepted || false,
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const course = application.course;
  const personal = application.personal;
  const address = personal.address || {};
  const education = application.education;
  const tenth = education.tenth || {};
  const twelfth = education.twelfth || {};
  const documents = application.documents;

  const validateBeforeSubmit = () => {
    if (!course.slug) {
      setError('Please select a course.');
      return false;
    }
    if (!personal.fullName || !personal.phone) {
      setError('Required personal details are incomplete.');
      return false;
    }
    if (!tenth.board || !tenth.rollNo) {
      setError('10th education details are incomplete.');
      return false;
    }
    if (!documents.photo) {
      setError('Passport photograph is required.');
      return false;
    }
    if (!documents.signature) {
      setError('Signature is required.');
      return false;
    }
    if (!declaration) {
      setError('Please accept the declaration before submitting.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) return;

    setIsSubmitting(true);
    try {
      await submitApplication();
      setIsSubmitting(false);
      navigate('/profile', {
        state: {
          submittedNotice:
            'Application submitted successfully! Your documents are currently under review. Fee payment will be unlocked after staff approval.',
        },
      });
    } catch {
      setIsSubmitting(false);
      navigate('/profile');
    }
  };

  const courseItems = [
    { label: 'Course', value: course.name },
    { label: 'Batch', value: course.batch },
    { label: 'Duration', value: course.duration || '3 Months' },
    { label: 'Registration Fee', value: `₹${application.payment.registrationFee}` },
  ];

  const personalItems = [
    { label: 'Name', value: personal.fullName },
    { label: 'Date of Birth', value: personal.dob },
    { label: 'Gender', value: personal.gender },
    { label: "Father's Name", value: personal.fatherName },
    { label: "Mother's Name", value: personal.motherName },
    { label: 'Mobile', value: personal.phone },
    { label: 'Email', value: personal.email || '—' },
  ];

  const addressItems = [
    {
      label: 'Address',
      value: [address.house, address.locality, address.city, address.district, address.state, address.pincode]
        .filter(Boolean)
        .join(', '),
      fullWidth: true,
    },
  ];

  const tenthItems = [
    { label: 'Board', value: tenth.board },
    { label: 'School', value: tenth.school },
    { label: 'Passing Year', value: tenth.passingYear },
    { label: 'Roll Number', value: tenth.rollNo },
    { label: 'Marks', value: `${tenth.marksObtained || 0} / ${tenth.maxMarks || 500}` },
    { label: 'Percentage', value: tenth.percentage ? `${tenth.percentage}%` : '—' },
  ];

  const twelfthItems = education.hasTwelfth
    ? [
        { label: 'Stream', value: twelfth.stream },
        { label: 'Board', value: twelfth.board },
        { label: 'School / College', value: twelfth.school },
        { label: 'Passing Year', value: twelfth.passingYear },
        { label: 'Roll Number', value: twelfth.rollNo },
        { label: 'Percentage', value: twelfth.percentage ? `${twelfth.percentage}%` : '—' },
      ]
    : [{ label: '12th Standard', value: 'Not applicable (admission via 10th)', fullWidth: true }];

  return (
    <AdmissionLayout
      title="Review Application"
      currentStep={4}
    >
      <div className="space-y-4">
        {/* Course */}
        <ReviewSection
          title="1. Course"
          editPath="/admission/personal-details"
          items={courseItems}
          isLocked={isLocked}
        />

        {/* Personal */}
        <ReviewSection
          title="2. Personal Information"
          editPath="/admission/personal-details"
          items={personalItems}
          isLocked={isLocked}
        />

        {/* Address */}
        <ReviewSection
          title="3. Address"
          editPath="/admission/personal-details"
          items={addressItems}
          isLocked={isLocked}
        />

        {/* 10th */}
        <ReviewSection
          title="4. 10th Standard Qualification"
          editPath="/admission/educational-details"
          items={tenthItems}
          isLocked={isLocked}
        />

        {/* 12th */}
        <ReviewSection
          title="5. 12th Standard Qualification"
          editPath="/admission/educational-details"
          items={twelfthItems}
          isLocked={isLocked}
        />

        {/* Documents */}
        <ReviewSection
          title="6. Uploaded Documents"
          editPath="/admission/documents"
          isLocked={isLocked}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 border border-slate-100 rounded-lg">
              {documents.photo?.dataUrl ? (
                <img
                  src={documents.photo.dataUrl}
                  alt="Photo"
                  className="h-10 w-10 rounded object-cover border border-slate-200"
                />
              ) : (
                <span className="text-slate-400">Photo</span>
              )}
              <span className="font-medium text-slate-800">Photo Attached</span>
            </div>

            <div className="flex items-center gap-2 p-2 border border-slate-100 rounded-lg">
              {documents.signature?.dataUrl ? (
                <div className="h-10 w-16 bg-white rounded border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden">
                  <img
                    src={documents.signature.dataUrl}
                    alt="Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <span className="text-slate-400">Signature</span>
              )}
              <span className="font-medium text-slate-800">Signature Attached</span>
            </div>

            <div className="flex items-center gap-2 p-2 border border-slate-100 rounded-lg">
              <FileText className="h-6 w-6 text-slate-400" />
              <span className="font-medium text-slate-800">10th Marksheet</span>
            </div>
          </div>
        </ReviewSection>

        {/* Declaration & Submission OR Locked Navigation */}
        {isLocked ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <Link
              to="/profile"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Profile</span>
            </Link>
            <Link
              to="/admission/confirmation"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>View Official 1-Page Receipt</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Document-First Review Policy Notice */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900">
              <p className="font-semibold text-blue-950 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-700 shrink-0" />
                Document-First Admission Verification Policy
              </p>
              <p className="mt-1 text-blue-800 leading-relaxed">
                After submission, admissions staff will verify your uploaded documents and qualifications.
                The ₹500 registration fee payment step will be unlocked only after an authorized staff member approves your documents.
              </p>
            </div>

            {/* Declaration */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={(e) => {
                    setDeclaration(e.target.checked);
                    setError('');
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-800 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I declare that all details entered above are correct to the best of my knowledge. I understand that my documents will be reviewed by staff before fee payment is enabled.
                </span>
              </label>
            </div>

            {error && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Actions */}
            <FormActions
              backPath="/admission/documents"
              backLabel="Back"
              nextLabel="Submit for Document Review"
              onNext={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </div>
    </AdmissionLayout>
  );
}
