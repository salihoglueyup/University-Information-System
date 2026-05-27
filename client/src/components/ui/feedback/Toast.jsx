/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ToastItem = ({ id, message, type = 'info', duration = 3000, onClose }) => {
    const types = {
        info: { icon: Info, color: 'text-blue-500', bg: 'bg-white', border: 'border-blue-100' },
        success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-white', border: 'border-emerald-100' },
        warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-white', border: 'border-amber-100' },
        error: { icon: XCircle, color: 'text-red-500', bg: 'bg-white', border: 'border-red-100' }
    };

    const style = types[type];
    const Icon = style.icon;

    // Auto close
    React.useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => onClose(id), duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
        flex items-start gap-3 w-80 p-4 rounded-xl shadow-lg border ${style.bg} ${style.border} pointer-events-auto
      `}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.color}`} />
            <div className="flex-1 text-sm font-medium text-slate-700">
                {message}
            </div>
            <button
                onClick={() => onClose(id)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {createPortal(
                <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
                    <AnimatePresence mode="popLayout">
                        {toasts.map((toast) => (
                            <ToastItem
                                key={toast.id}
                                {...toast}
                                onClose={removeToast}
                            />
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

export default ToastProvider;
