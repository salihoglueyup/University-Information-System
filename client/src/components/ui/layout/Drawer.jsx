import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Drawer = ({
    isOpen,
    onClose,
    title,
    children,
    position = 'right',
    size = 'md',
    className = ''
}) => {

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const sizes = {
        sm: "max-w-xs",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full"
    };

    const variants = {
        right: {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' }
        },
        left: {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' }
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={variants[position].initial}
                        animate={variants[position].animate}
                        exit={variants[position].exit}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`
              fixed top-0 bottom-0 bg-white shadow-2xl z-50 overflow-hidden flex flex-col
              ${position === 'right' ? 'right-0' : 'left-0'}
              ${sizes[size]} w-full ${className}
            `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Drawer;
