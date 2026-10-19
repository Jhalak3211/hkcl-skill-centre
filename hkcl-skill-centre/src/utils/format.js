import { CONTACT_FALLBACK, getCategory } from '../data/courses.js';

export const formatRupees = (amount) => `₹${amount.toLocaleString('en-IN')}`;

/** "₹4,500" or the fallback message when the fee is unknown. */
export const getFeeText = (course) =>
  typeof course.fee === 'number' ? formatRupees(course.fee) : CONTACT_FALLBACK;

/** Short suffix such as "per course", or null. */
export const getFeeUnit = (course) => (typeof course.fee === 'number' ? course.feeUnit : null);

export const getDurationText = (course) => course.duration ?? course.durationHint ?? CONTACT_FALLBACK;

export const getEligibilityText = (course) => course.eligibility ?? CONTACT_FALLBACK;

export const valueOrFallback = (value) => value ?? CONTACT_FALLBACK;

export const getCategoryLabel = (course) => getCategory(course.category)?.label ?? '';
