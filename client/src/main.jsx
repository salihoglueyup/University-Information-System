import React from 'react';
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';
import App from './App';
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import { fetchCsrfToken } from './api/axiosInstance';

// Cleanup stale Service Workers and caches in development
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(r => r.unregister()))
    .catch(() => {});
}

if (import.meta.env.DEV && 'caches' in window) {
  caches.keys()
    .then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .catch(() => {});
}

fetchCsrfToken();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});
const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer position="bottom-right" theme="colored" autoClose={4000} />
    </QueryClientProvider>
  </React.StrictMode>
);
