import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AdmissionLayout from '../../components/admission/AdmissionLayout.jsx';
import FormActions from '../../components/admission/FormActions.jsx';
import DocumentUploader from '../../components/admission/DocumentUploader.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';

const BOARDS = [
  'HBSE (Board of School Education Haryana)',
  'CBSE (Central Board of Secondary Education)',
  'ICSE / ISC',
  'Punjab School Education Board (PSEB)',
  'Rajasthan Board (RBSE)',
  'National Institute of Open Schooling (NIOS)',
  'Other Recognized State / National Board',
];

const PASSING_YEARS = Array.from({ length: 18 }, (_, i) => String(2026 - i));

export default function EducationalDetails() {
  const navigate = useNavigate();
  const { application, updateEducation, isLocked } = useAdmission();

  const [tenth, setTenth] = useState({
    board: application.education?.tenth?.board || '',
    school: application.education?.tenth?.school || '',
    passingYear: application.education?.tenth?.passingYear || '',
    rollNo: application.education?.tenth?.rollNo || '',
    marksObtained: application.education?.tenth?.marksObtained || '',
    maxMarks: application.education?.tenth?.maxMarks || '500',
    percentage: application.education?.tenth?.percentage || '',
    marksheet: application.education?.tenth?.marksheet || null,
  });

  const [hasTwelfth, setHasTwelfth] = useState(
    application.education?.hasTwelfth ?? true,
  );

  const [twelfth, setTwelfth] = useState({
    board: application.education?.twelfth?.board || '',
    stream: application.education?.twelfth?.stream || 'Science',
    school: application.education?.twelfth?.school || '',
    passingYear: application.education?.twelfth?.passingYear || '',
    rollNo: application.education?.twelfth?.rollNo || '',
    marksObtained: application.education?.twelfth?.marksObtained || '',
    maxMarks: application.education?.twelfth?.maxMarks || '500',
    percentage: application.education?.twelfth?.percentage || '',
    marksheet: application.education?.twelfth?.marksheet || null,
  });

  const [higherEducation, setHigherEducation] = useState(
    application.education?.higherEducation || '',
  );

  const [errors, setErrors] = useState({});

  // Sync state when application.education updates (e.g. from Auto-Fill)
  useEffect(() => {
    if (application.education) {
      if (application.education.tenth) {
        setTenth({
          board: application.education.tenth.board || '',
          school: application.education.tenth.school || '',
          passingYear: application.education.tenth.passingYear || '',
          rollNo: application.education.tenth.rollNo || '',
          marksObtained: application.education.tenth.marksObtained || '',
          maxMarks: application.education.tenth.maxMarks || '500',
          percentage: application.education.tenth.percentage || '',
          marksheet: application.education.tenth.marksheet || null,
        });
      }
      if (typeof application.education.hasTwelfth === 'boolean') {
        setHasTwelfth(application.education.hasTwelfth);
      }
      if (application.education.twelfth) {
        setTwelfth({
          board: application.education.twelfth.board || '',
          stream: application.education.twelfth.stream || 'Science',
          school: application.education.twelfth.school || '',
          passingYear: application.education.twelfth.passingYear || '',
          rollNo: application.education.twelfth.rollNo || '',
          marksObtained: application.education.twelfth.marksObtained || '',
          maxMarks: application.education.twelfth.maxMarks || '500',
          percentage: application.education.twelfth.percentage || '',
          marksheet: application.education.twelfth.marksheet || null,
        });
      }
      if (typeof application.education.higherEducation === 'string') {
        setHigherEducation(application.education.higherEducation);
      }
    }
  }, [application.education]);

  const calculatePercentage = (obtained, max) => {
    const ob = parseFloat(obtained);
    const mx = parseFloat(max);
    if (!isNaN(ob) && !isNaN(mx) && mx > 0 && ob <= mx) {
      return ((ob / mx) * 100).toFixed(2);
    }
    return '';
  };

  const handleTenthChange = (e) => {
    const { name, value } = e.target;
    setTenth((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'marksObtained' || name === 'maxMarks') {
        const pct = calculatePercentage(
          name === 'marksObtained' ? value : updated.marksObtained,
          name === 'maxMarks' ? value : updated.maxMarks,
        );
        updated.percentage = pct || updated.percentage;
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [`tenth.${name}`]: '' }));
  };

  const handleTwelfthChange = (e) => {
    const { name, value } = e.target;
    setTwelfth((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'marksObtained' || name === 'maxMarks') {
        const pct = calculatePercentage(
          name === 'marksObtained' ? value : updated.marksObtained,
          name === 'maxMarks' ? value : updated.maxMarks,
        );
        updated.percentage = pct || updated.percentage;
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [`twelfth.${name}`]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!tenth.board) errs['tenth.board'] = 'Select 10th board.';
    if (!tenth.school.trim()) errs['tenth.school'] = 'School name is required.';
    if (!tenth.passingYear) errs['tenth.passingYear'] = 'Passing year required.';
    if (!tenth.rollNo.trim()) errs['tenth.rollNo'] = 'Roll number required.';
    if (!tenth.marksObtained) errs['tenth.marksObtained'] = 'Enter marks obtained.';
    if (!tenth.maxMarks) errs['tenth.maxMarks'] = 'Enter total marks.';
    if (!tenth.marksheet) errs['tenth.marksheet'] = 'Please upload 10th marksheet.';

    if (hasTwelfth) {
      if (!twelfth.board) errs['twelfth.board'] = 'Select 12th board.';
      if (!twelfth.school.trim()) errs['twelfth.school'] = 'School name required.';
      if (!twelfth.passingYear) errs['twelfth.passingYear'] = 'Passing year required.';
      if (!twelfth.rollNo.trim()) errs['twelfth.rollNo'] = 'Roll number required.';
      if (!twelfth.marksObtained) errs['twelfth.marksObtained'] = 'Enter marks obtained.';
      if (!twelfth.maxMarks) errs['twelfth.maxMarks'] = 'Enter total marks.';
      if (!twelfth.marksheet) errs['twelfth.marksheet'] = 'Please upload 12th marksheet.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    updateEducation({
      tenth,
      hasTwelfth,
      twelfth,
      higherEducation,
    });
    navigate('/admission/documents');
  };

  const inputClass = isLocked
    ? 'mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed outline-none'
    : 'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-1 focus:ring-brand-600';

  return (
    <AdmissionLayout
      title="Educational Details"
      currentStep={2}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} noValidate className="space-y-5">
        {/* Section 1: 10th Standard Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-3.5">
            1. 10th Standard (Matriculation)
          </h2>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="tenth.board" className="text-xs font-semibold text-slate-700">
                Education Board <span className="text-red-500">*</span>
              </label>
              <select
                id="tenth.board"
                name="board"
                value={tenth.board}
                onChange={handleTenthChange}
                className={inputClass}
              >
                <option value="">Select board</option>
                {BOARDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors['tenth.board'] && <p className="mt-1 text-xs text-red-600">{errors['tenth.board']}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="tenth.school" className="text-xs font-semibold text-slate-700">
                School / Institute Name <span className="text-red-500">*</span>
              </label>
              <input
                id="tenth.school"
                name="school"
                type="text"
                value={tenth.school}
                onChange={handleTenthChange}
                placeholder="School name"
                className={inputClass}
              />
              {errors['tenth.school'] && <p className="mt-1 text-xs text-red-600">{errors['tenth.school']}</p>}
            </div>

            <div>
              <label htmlFor="tenth.passingYear" className="text-xs font-semibold text-slate-700">
                Passing Year <span className="text-red-500">*</span>
              </label>
              <select
                id="tenth.passingYear"
                name="passingYear"
                value={tenth.passingYear}
                onChange={handleTenthChange}
                className={inputClass}
              >
                <option value="">Select year</option>
                {PASSING_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {errors['tenth.passingYear'] && <p className="mt-1 text-xs text-red-600">{errors['tenth.passingYear']}</p>}
            </div>

            <div>
              <label htmlFor="tenth.rollNo" className="text-xs font-semibold text-slate-700">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                id="tenth.rollNo"
                name="rollNo"
                type="text"
                value={tenth.rollNo}
                onChange={handleTenthChange}
                placeholder="10th roll no"
                className={inputClass}
              />
              {errors['tenth.rollNo'] && <p className="mt-1 text-xs text-red-600">{errors['tenth.rollNo']}</p>}
            </div>

            <div>
              <label htmlFor="tenth.marksObtained" className="text-xs font-semibold text-slate-700">
                Marks Obtained / Max <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="tenth.marksObtained"
                  name="marksObtained"
                  type="number"
                  min={0}
                  value={tenth.marksObtained}
                  onChange={handleTenthChange}
                  placeholder="Obtained"
                  className={inputClass}
                />
                <span className="text-slate-400 mt-1">/</span>
                <input
                  id="tenth.maxMarks"
                  name="maxMarks"
                  type="number"
                  min={1}
                  value={tenth.maxMarks}
                  onChange={handleTenthChange}
                  placeholder="Max"
                  className={inputClass}
                />
              </div>
              {errors['tenth.marksObtained'] && <p className="mt-1 text-xs text-red-600">{errors['tenth.marksObtained']}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Percentage (%)</label>
              <input
                type="text"
                value={tenth.percentage ? `${tenth.percentage}%` : ''}
                readOnly
                placeholder="Auto-calculated"
                className={`${inputClass} bg-slate-50 text-slate-700 font-medium`}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <DocumentUploader
              id="tenthMarksheet"
              label="10th Marksheet"
              required
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
              acceptedExtensionsLabel="PDF, JPG, PNG"
              maxSizeMB={2}
              fileData={tenth.marksheet}
              onFileSelect={(fileObj) => {
                setTenth((prev) => ({ ...prev, marksheet: fileObj }));
                setErrors((prev) => ({ ...prev, 'tenth.marksheet': '' }));
              }}
              onFileRemove={() => {
                setTenth((prev) => ({ ...prev, marksheet: null }));
              }}
              error={errors['tenth.marksheet']}
              disabled={isLocked}
            />
          </div>
        </div>

        {/* Section 2: 12th Standard Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
            <h2 className="text-sm font-bold text-slate-900">
              2. 12th Standard (Senior Secondary)
            </h2>
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hasTwelfth}
                onChange={(e) => setHasTwelfth(e.target.checked)}
                className="h-3.5 w-3.5 rounded text-brand-800"
              />
              <span>Include 12th details</span>
            </label>
          </div>

          {hasTwelfth ? (
            <div>
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="twelfth.stream" className="text-xs font-semibold text-slate-700">
                    Stream <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="twelfth.stream"
                    name="stream"
                    value={twelfth.stream}
                    onChange={handleTwelfthChange}
                    className={inputClass}
                  >
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts / Humanities">Arts / Humanities</option>
                    <option value="Vocational">Vocational</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="twelfth.board" className="text-xs font-semibold text-slate-700">
                    Board <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="twelfth.board"
                    name="board"
                    value={twelfth.board}
                    onChange={handleTwelfthChange}
                    className={inputClass}
                  >
                    <option value="">Select board</option>
                    {BOARDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {errors['twelfth.board'] && <p className="mt-1 text-xs text-red-600">{errors['twelfth.board']}</p>}
                </div>

                <div>
                  <label htmlFor="twelfth.passingYear" className="text-xs font-semibold text-slate-700">
                    Passing Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="twelfth.passingYear"
                    name="passingYear"
                    value={twelfth.passingYear}
                    onChange={handleTwelfthChange}
                    className={inputClass}
                  >
                    <option value="">Select year</option>
                    {PASSING_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  {errors['twelfth.passingYear'] && <p className="mt-1 text-xs text-red-600">{errors['twelfth.passingYear']}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="twelfth.school" className="text-xs font-semibold text-slate-700">
                    School / College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="twelfth.school"
                    name="school"
                    type="text"
                    value={twelfth.school}
                    onChange={handleTwelfthChange}
                    placeholder="School / college name"
                    className={inputClass}
                  />
                  {errors['twelfth.school'] && <p className="mt-1 text-xs text-red-600">{errors['twelfth.school']}</p>}
                </div>

                <div>
                  <label htmlFor="twelfth.rollNo" className="text-xs font-semibold text-slate-700">
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="twelfth.rollNo"
                    name="rollNo"
                    type="text"
                    value={twelfth.rollNo}
                    onChange={handleTwelfthChange}
                    placeholder="12th roll no"
                    className={inputClass}
                  />
                  {errors['twelfth.rollNo'] && <p className="mt-1 text-xs text-red-600">{errors['twelfth.rollNo']}</p>}
                </div>

                <div>
                  <label htmlFor="twelfth.marksObtained" className="text-xs font-semibold text-slate-700">
                    Marks Obtained / Max <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="twelfth.marksObtained"
                      name="marksObtained"
                      type="number"
                      min={0}
                      value={twelfth.marksObtained}
                      onChange={handleTwelfthChange}
                      placeholder="Obtained"
                      className={inputClass}
                    />
                    <span className="text-slate-400 mt-1">/</span>
                    <input
                      id="twelfth.maxMarks"
                      name="maxMarks"
                      type="number"
                      min={1}
                      value={twelfth.maxMarks}
                      onChange={handleTwelfthChange}
                      placeholder="Max"
                      className={inputClass}
                    />
                  </div>
                  {errors['twelfth.marksObtained'] && <p className="mt-1 text-xs text-red-600">{errors['twelfth.marksObtained']}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Percentage (%)</label>
                  <input
                    type="text"
                    value={twelfth.percentage ? `${twelfth.percentage}%` : ''}
                    readOnly
                    placeholder="Auto-calculated"
                    className={`${inputClass} bg-slate-50 text-slate-700 font-medium`}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <DocumentUploader
                  id="twelfthMarksheet"
                  label="12th Marksheet"
                  required
                  acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                  acceptedExtensionsLabel="PDF, JPG, PNG"
                  maxSizeMB={2}
                  fileData={twelfth.marksheet}
                  onFileSelect={(fileObj) => {
                    setTwelfth((prev) => ({ ...prev, marksheet: fileObj }));
                    setErrors((prev) => ({ ...prev, 'twelfth.marksheet': '' }));
                  }}
                  onFileRemove={() => {
                    setTwelfth((prev) => ({ ...prev, marksheet: null }));
                  }}
                  error={errors['twelfth.marksheet']}
                  disabled={isLocked}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              12th details omitted. Admission will be based on 10th matriculation.
            </p>
          )}
        </div>

        {/* Section 3: Higher Qualification */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-2">
            3. Higher Qualification (Optional)
          </h2>
          <input
            id="higherEducation"
            name="higherEducation"
            type="text"
            disabled={isLocked}
            value={higherEducation}
            onChange={(e) => setHigherEducation(e.target.value)}
            placeholder="e.g. Pursuing B.A. / B.Com Graduate / Diploma in CSE"
            className={inputClass}
          />
        </div>

        {/* Actions */}
        {isLocked ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => navigate('/admission/personal-details')}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back: Personal Details</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admission/documents')}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition"
            >
              <span>View Uploaded Documents</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <FormActions
            backPath="/admission/personal-details"
            backLabel="Back"
            nextLabel="Continue to Documents"
            onNext={handleNext}
          />
        )}
      </form>
    </AdmissionLayout>
  );
}
