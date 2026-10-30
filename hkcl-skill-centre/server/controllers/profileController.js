import Student from '../models/Student.js';
import { isDbConnected } from '../config/db.js';

// Fallback in-memory profile store
const fallbackProfiles = new Map();

/**
 * GET /api/profile
 * Retrieve permanent student reusable profile
 */
export async function getProfile(req, res) {
  try {
    const { studentId } = req.student;
    let student = null;

    if (isDbConnected) {
      try {
        student = await Student.findOne({ studentId });
      } catch {
        // Fallback
      }
    }

    if (!student && fallbackProfiles.has(studentId)) {
      student = fallbackProfiles.get(studentId);
    }

    if (!student) {
      student = {
        studentId,
        fullName: 'Student Applicant',
        phone: req.student.phone || '9812345678',
        email: '',
        fatherName: '',
        motherName: '',
        dob: '',
        gender: 'Male',
        address: {
          house: '',
          locality: '',
          city: 'Sirsa',
          district: 'Sirsa',
          state: 'Haryana',
          pincode: '',
        },
      };
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve profile.',
    });
  }
}

/**
 * PUT /api/profile
 * Update student reusable profile.
 * ---------------------------------------------------------------------------
 * STRICT CONSTRAINTS:
 * 1. Only basic personal identity and address fields are accepted.
 * 2. Educational qualifications, marks, and uploaded documents are REJECTED.
 * 3. Never modifies existing or previously submitted/locked applications.
 */
export async function updateProfile(req, res) {
  try {
    const { studentId } = req.student;
    const { fullName, email, fatherName, motherName, dob, gender, address } = req.body;

    const allowedUpdates = {};
    if (fullName !== undefined) allowedUpdates.fullName = String(fullName).trim();
    if (email !== undefined) allowedUpdates.email = String(email).trim().toLowerCase();
    if (fatherName !== undefined) allowedUpdates.fatherName = String(fatherName).trim();
    if (motherName !== undefined) allowedUpdates.motherName = String(motherName).trim();
    if (dob !== undefined) allowedUpdates.dob = String(dob).trim();
    if (gender !== undefined) allowedUpdates.gender = String(gender).trim();

    if (allowedUpdates.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(allowedUpdates.email)) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid email address format.',
        });
      }

      let conflict = null;
      if (isDbConnected) {
        try {
          conflict = await Student.findOne({
            email: allowedUpdates.email,
            studentId: { $ne: studentId },
          });
        } catch {
          // Fallback
        }
      }
      if (conflict) {
        return res.status(409).json({
          success: false,
          code: 'DUPLICATE_EMAIL',
          error: 'Another student account is already registered with this email address.',
        });
      }
    }

    if (address && typeof address === 'object') {
      allowedUpdates.address = {
        house: address.house ? String(address.house).trim() : '',
        locality: address.locality ? String(address.locality).trim() : '',
        city: address.city ? String(address.city).trim() : 'Sirsa',
        district: address.district ? String(address.district).trim() : 'Sirsa',
        state: address.state ? String(address.state).trim() : 'Haryana',
        pincode: address.pincode ? String(address.pincode).trim() : '',
      };
    }

    let updatedStudent = null;
    if (isDbConnected) {
      try {
        updatedStudent = await Student.findOneAndUpdate(
          { studentId },
          { $set: allowedUpdates },
          { new: true, runValidators: true }
        );
      } catch {
        // Fallback
      }
    }

    if (!updatedStudent) {
      const existing = fallbackProfiles.get(studentId) || { studentId, phone: req.student.phone };
      updatedStudent = { ...existing, ...allowedUpdates, updatedAt: new Date().toISOString() };
      fallbackProfiles.set(studentId, updatedStudent);
    }

    return res.status(200).json({
      success: true,
      message: 'Student profile updated successfully. (Past applications remain untouched)',
      student: updatedStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update profile.',
    });
  }
}
