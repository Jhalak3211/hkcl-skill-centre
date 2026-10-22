/**
 * Course Service
 * ---------------------------------------------------------------------------
 * Abstracts course data retrieval. Currently reads from local dataset,
 * with async interfaces ready to switch to REST API endpoints
 * (e.g. GET /api/courses) once the backend is in place.
 */

import {
  courses,
  categories,
  getCourseBySlug as getLocalCourseBySlug,
  getFeaturedCourses as getLocalFeaturedCourses,
  getRelatedCourses as getLocalRelatedCourses,
} from '../data/courses.js';

export async function fetchCourses(filters = {}) {
  // When backend is implemented:
  // const query = new URLSearchParams(filters).toString();
  // return apiRequest(`/courses?${query}`);

  let result = [...courses];

  if (filters.category && filters.category !== 'all') {
    result = result.filter((c) => c.category === filters.category);
  }

  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        (c.summary && c.summary.toLowerCase().includes(q))
    );
  }

  return result;
}

export async function fetchCourseBySlug(slug) {
  // When backend is implemented:
  // return apiRequest(`/courses/${slug}`);
  return getLocalCourseBySlug(slug) || null;
}

export async function fetchFeaturedCourses() {
  // When backend is implemented:
  // return apiRequest('/courses/featured');
  return getLocalFeaturedCourses();
}

export async function fetchCategories() {
  return categories;
}

export async function fetchRelatedCourses(course) {
  return getLocalRelatedCourses(course);
}
