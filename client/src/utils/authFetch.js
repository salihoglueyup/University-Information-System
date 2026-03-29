import { getToken } from './authStorage';

/**
 * Wrapper for native fetch to automatically include the JWT Authorization header.
 * Use this instead of native fetch for API calls that require authentication.
 */
export const authFetch = async (url, options = {}) => {
    const token = getToken();

    // Create headers object if it doesn't exist
    const headers = new Headers(options.headers || {});

    // Add Authorization header if token exists
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Merge modified headers back into options
    const newOptions = {
        ...options,
        headers
    };

    return fetch(url, newOptions);
};
