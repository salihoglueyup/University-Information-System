/**
 * Centralized API configuration.
 * All API URLs should be imported from here instead of hardcoding.
 */

// Base URL for the backend server (no trailing slash)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Full API path prefix
export const API_URL = `${API_BASE_URL}/api`;
