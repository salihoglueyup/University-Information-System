import axios from 'axios';
import { getToken } from '../utils/authStorage';

let csrfToken = null;

// Initial Axios config
const axiosInstance = axios.create({
    baseURL: '/api', // Proxy will handle it, or http://localhost:5000/api if no proxy
    withCredentials: true, // Important for cookies like CSRF
    timeout: 15000 // Avoid indefinite pending requests in dashboard loading states
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
        if (error.response) {
            // Handle specific status codes
            const status = error.response.status;
            const originalRequest = error.config || {};
            const errorMessage = error.response?.data?.message || '';
            
            if (status === 401) {
                // Unauthorized - Kick out or attempt refresh
                console.warn('Unauthorized. JWT expired or invalid.');
                // localStorage.removeItem('token');
                // window.location.href = '/login';
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
