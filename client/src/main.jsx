import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';
import App from './App';
import './index.css'
import { API_URL } from './config/apiConfig'
import 'react-toastify/dist/ReactToastify.css';
import './i18n'; // Webpack will load language dictionaries
import { fetchCsrfToken } from './api/axiosInstance';
import { getToken } from './utils/authStorage';

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    })
    .catch(() => {
      // Ignore service worker cleanup errors in dev.
    });
}

// Fetch CSRF token on startup
fetchCsrfToken();

const queryClient = new QueryClient();

// Global fetch interceptor to inject JWT token
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;

  // Check if hitting our API explicitly
  if (typeof resource === 'string' && resource.startsWith(API_URL) && !resource.includes('/auth/login')) {
    const token = getToken();
    if (token) {
      config = config || {};
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
      args[1] = config;
    }
  }
  return originalFetch(...args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer position="bottom-right" theme="colored" autoClose={4000} />
    </QueryClientProvider>
  </StrictMode>,
)

