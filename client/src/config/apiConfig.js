/**
 * Centralized API configuration.
 * All API URLs should be imported from here instead of hardcoding.
 */

// Prefer same-origin by default; VITE_API_URL can override when explicitly needed.
const rawBaseUrl = (import.meta.env.VITE_API_URL || '').trim();
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

// Full API path prefix
export const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';
