/**
 * Central API Client Configuration
 * ---------------------------------------------------------------------------
 * Provides an environment-based base URL and consistent fetch wrapper
 * for backend integration.
 *
 * In production or development, set VITE_API_BASE_URL in your .env file:
 *   VITE_API_BASE_URL=https://api.hkclsirsa.in/api
 */

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '/api';

/**
 * Standard fetch helper with error handling and JSON parsing.
 *
 * @param {string} endpoint - API route (e.g. '/enquiries' or '/courses')
 * @param {RequestInit} [options] - Fetch configuration
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle non-2xx HTTP responses
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Fallback to status text if response is not JSON
        errorMessage = response.statusText || errorMessage;
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    // 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed for [${config.method || 'GET'}] ${url}:`, error);
    throw error;
  }
}
