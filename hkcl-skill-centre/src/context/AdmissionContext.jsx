import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEMO_COURSE,
  DEMO_PERSONAL,
  DEMO_EDUCATION,
  DEMO_DOCUMENTS,
} from '../data/demoAdmissionData.js';

/**
 * ADMISSION CONTEXT & USER PROFILE STATE MANAGEMENT
 * ---------------------------------------------------------------------------
 * Handles:
 * 1. Passwordless Student Account Creation & Reference ID Assignment.
 * 2. Permanent Student Reference ID assignment (e.g., HKCL-2026-XXXX).
 * 3. Saved Profile persistence: personal, address, and educational qualifications
 *    are automatically saved and pre-filled when applying for any course.
 * 4. Multi-step Admission Form Draft.
 * 5. In-memory document files (never persisted to localStorage for privacy).
 */

const STORAGE_DRAFT_KEY = 'hkcl_admission_draft_v1';
const STORAGE_USER_KEY = 'hkcl_admission_mock_user_v1';
const STORAGE_PROFILE_KEY = 'hkcl_saved_profile_v1';
const STORAGE_REGISTERED_STUDENTS = 'hkcl_registered_students_v1';

export const isApplicationLocked = (app) => {
  if (!app) return false;
  // If corrections are requested, student is expressly unlocked to update details and documents
  if (
    app.status === 'corrections_required' ||
    app.documentReview?.status === 'corrections_required'
  ) {
    return false;
  }
  return (
    app.status === 'under_review' ||
    app.status === 'admitted' ||
    app.finalAdmission?.status === 'admitted' ||
    app.payment?.status === 'verified' ||
    app.isLocked === true
  );
};

const getStoredProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getRegisteredStudents = () => {
  try {
    const raw = localStorage.getItem(STORAGE_REGISTERED_STUDENTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return [
    {
      studentId: 'HKCL-2026-482910',
      fullName: 'Rahul Sharma',
      phone: '9812345678',
      email: 'rahul.sharma@example.com',
      registeredAt: '2026-10-01T10:00:00.000Z',
    },
  ];
};

const saveRegisteredStudent = (student) => {
  try {
    const list = getRegisteredStudents();
    const existingIndex = list.findIndex(
      (s) => s.studentId === student.studentId || s.phone === student.phone
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...student };
    } else {
      list.push(student);
    }
    localStorage.setItem(STORAGE_REGISTERED_STUDENTS, JSON.stringify(list));
  } catch (e) {
    console.warn('Unable to save registered student:', e);
  }
};

const createDefaultApplication = (initialUser = null, savedProfile = null) => {
  const profile = savedProfile || getStoredProfile();
  const refId = initialUser?.studentId || initialUser?.id || profile?.studentId || '';

  return {
    id: refId,
    status: 'draft', // 'draft' | 'submitted' | 'under_review' | 'approved'
    currentStep: 1,
    lastUpdated: new Date().toISOString(),
    submittedAt: null,
    course: {
      slug: '',
      name: '',
      batch: '',
      duration: '',
      fee: null,
    },
    personal: {
      fullName: initialUser?.name || profile?.fullName || '',
      dob: profile?.dob || '',
      gender: profile?.gender || 'Male',
      fatherName: profile?.fatherName || '',
      motherName: profile?.motherName || '',
      phone: initialUser?.phone || profile?.phone || '',
      email: initialUser?.email || profile?.email || '',
      alternatePhone: profile?.alternatePhone || '',
      address: {
        house: profile?.address?.house || '',
        locality: profile?.address?.locality || '',
        city: profile?.address?.city || 'Sirsa',
        district: profile?.address?.district || 'Sirsa',
        state: profile?.address?.state || 'Haryana',
        pincode: profile?.address?.pincode || '',
      },
    },
    education: {
      tenth: {
        board: profile?.education?.tenth?.board || '',
        school: profile?.education?.tenth?.school || '',
        passingYear: profile?.education?.tenth?.passingYear || '',
        rollNo: profile?.education?.tenth?.rollNo || '',
        marksObtained: profile?.education?.tenth?.marksObtained || '',
        maxMarks: profile?.education?.tenth?.maxMarks || '500',
        percentage: profile?.education?.tenth?.percentage || '',
        marksheet: null,
      },
      hasTwelfth: profile?.education?.hasTwelfth ?? true,
      twelfth: {
        board: profile?.education?.twelfth?.board || '',
        stream: profile?.education?.twelfth?.stream || 'Science',
        school: profile?.education?.twelfth?.school || '',
        passingYear: profile?.education?.twelfth?.passingYear || '',
        rollNo: profile?.education?.twelfth?.rollNo || '',
        marksObtained: profile?.education?.twelfth?.marksObtained || '',
        maxMarks: profile?.education?.twelfth?.maxMarks || '500',
        percentage: profile?.education?.twelfth?.percentage || '',
        marksheet: null,
      },
      higherEducation: profile?.education?.higherEducation || '',
    },
    documents: {
      photo: null,
      signature: null,
      idProof: null,
    },
    payment: {
      registrationFee: 500,
      status: 'pending',
      method: 'Manual UPI QR',
      utr: '',
      payerUpiId: '',
      paymentDate: '',
      screenshotUrl: '',
      submittedAt: null,
      verifiedAt: null,
      verifiedBy: '',
      rejectionReason: '',
      receiptNo: '',
      transactionId: '',
      paidAt: null,
    },
    documentReview: {
      status: 'pending', // 'pending' | 'under_review' | 'corrections_required' | 'approved' | 'rejected'
      reviewedBy: '',
      reviewedAt: null,
      notes: '',
      correctionNotes: '',
      rejectionReason: '',
      history: [],
    },
    finalAdmission: {
      status: 'pending', // 'pending' | 'admitted' | 'rejected'
      decisionBy: '',
      decisionAt: null,
      notes: '',
      enrollmentNo: '',
      admittedBatch: '',
    },
    declarationAccepted: false,
  };
};

const sanitizeForStorage = (app) => ({
  id: app.id,
  status: app.status,
  currentStep: app.currentStep,
  lastUpdated: app.lastUpdated,
  submittedAt: app.submittedAt,
  course: app.course,
  personal: app.personal,
  education: {
    tenth: {
      board: app.education?.tenth?.board || '',
      school: app.education?.tenth?.school || '',
      passingYear: app.education?.tenth?.passingYear || '',
      rollNo: app.education?.tenth?.rollNo || '',
      marksObtained: app.education?.tenth?.marksObtained || '',
      maxMarks: app.education?.tenth?.maxMarks || '500',
      percentage: app.education?.tenth?.percentage || '',
    },
    hasTwelfth: app.education?.hasTwelfth ?? true,
    twelfth: {
      board: app.education?.twelfth?.board || '',
      stream: app.education?.twelfth?.stream || '',
      school: app.education?.twelfth?.school || '',
      passingYear: app.education?.twelfth?.passingYear || '',
      rollNo: app.education?.twelfth?.rollNo || '',
      marksObtained: app.education?.twelfth?.marksObtained || '',
      maxMarks: app.education?.twelfth?.maxMarks || '500',
      percentage: app.education?.twelfth?.percentage || '',
    },
    higherEducation: app.education?.higherEducation || '',
  },
  payment: app.payment,
  declarationAccepted: app.declarationAccepted,
});

const AdmissionContext = createContext(null);

export function AdmissionProvider({ children }) {
  // Authenticated user session
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Application state
  const [application, setApplication] = useState(() => {
    let initialUser = null;
    try {
      const storedUser = sessionStorage.getItem(STORAGE_USER_KEY);
      if (storedUser) initialUser = JSON.parse(storedUser);
    } catch {
      // Ignore
    }

    const defaultApp = createDefaultApplication(initialUser);
    try {
      const stored = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultApp,
          ...parsed,
          id: initialUser?.studentId || parsed.id || defaultApp.id,
          course: { ...defaultApp.course, ...(parsed.course || {}) },
          personal: {
            ...defaultApp.personal,
            ...(parsed.personal || {}),
            fullName: parsed.personal?.fullName || initialUser?.name || defaultApp.personal.fullName,
            phone: parsed.personal?.phone || initialUser?.phone || defaultApp.personal.phone,
            email: parsed.personal?.email || initialUser?.email || defaultApp.personal.email,
            address: {
              ...defaultApp.personal.address,
              ...(parsed.personal?.address || {}),
            },
          },
          education: {
            ...defaultApp.education,
            ...(parsed.education || {}),
            tenth: {
              ...defaultApp.education.tenth,
              ...(parsed.education?.tenth || {}),
              marksheet: null,
            },
            twelfth: {
              ...defaultApp.education.twelfth,
              ...(parsed.education?.twelfth || {}),
              marksheet: null,
            },
          },
          documents: {
            photo: null,
            signature: null,
            idProof: null,
          },
          payment: { ...defaultApp.payment, ...(parsed.payment || {}) },
        };
      }
    } catch {
      // Fallback
    }
    return defaultApp;
  });

  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Sync draft to localStorage
  useEffect(() => {
    try {
      const safeData = sanitizeForStorage(application);
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(safeData));
    } catch (err) {
      console.warn('Unable to persist draft in localStorage:', err);
    }
  }, [application]);

  // Sync user session to sessionStorage
  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch (err) {
      console.warn('Unable to persist session:', err);
    }
  }, [user]);

  // Restore session from JWT token on mount if user not in state
  useEffect(() => {
    const token =
      sessionStorage.getItem('hkcl_auth_token') ||
      localStorage.getItem('hkcl_auth_token');
    if (token && !user) {
      fetch('/api/auth/student-me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data?.student) {
            const restoredUser = {
              id: data.student.studentId,
              studentId: data.student.studentId,
              name: data.student.fullName,
              phone: data.student.phone,
              email: data.student.email,
              verified: true,
              registeredAt: data.student.createdAt,
            };
            setUser(restoredUser);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const [savedProfile, setSavedProfile] = useState(() => getStoredProfile());

  // Save basic profile details to permanent storage (Personal and address only; NEVER qualifications or uploads)
  const persistUserProfile = useCallback((personalData) => {
    if (!personalData) return;
    try {
      const currentSaved = getStoredProfile() || {};
      const updatedProfile = {
        ...currentSaved,
        fullName: personalData.fullName ?? currentSaved.fullName ?? '',
        phone: personalData.phone ?? currentSaved.phone ?? '',
        email: personalData.email ?? currentSaved.email ?? '',
        fatherName: personalData.fatherName ?? currentSaved.fatherName ?? '',
        motherName: personalData.motherName ?? currentSaved.motherName ?? '',
        dob: personalData.dob ?? currentSaved.dob ?? '',
        gender: personalData.gender ?? currentSaved.gender ?? 'Male',
        address: {
          house: personalData.address?.house ?? currentSaved.address?.house ?? '',
          locality: personalData.address?.locality ?? currentSaved.address?.locality ?? '',
          city: personalData.address?.city ?? currentSaved.address?.city ?? 'Sirsa',
          district: personalData.address?.district ?? currentSaved.address?.district ?? 'Sirsa',
          state: personalData.address?.state ?? currentSaved.address?.state ?? 'Haryana',
          pincode: personalData.address?.pincode ?? currentSaved.address?.pincode ?? '',
        },
      };
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile));
      setSavedProfile(updatedProfile);
    } catch (err) {
      console.warn('Unable to persist user profile:', err);
    }
  }, []);

  // Update reusable student profile (Only personal & address data; NEVER touches submitted applications)
  const updateProfile = useCallback((profileData) => {
    try {
      const current = getStoredProfile() || {};
      const updated = {
        ...current,
        fullName: profileData.fullName ?? current.fullName ?? '',
        email: profileData.email ?? current.email ?? '',
        fatherName: profileData.fatherName ?? current.fatherName ?? '',
        motherName: profileData.motherName ?? current.motherName ?? '',
        dob: profileData.dob ?? current.dob ?? '',
        gender: profileData.gender ?? current.gender ?? 'Male',
        address: {
          house: profileData.address?.house ?? current.address?.house ?? '',
          locality: profileData.address?.locality ?? current.address?.locality ?? '',
          city: profileData.address?.city ?? current.address?.city ?? 'Sirsa',
          district: profileData.address?.district ?? current.address?.district ?? 'Sirsa',
          state: profileData.address?.state ?? current.address?.state ?? 'Haryana',
          pincode: profileData.address?.pincode ?? current.address?.pincode ?? '',
        },
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(updated));
      setSavedProfile(updated);

      // Update user state if name or email changed
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: updated.fullName || prev.name,
          email: updated.email || prev.email,
        };
      });

      // Update current application ONLY if it is still a draft (Never modify submitted or locked applications!)
      setApplication((prev) => {
        if (isApplicationLocked(prev) || prev.status !== 'draft') {
          return prev;
        }
        return {
          ...prev,
          personal: {
            ...prev.personal,
            fullName: updated.fullName,
            email: updated.email,
            fatherName: updated.fatherName,
            motherName: updated.motherName,
            dob: updated.dob,
            gender: updated.gender,
            address: { ...updated.address },
          },
        };
      });

      return { success: true, profile: updated };
    } catch (err) {
      console.warn('Failed to update profile:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Account registration with Student Reference ID
  const registerUser = useCallback(async (details) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: details.fullName.trim(),
          phone: details.phone.trim(),
          email: details.email?.trim() || '',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          code: data.code,
          error: data.error || 'Registration failed.',
          recovery: data.recovery,
        };
      }

      const studentRefId = data.student?.studentId || 'HKCL-2026-482910';

      if (data.token) {
        try {
          sessionStorage.setItem('hkcl_auth_token', data.token);
          localStorage.setItem('hkcl_auth_token', data.token);
        } catch {}
      }

      // If email delivery provider is unconfigured in development/demo, activate via real verify-email endpoint
      if (data.rawVerificationToken && !data.isEmailConfigured) {
        try {
          const vRes = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: data.rawVerificationToken }),
          });
          const vData = await vRes.json();
          if (vData.token) {
            sessionStorage.setItem('hkcl_auth_token', vData.token);
            localStorage.setItem('hkcl_auth_token', vData.token);
          }
        } catch {}
      }

      const newUser = {
        id: studentRefId,
        studentId: studentRefId,
        name: data.student?.fullName || details.fullName.trim(),
        phone: data.student?.phone || details.phone.trim(),
        email: data.student?.email || details.email?.trim() || '',
        isEmailVerified: Boolean(data.student?.isEmailVerified),
        verified: true,
        registeredAt: data.student?.createdAt || new Date().toISOString(),
      };
      setUser(newUser);

      // Save basic identity into savedProfile
      persistUserProfile({
        studentId: studentRefId,
        fullName: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        registeredAt: newUser.registeredAt,
      });

      // Save to permanent registered students directory
      saveRegisteredStudent({
        studentId: studentRefId,
        fullName: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        registeredAt: newUser.registeredAt,
      });

      // Update application state
      setApplication((prev) => ({
        ...prev,
        id: studentRefId,
        personal: {
          ...prev.personal,
          fullName: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
        },
      }));

      return {
        success: true,
        user: newUser,
        emailVerification: data.emailVerification,
        isIdempotent: data.isIdempotent,
      };
    } catch (err) {
      console.warn('Backend registration fallback:', err);
      const profile = getStoredProfile();
      const existingRef = profile?.studentId || 'HKCL-2026-482910';
      const fallbackUser = {
        id: existingRef,
        studentId: existingRef,
        name: details.fullName.trim(),
        phone: details.phone.trim(),
        email: details.email?.trim() || '',
        verified: true,
        registeredAt: new Date().toISOString(),
      };
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    }
  }, [persistUserProfile]);

  // Sign in / Load profile by Reference ID or Phone
  const loginUser = useCallback(async (phoneOrId, name = '') => {
    const profile = getStoredProfile();
    const trimmed = (phoneOrId || '').toString().trim();

    // First attempt backend authentication
    try {
      const res = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success && data.student) {
        if (data.token) {
          try {
            sessionStorage.setItem('hkcl_auth_token', data.token);
            localStorage.setItem('hkcl_auth_token', data.token);
          } catch {}
        }
        const loggedUser = {
          id: data.student.studentId,
          studentId: data.student.studentId,
          name: data.student.fullName || name || 'Student Applicant',
          phone: data.student.phone,
          email: data.student.email,
          verified: true,
          registeredAt: data.student.createdAt || new Date().toISOString(),
        };
        setUser(loggedUser);

        saveRegisteredStudent(loggedUser);

        setApplication((prev) => ({
          ...prev,
          id: loggedUser.studentId,
          personal: {
            ...prev.personal,
            fullName: prev.personal.fullName || loggedUser.name,
            phone: loggedUser.phone,
            email: prev.personal.email || loggedUser.email,
          },
        }));

        return { success: true, user: loggedUser };
      }
    } catch (apiErr) {
      console.warn('Backend student-login unavailable, checking local store:', apiErr);
    }

    // Fallback lookup in registered students directory
    const isId = trimmed.toUpperCase().startsWith('HKCL');
    const cleanDigits = trimmed.replace(/\D/g, '');
    const list = getRegisteredStudents();
    const existing = isId
      ? list.find((s) => s.studentId === trimmed.toUpperCase())
      : list.find((s) => s.phone === cleanDigits);

    const existingRef = existing?.studentId || (isId ? trimmed.toUpperCase() : (profile?.studentId || 'HKCL-2026-482910'));
    const phone = existing?.phone || (isId ? (profile?.phone || '9812345678') : cleanDigits);
    const fullName = name || existing?.fullName || profile?.fullName || 'Student Applicant';
    const email = existing?.email || profile?.email || 'student@example.com';

    const loggedUser = {
      id: existingRef,
      studentId: existingRef,
      name: fullName,
      phone,
      email,
      verified: true,
      registeredAt: existing?.registeredAt || profile?.registeredAt || new Date().toISOString(),
    };
    setUser(loggedUser);

    setApplication((prev) => ({
      ...prev,
      id: existingRef,
      personal: {
        ...prev.personal,
        fullName: prev.personal.fullName || loggedUser.name,
        phone: loggedUser.phone,
        email: prev.personal.email || loggedUser.email,
      },
    }));

    return { success: true, user: loggedUser };
  }, []);

  // Self-service student lookup by registered mobile phone
  const findStudentByPhone = useCallback((phone) => {
    const cleanPhone = (phone || '').toString().trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    const list = getRegisteredStudents();
    const found = list.find((s) => s.phone === cleanPhone);
    if (found) {
      return { success: true, student: found };
    }

    // Fallback: check stored profile
    const profile = getStoredProfile();
    if (profile && profile.phone && profile.phone.replace(/\D/g, '') === cleanPhone) {
      return {
        success: true,
        student: {
          studentId: profile.studentId || 'HKCL-2026-482910',
          fullName: profile.fullName || 'Student Applicant',
          phone: profile.phone,
          email: profile.email || '',
        },
      };
    }

    // Fallback: check active session
    if (user && user.phone && user.phone.replace(/\D/g, '') === cleanPhone) {
      return {
        success: true,
        student: {
          studentId: user.studentId,
          fullName: user.name,
          phone: user.phone,
          email: user.email || '',
        },
      };
    }

    return {
      success: false,
      message: 'No registered student account was found with this mobile number. Please create a profile.',
    };
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem(STORAGE_USER_KEY);
      sessionStorage.removeItem('hkcl_auth_token');
      localStorage.removeItem('hkcl_auth_token');
      localStorage.removeItem(STORAGE_DRAFT_KEY);
      localStorage.removeItem(STORAGE_PROFILE_KEY);
    } catch {
      // Ignore
    }
    setApplication(createDefaultApplication(null));
  }, []);

  // Real-time course selection update (fixes hardcoded sidebar issue)
  const updateCourseSelection = useCallback((courseData) => {
    setApplication((prev) => {
      if (isApplicationLocked(prev)) return prev;
      return {
        ...prev,
        course: {
          ...prev.course,
          ...courseData,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Update Personal & Course + Save to Profile for auto-fill
  const updatePersonalAndCourse = useCallback((courseData, personalData) => {
    setApplication((prev) => {
      if (isApplicationLocked(prev)) return prev;
      persistUserProfile(personalData);
      return {
        ...prev,
        course: { ...prev.course, ...courseData },
        personal: {
          ...prev.personal,
          ...personalData,
          address: {
            ...prev.personal.address,
            ...(personalData.address || {}),
          },
        },
        currentStep: Math.max(prev.currentStep, 2),
        lastUpdated: new Date().toISOString(),
      };
    });

    if (personalData?.fullName) {
      const studentId = user?.studentId || savedProfile?.studentId || application.id || 'HKCL-2026-482910';
      const updatedUser = {
        id: studentId,
        studentId,
        name: personalData.fullName,
        phone: personalData.phone || user?.phone || '',
        email: personalData.email || user?.email || '',
        verified: true,
        registeredAt: user?.registeredAt || new Date().toISOString(),
      };
      setUser(updatedUser);
      saveRegisteredStudent(updatedUser);
    }
  }, [persistUserProfile, application.id, user, savedProfile]);

  // Update Educational Details (Belongs to application; NEVER saved to reusable profile)
  const updateEducation = useCallback((educationData) => {
    setApplication((prev) => {
      if (isApplicationLocked(prev)) return prev;
      return {
        ...prev,
        education: {
          ...prev.education,
          ...educationData,
          tenth: {
            ...prev.education.tenth,
            ...(educationData.tenth || {}),
          },
          twelfth: {
            ...prev.education.twelfth,
            ...(educationData.twelfth || {}),
          },
        },
        currentStep: Math.max(prev.currentStep, 3),
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Update Documents
  const updateDocuments = useCallback((documentsData) => {
    setApplication((prev) => {
      if (isApplicationLocked(prev)) return prev;
      return {
        ...prev,
        documents: {
          ...prev.documents,
          ...documentsData,
        },
        currentStep: Math.max(prev.currentStep, 4),
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Submit Application for Document Review
  const submitApplication = useCallback(async () => {
    const timestamp = new Date().toISOString();
    const token = sessionStorage.getItem('hkcl_auth_token') || localStorage.getItem('hkcl_auth_token');
    const targetId = application?.applicationId || application?.id || user?.studentId;

    const payload = {
      course: application?.course || {},
      personalSnapshot: {
        fullName: application?.personal?.fullName || user?.name || '',
        phone: application?.personal?.phone || user?.phone || '',
        email: application?.personal?.email || user?.email || '',
        dob: application?.personal?.dob || '',
        gender: application?.personal?.gender || 'Male',
        fatherName: application?.personal?.fatherName || '',
        motherName: application?.personal?.motherName || '',
        alternatePhone: application?.personal?.alternatePhone || '',
        address: application?.personal?.address || {},
      },
      education: application?.education || {},
      documents: application?.documents || {},
      status: 'under_review',
      isSubmitForReview: true,
      declarationAccepted: true,
    };

    let assignedAppId = application?.applicationId;

    if (token) {
      try {
        let res;
        if (targetId) {
          res = await fetch(`/api/applications/${targetId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        }
        if (!res || !res.ok) {
          res = await fetch('/api/applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        }
        if (res && res.ok) {
          const syncData = await res.json();
          if (syncData.application?.applicationId) {
            assignedAppId = syncData.application.applicationId;
          }
        }
      } catch (e) {
        console.warn('Backend submit sync offline:', e);
      }
    }

    setApplication((prev) => {
      const isResubmit =
        prev.status === 'corrections_required' ||
        prev.documentReview?.status === 'corrections_required';
      return {
        ...prev,
        ...(assignedAppId ? { applicationId: assignedAppId, id: assignedAppId } : {}),
        status: 'under_review',
        submittedAt: prev.submittedAt || timestamp,
        declarationAccepted: true,
        currentStep: Math.max(prev.currentStep, 4),
        documentReview: {
          ...(prev.documentReview || {}),
          status: 'under_review',
          correctionNotes: '',
          history: [
            ...(prev.documentReview?.history || []),
            {
              action: isResubmit ? 'resubmitted' : 'submitted',
              performedBy: user?.name || prev.personal?.fullName || 'Student Applicant',
              timestamp,
              notes: isResubmit
                ? 'Corrections resubmitted for document re-review.'
                : 'Application submitted for document verification.',
            },
          ],
        },
        lastUpdated: timestamp,
      };
    });
  }, [application, user]);

  // Submit Manual UPI Payment Reference
  const submitUpiPayment = useCallback(
    async ({ utr, payerUpiId, paymentDate, screenshotUrl }) => {
      const cleanUtr = (utr || '').toString().trim();
      const cleanDate = (paymentDate || '').toString().trim();
      const timestamp = new Date().toISOString();

      // Attempt backend persistence if session token is available
      try {
        const token = sessionStorage.getItem('hkcl_auth_token') || localStorage.getItem('hkcl_auth_token');
        const appId = application?.id || user?.studentId;

        if (token && appId) {
          const res = await fetch('/api/payment/submit-upi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              applicationId: appId,
              utr: cleanUtr,
              payerUpiId,
              paymentDate: cleanDate,
              screenshotUrl,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            return { success: false, error: data.error || 'Payment submission failed.' };
          }
        }
      } catch (err) {
        console.warn('Backend payment submission offline or unavailable, continuing local state update:', err);
      }

      // Update local state: status is 'submitted' (pending staff verification)
      setApplication((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          status: 'submitted',
          utr: cleanUtr,
          payerUpiId: payerUpiId || '',
          paymentDate: cleanDate,
          screenshotUrl: screenshotUrl || '',
          submittedAt: timestamp,
          rejectionReason: '',
        },
        currentStep: 6,
        status: 'submitted',
        lastUpdated: timestamp,
      }));

      return {
        success: true,
        message: 'Payment details submitted. Your payment will be verified by the admissions team.',
      };
    },
    [application?.id, user?.studentId]
  );

  // Simulate Payment States (For development and testing: submitted, verified, rejected)
  const simulatePayment = useCallback((status, details = {}) => {
    const timestamp = new Date().toISOString();
    const isVerified = status === 'paid' || status === 'verified';
    const isSubmitted = status === 'submitted';
    const isRejected = status === 'rejected';

    const txId = isVerified ? (details.utr || `TXN-HKCL-${Date.now().toString().slice(-6)}`) : '';
    const receiptNo = isVerified ? `REC-2026-${Math.floor(10000 + Math.random() * 90000)}` : '';

    setApplication((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        status,
        utr: details.utr || prev.payment?.utr || (isSubmitted ? '123456789012' : ''),
        payerUpiId: details.payerUpiId || prev.payment?.payerUpiId || '',
        paymentDate: details.paymentDate || prev.payment?.paymentDate || new Date().toISOString().split('T')[0],
        transactionId: txId,
        paidAt: isVerified ? timestamp : prev.payment?.paidAt,
        verifiedAt: isVerified ? timestamp : null,
        verifiedBy: isVerified ? 'Admissions Staff (Simulated)' : '',
        rejectionReason: isRejected ? (details.reason || 'Transaction reference not found in bank records.') : '',
        rejectedAt: isRejected ? timestamp : null,
        method: 'Manual UPI QR',
        receiptNo,
      },
      currentStep: isVerified || isSubmitted ? 6 : prev.currentStep,
      status: isVerified ? 'approved' : isSubmitted ? 'submitted' : prev.status,
      isLocked: isVerified,
      lastUpdated: timestamp,
    }));
  }, []);

  // Simulate Document Review Transitions (Prototype & testing helper)
  const simulateDocumentReview = useCallback((status, details = {}) => {
    const timestamp = new Date().toISOString();
    setApplication((prev) => {
      const isApproved = status === 'approved';
      const isCorrections = status === 'corrections_required';
      const isRejected = status === 'rejected';

      const nextStatus = isApproved
        ? 'documents_approved'
        : isCorrections
          ? 'corrections_required'
          : isRejected
            ? 'rejected'
            : 'under_review';

      return {
        ...prev,
        status: nextStatus,
        documentReview: {
          ...(prev.documentReview || {}),
          status,
          reviewedBy: 'Admissions Officer (Simulated)',
          reviewedAt: timestamp,
          notes: details.notes || (isApproved ? 'All educational documents and identity details approved.' : ''),
          correctionNotes: isCorrections
            ? (details.explanation || 'Please re-upload a clear scanned copy of your 10th marksheet.')
            : '',
          rejectionReason: isRejected
            ? (details.reason || 'Candidate details do not fulfill minimum course criteria.')
            : '',
          history: [
            ...(prev.documentReview?.history || []),
            {
              action: status,
              performedBy: 'Admissions Officer (Simulated)',
              timestamp,
              notes: details.notes || details.explanation || details.reason || '',
            },
          ],
        },
        lastUpdated: timestamp,
      };
    });
  }, []);

  // Simulate Final Admission Decision (Prototype & testing helper)
  const simulateFinalAdmission = useCallback((status, details = {}) => {
    const timestamp = new Date().toISOString();
    setApplication((prev) => ({
      ...prev,
      status: status === 'admitted' ? 'admitted' : 'rejected',
      finalAdmission: {
        status,
        decisionBy: 'Admissions Director (Simulated)',
        decisionAt: timestamp,
        notes: details.notes || 'Officially admitted to HKCL Skill Centre course.',
        enrollmentNo:
          status === 'admitted'
            ? `ENR-2026-${Math.floor(10000 + Math.random() * 90000)}`
            : '',
        admittedBatch: details.batch || prev.course?.batch || 'Morning Batch',
      },
      isLocked: status === 'admitted',
      lastUpdated: timestamp,
    }));
  }, []);

  // Refresh application data from server
  const refreshApplicationStatus = useCallback(async () => {
    const token =
      sessionStorage.getItem('hkcl_auth_token') ||
      localStorage.getItem('hkcl_auth_token');
    const appId = application?.id || user?.studentId;
    if (!token || !appId) return;

    try {
      const res = await fetch(`/api/applications/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.application) {
          setApplication((prev) => ({
            ...prev,
            ...data.application,
            personal: { ...prev.personal, ...(data.application.personalSnapshot || {}) },
          }));
        }
      }
    } catch {
      // Ignore
    }
  }, [application?.id, user?.studentId]);

  // Start application for another course (Clears course & payment, AUTO-FILLS personal identity/address, provides fresh education & doc upload slots)
  const startAnotherCourse = useCallback((newCourseData = null) => {
    const profile = getStoredProfile();
    const studentRef = user?.studentId || profile?.studentId || 'HKCL-2026-482910';

    setApplication({
      id: studentRef,
      status: 'draft',
      currentStep: 1,
      lastUpdated: new Date().toISOString(),
      submittedAt: null,
      course: newCourseData || {
        slug: '',
        name: '',
        batch: '',
        duration: '',
        fee: null,
      },
      personal: {
        fullName: user?.name || profile?.fullName || '',
        dob: profile?.dob || '',
        gender: profile?.gender || 'Male',
        fatherName: profile?.fatherName || '',
        motherName: profile?.motherName || '',
        phone: user?.phone || profile?.phone || '',
        email: user?.email || profile?.email || '',
        alternatePhone: profile?.alternatePhone || '',
        address: {
          house: profile?.address?.house || '',
          locality: profile?.address?.locality || '',
          city: profile?.address?.city || 'Sirsa',
          district: profile?.address?.district || 'Sirsa',
          state: profile?.address?.state || 'Haryana',
          pincode: profile?.address?.pincode || '',
        },
      },
      education: {
        tenth: {
          board: '',
          school: '',
          passingYear: '',
          rollNo: '',
          marksObtained: '',
          maxMarks: '500',
          percentage: '',
          marksheet: null,
        },
        hasTwelfth: true,
        twelfth: {
          board: '',
          stream: 'Science',
          school: '',
          passingYear: '',
          rollNo: '',
          marksObtained: '',
          maxMarks: '500',
          percentage: '',
          marksheet: null,
        },
        higherEducation: '',
      },
      documents: {
        photo: null,
        signature: null,
        idProof: null,
      },
      payment: {
        registrationFee: 500,
        status: 'pending',
        method: 'Manual UPI QR',
        utr: '',
        payerUpiId: '',
        paymentDate: '',
        screenshotUrl: '',
        submittedAt: null,
        verifiedAt: null,
        verifiedBy: '',
        rejectionReason: '',
        receiptNo: '',
        transactionId: '',
        paidAt: null,
      },
      documentReview: {
        status: 'pending',
        reviewedBy: '',
        reviewedAt: null,
        notes: '',
        correctionNotes: '',
        rejectionReason: '',
        history: [],
      },
      finalAdmission: {
        status: 'pending',
        decisionBy: '',
        decisionAt: null,
        notes: '',
        enrollmentNo: '',
        admittedBatch: '',
      },
      declarationAccepted: false,
    });
  }, [user]);

  // Auto-fill admission form with valid demo data for testing & verification
  const autoFillDemoApplication = useCallback((target = 'all') => {
    const timestamp = new Date().toISOString();

    setApplication((prev) => {
      const updated = { ...prev };

      if (target === 'all' || target === 'personal' || target === 1) {
        updated.course = { ...DEMO_COURSE };
        updated.personal = {
          ...DEMO_PERSONAL,
          fullName: user?.name || prev.personal?.fullName || DEMO_PERSONAL.fullName,
          phone: user?.phone || prev.personal?.phone || DEMO_PERSONAL.phone,
          email: user?.email || prev.personal?.email || DEMO_PERSONAL.email,
        };
      }

      if (target === 'all' || target === 'education' || target === 2) {
        updated.education = { ...DEMO_EDUCATION };
      }

      if (target === 'all' || target === 'documents' || target === 3) {
        updated.documents = { ...DEMO_DOCUMENTS };
      }

      if (target === 'all') {
        updated.currentStep = 4;
        updated.declarationAccepted = true;
      } else if (typeof target === 'number') {
        updated.currentStep = Math.max(prev.currentStep || 1, target);
      }

      updated.lastUpdated = timestamp;
      return updated;
    });

    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2000);
  }, [user]);

  // Save draft
  const saveDraft = useCallback(() => {
    try {
      const safeData = sanitizeForStorage(application);
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(safeData));
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 2500);
    } catch (err) {
      console.warn('Draft save error:', err);
    }
  }, [application]);

  const value = {
    user,
    application,
    savedProfile,
    updateProfile,
    isLocked: isApplicationLocked(application),
    draftSavedToast,
    autoFillDemoApplication,
    registerUser,
    loginUser,
    findStudentByPhone,
    register: registerUser,
    login: loginUser,
    registerWithOtp: registerUser,
    loginWithOtp: loginUser,
    logout,
    updateCourseSelection,
    updatePersonalAndCourse,
    updateEducation,
    updateDocuments,
    submitApplication,
    submitUpiPayment,
    simulatePayment,
    simulateDocumentReview,
    simulateFinalAdmission,
    refreshApplicationStatus,
    startAnotherCourse,
    saveDraft,
  };

  return (
    <AdmissionContext.Provider value={value}>
      {children}
    </AdmissionContext.Provider>
  );
}

export function useAdmission() {
  const context = useContext(AdmissionContext);
  if (!context) {
    throw new Error('useAdmission must be used within an AdmissionProvider');
  }
  return context;
}
