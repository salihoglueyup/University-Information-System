import axios from 'axios';
import { getToken, clearAuthSession } from '../utils/authStorage';

let csrfToken = null;
const directApiFallbackBase = import.meta.env.VITE_API_FALLBACK || 'http://localhost:5000/api';

// Initial Axios config
const axiosInstance = axios.create({
    baseURL: '/api', // Proxy will handle it through Vite dev server
    withCredentials: true, // Important for cookies like CSRF
    timeout: 30000 // 30s timeout for slower Docker network
});

// Fetch CSRF Token ONCE upon application load or via a helper function
export const fetchCsrfToken = async () => {
    try {
        const response = await axiosInstance.get('/csrf-token');
        csrfToken = response.data.csrfToken;
        axiosInstance.defaults.headers.common['X-CSRF-Token'] = csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token', error);
    }
};

// Request Interceptor: Attach JWT and CSRF
axiosInstance.interceptors.request.use(
    (config) => {
        // Attach JWT token from centralized auth storage
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Attach CSRF dynamically if needed and already fetched
        if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method)) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global Error Handling (like 401, 403, validation errors)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};

        // Fallback retry ONLY for local development (not Docker)
        // Docker: Don't retry to localhost:5000 from container - use proxy instead
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (!error.response && originalRequest && !originalRequest._retryDirectBase && isLocalhost) {
            const normalizedBase = (originalRequest.baseURL || '').toString();
            if (normalizedBase.startsWith('/')) {
                originalRequest._retryDirectBase = true;
                originalRequest.baseURL = directApiFallbackBase;
                return axiosInstance(originalRequest);
            }
        }

        if (error.response) {
            // Handle specific status codes
            const status = error.response.status;
            const errorMessage = error.response?.data?.message || '';
            
            if (status === 401) {
                // Unauthorized - Clear session and redirect to login
                clearAuthSession();
                window.location.href = '/login';
            } else if (status === 403) {
                // Forbidden - Usually bad CSRF or Role mismatch
                console.warn('Forbidden access.');

                const isPotentialCsrfError = String(errorMessage).toLowerCase().includes('csrf');
                const isWriteRequest = ['post', 'put', 'patch', 'delete'].includes((originalRequest.method || '').toLowerCase());

                if (isPotentialCsrfError && isWriteRequest && !originalRequest._retryCsrf) {
                    originalRequest._retryCsrf = true;
                    try {
                        await fetchCsrfToken();
                        return axiosInstance(originalRequest);
                    } catch (csrfRefreshError) {
                        console.warn('CSRF refresh failed', csrfRefreshError);
                        return Promise.reject(csrfRefreshError);
                    }
                }
            } else if (status === 400) {
                // Formatting Zod validation errors to clean messages
                const validationErrors = error.response.data.messages || error.response.data.errors || [];
                console.warn('Validation Errors:', validationErrors);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
