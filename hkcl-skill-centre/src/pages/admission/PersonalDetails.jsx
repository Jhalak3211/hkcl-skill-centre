import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import Select from 'react-select';
import AdmissionLayout from '../../components/admission/AdmissionLayout.jsx';
import FormActions from '../../components/admission/FormActions.jsx';
import { useAdmission } from '../../context/AdmissionContext.jsx';
import { courses } from '../../data/courses.js';

const BATCH_OPTIONS = [
  'Morning (09:00 AM - 11:00 AM)',
  'Afternoon (12:00 PM - 02:00 PM)',
  'Evening (03:30 PM - 05:30 PM)',
  'Flexible / Any Batch',
];

const HARYANA_DISTRICTS = [
  'Sirsa',
  'Fatehabad',
  'Hisar',
  'Bhiwani',
  'Charkhi Dadri',
  'Faridabad',
  'Gurugram',
  'Jhajjar',
  'Jind',
  'Kaithal',
  'Karnal',
  'Kurukshetra',
  'Mahendragarh',
  'Nuh',
  'Palwal',
  'Panchkula',
  'Panipat',
  'Rewari',
  'Rohtak',
  'Sonipat',
  'Yamunanagar',
  'Other',
];

export default function PersonalDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryCourseSlug = searchParams.get('course');
  const { user, application, updateCourseSelection, updatePersonalAndCourse, registerUser, isLocked } = useAdmission();

  const [courseState, setCourseState] = useState(() => {
    const slug = application.course?.slug || queryCourseSlug || '';
    const match = slug ? courses.find((c) => c.slug === slug) : null;
    return {
      slug: slug,
      name: application.course?.name || match?.name || '',
      batch: application.course?.batch || '',
      duration: application.course?.duration || match?.duration || '',
      fee: application.course?.fee || match?.fee || null,
    };
  });

  const [personal, setPersonal] = useState({
    fullName: application.personal?.fullName || user?.name || '',
    dob: application.personal?.dob || '',
    gender: application.personal?.gender || 'Male',
    fatherName: application.personal?.fatherName || '',
    motherName: application.personal?.motherName || '',
    phone: application.personal?.phone || user?.phone || '',
    email: application.personal?.email || user?.email || '',
    alternatePhone: application.personal?.alternatePhone || '',
    address: {
      house: application.personal?.address?.house || '',
      locality: application.personal?.address?.locality || '',
      district: application.personal?.address?.district || 'Sirsa',
      city: application.personal?.address?.city || 'Sirsa',
      state: application.personal?.address?.state || 'Haryana',
      pincode: application.personal?.address?.pincode || '',
    },
  });

  const [errors, setErrors] = useState({});

  // Sync state if application draft updates (e.g. from savedProfile or another course trigger)
  useEffect(() => {
    if (application.course) {
      setCourseState({
        slug: application.course.slug || '',
        name: application.course.name || '',
        batch: application.course.batch || '',
        duration: application.course.duration || '',
        fee: application.course.fee || null,
      });
    }
  }, [application.course?.slug, application.course?.batch]);

  useEffect(() => {
    if (application.personal) {
      setPersonal((prev) => ({
        ...prev,
        fullName: application.personal?.fullName || user?.name || prev.fullName,
        dob: application.personal?.dob || prev.dob,
        gender: application.personal?.gender || prev.gender,
        fatherName: application.personal?.fatherName || prev.fatherName,
        motherName: application.personal?.motherName || prev.motherName,
        phone: application.personal?.phone || user?.phone || prev.phone,
        email: application.personal?.email || user?.email || prev.email,
        alternatePhone: application.personal?.alternatePhone || prev.alternatePhone,
        address: {
          ...prev.address,
          ...(application.personal?.address || {}),
        },
      }));
    }
  }, [application.personal, user]);

  const courseOptions = useMemo(
    () =>
      courses.map((c) => ({
        value: c.slug,
        label: c.name,
        course: c,
      })),
    [],
  );

  const selectedCourseOption = courseOptions.find(
    (opt) => opt.value === courseState.slug,
  ) || null;

  const handleCourseChange = (option) => {
    if (option) {
      const selected = {
        slug: option.value,
        name: option.course.name,
        duration: option.course.duration || '3 Months',
        fee: option.course.fee || 4500,
        batch: courseState.batch,
      };
      setCourseState((prev) => ({
        ...prev,
        ...selected,
      }));
      updateCourseSelection(selected);
      setErrors((prev) => ({ ...prev, course: '' }));
    } else {
      const reset = {
        slug: '',
        name: '',
        duration: '',
        fee: null,
        batch: '',
      };
      setCourseState((prev) => ({
        ...prev,
        ...reset,
      }));
      updateCourseSelection(reset);
    }
  };

  const handleBatchChange = (e) => {
    const batch = e.target.value;
    setCourseState((prev) => ({ ...prev, batch }));
    updateCourseSelection({ batch });
    setErrors((prev) => ({ ...prev, batch: '' }));
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonal((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (e, fieldName) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPersonal((prev) => ({ ...prev, [fieldName]: val }));
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setPersonal((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
    setErrors((prev) => ({ ...prev, [`address.${name}`]: '' }));
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPersonal((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        pincode,
      },
    }));
    setErrors((prev) => ({ ...prev, 'address.pincode': '' }));
  };

  const validate = () => {
    const errs = {};
    if (!courseState.slug) errs.course = 'Please select a course.';
    if (!courseState.batch) errs.batch = 'Select a preferred batch.';
    if (!personal.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!personal.dob) errs.dob = 'Date of birth is required.';
    if (!personal.fatherName.trim()) errs.fatherName = "Father's name is required.";
    if (!personal.motherName.trim()) errs.motherName = "Mother's name is required.";
    if (!/^[6-9]\d{9}$/.test(personal.phone.trim())) {
      errs.phone = 'Enter valid 10-digit mobile.';
    }
    if (personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email.trim())) {
      errs.email = 'Enter valid email.';
    }
    if (!personal.address.house.trim()) errs['address.house'] = 'Street details required.';
    if (!personal.address.locality.trim()) errs['address.locality'] = 'Locality required.';
    if (!personal.address.city.trim()) errs['address.city'] = 'City required.';
    if (!/^[1-9][0-9]{5}$/.test(personal.address.pincode.trim())) {
      errs['address.pincode'] = 'Enter valid 6-digit PIN code.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;

    if (registerUser) {
      try {
        const regRes = await registerUser({
          fullName: personal.fullName,
          phone: personal.phone,
          email: personal.email,
        });

        if (regRes && !regRes.success) {
          if (regRes.code === 'EMAIL_ALREADY_REGISTERED' || regRes.duplicateField === 'email') {
            setErrors((prev) => ({
              ...prev,
              email: 'This email is already registered. Please recover your Reference ID or use another email.',
            }));
            return;
          }
          if (regRes.code === 'PHONE_ALREADY_REGISTERED' || regRes.duplicateField === 'phone') {
            setErrors((prev) => ({
              ...prev,
              phone: 'This mobile number is already registered. Please recover your Reference ID.',
            }));
            return;
          }
        }
      } catch {
        // Fallback
      }
    }

    updatePersonalAndCourse(courseState, personal);
    navigate('/admission/educational-details');
  };

  const inputClass = isLocked
    ? 'mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-700 cursor-not-allowed outline-none'
    : 'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-1 focus:ring-brand-600';

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      borderRadius: 8,
      backgroundColor: isLocked ? '#f8fafc' : '#ffffff',
      cursor: isLocked ? 'not-allowed' : 'default',
      borderColor: errors.course ? '#dc2626' : state.isFocused ? '#315b9b' : '#e2e8f0',
      boxShadow: 'none',
      fontSize: 13,
    }),
    valueContainer: (base) => ({ ...base, padding: '1px 10px' }),
  };

  return (
    <AdmissionLayout
      title="Course & Personal Details"
      currentStep={1}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} noValidate className="space-y-5">
        {/* Section 1: Course Selection */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-3.5">
            1. Course &amp; Batch
          </h2>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="course" className="text-xs font-semibold text-slate-700">
                Course <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <Select
                  inputId="course"
                  name="course"
                  options={courseOptions}
                  value={selectedCourseOption}
                  onChange={handleCourseChange}
                  placeholder="Select course..."
                  isClearable={!isLocked}
                  isSearchable={!isLocked}
                  isDisabled={isLocked}
                  styles={selectStyles}
                />
              </div>
              {errors.course && (
                <p className="mt-1 text-xs text-red-600">{errors.course}</p>
              )}
            </div>

            <div>
              <label htmlFor="batch" className="text-xs font-semibold text-slate-700">
                Batch Timing <span className="text-red-500">*</span>
              </label>
              <select
                id="batch"
                name="batch"
                disabled={isLocked}
                value={courseState.batch}
                onChange={handleBatchChange}
                className={inputClass}
              >
                <option value="">Select batch</option>
                {BATCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors.batch && (
                <p className="mt-1 text-xs text-red-600">{errors.batch}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Duration</label>
              <input
                type="text"
                readOnly
                value={courseState.duration || '3 Months (120 Hours)'}
                className={`${inputClass} bg-slate-50 text-slate-500`}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-3.5">
            2. Personal Details
          </h2>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={personal.fullName}
                onChange={handlePersonalChange}
                placeholder="Full name"
                className={inputClass}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="dob" className="text-xs font-semibold text-slate-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={personal.dob}
                onChange={handlePersonalChange}
                className={inputClass}
              />
              {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="text-xs font-semibold text-slate-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={personal.gender}
                onChange={handlePersonalChange}
                className={inputClass}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="fatherName" className="text-xs font-semibold text-slate-700">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fatherName"
                name="fatherName"
                type="text"
                value={personal.fatherName}
                onChange={handlePersonalChange}
                placeholder="Father's name"
                className={inputClass}
              />
              {errors.fatherName && <p className="mt-1 text-xs text-red-600">{errors.fatherName}</p>}
            </div>

            <div>
              <label htmlFor="motherName" className="text-xs font-semibold text-slate-700">
                Mother's Name <span className="text-red-500">*</span>
              </label>
              <input
                id="motherName"
                name="motherName"
                type="text"
                value={personal.motherName}
                onChange={handlePersonalChange}
                placeholder="Mother's name"
                className={inputClass}
              />
              {errors.motherName && <p className="mt-1 text-xs text-red-600">{errors.motherName}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={10}
                value={personal.phone}
                onChange={(e) => handlePhoneChange(e, 'phone')}
                placeholder="10-digit mobile"
                className={inputClass}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={personal.email}
                onChange={handlePersonalChange}
                placeholder="student@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="alternatePhone" className="text-xs font-semibold text-slate-700">
                Alternate Mobile <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="alternatePhone"
                name="alternatePhone"
                type="tel"
                maxLength={10}
                value={personal.alternatePhone}
                onChange={(e) => handlePhoneChange(e, 'alternatePhone')}
                placeholder="Guardian mobile"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Address */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-3.5">
            3. Residential Address
          </h2>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="address.house" className="text-xs font-semibold text-slate-700">
                House / Street Details <span className="text-red-500">*</span>
              </label>
              <input
                id="address.house"
                name="house"
                type="text"
                value={personal.address.house}
                onChange={handleAddressChange}
                placeholder="H.No, Street, Landmark"
                className={inputClass}
              />
              {errors['address.house'] && <p className="mt-1 text-xs text-red-600">{errors['address.house']}</p>}
            </div>

            <div>
              <label htmlFor="address.locality" className="text-xs font-semibold text-slate-700">
                Locality / Village <span className="text-red-500">*</span>
              </label>
              <input
                id="address.locality"
                name="locality"
                type="text"
                value={personal.address.locality}
                onChange={handleAddressChange}
                placeholder="Locality"
                className={inputClass}
              />
              {errors['address.locality'] && <p className="mt-1 text-xs text-red-600">{errors['address.locality']}</p>}
            </div>

            <div>
              <label htmlFor="address.city" className="text-xs font-semibold text-slate-700">
                City / Town <span className="text-red-500">*</span>
              </label>
              <input
                id="address.city"
                name="city"
                type="text"
                value={personal.address.city}
                onChange={handleAddressChange}
                placeholder="Sirsa"
                className={inputClass}
              />
              {errors['address.city'] && <p className="mt-1 text-xs text-red-600">{errors['address.city']}</p>}
            </div>

            <div>
              <label htmlFor="address.district" className="text-xs font-semibold text-slate-700">
                District <span className="text-red-500">*</span>
              </label>
              <select
                id="address.district"
                name="district"
                value={personal.address.district}
                onChange={handleAddressChange}
                className={inputClass}
              >
                {HARYANA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="address.state" className="text-xs font-semibold text-slate-700">
                State <span className="text-red-500">*</span>
              </label>
              <input
                id="address.state"
                name="state"
                type="text"
                value={personal.address.state}
                onChange={handleAddressChange}
                placeholder="Haryana"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address.pincode" className="text-xs font-semibold text-slate-700">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                id="address.pincode"
                name="pincode"
                type="text"
                maxLength={6}
                value={personal.address.pincode}
                onChange={handlePincodeChange}
                placeholder="6-digit PIN"
                className={inputClass}
              />
              {errors['address.pincode'] && <p className="mt-1 text-xs text-red-600">{errors['address.pincode']}</p>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {isLocked ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <Link
              to="/profile"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Profile</span>
            </Link>
            <button
              type="button"
              onClick={() => navigate('/admission/educational-details')}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-900 transition"
            >
              <span>View Educational Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <FormActions
            backPath="/profile"
            backLabel="Profile"
            nextLabel="Continue to Education"
            onNext={handleNext}
          />
        )}
      </form>
    </AdmissionLayout>
  );
}
