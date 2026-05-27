import { motion } from 'framer-motion';

const Card = ({ children, className = '', title, footer, noHover = false, ...props }) => {
    return (
        <motion.div
            className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300 ${className}`}
            whileHover={!noHover ? { y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            {title && (
                <div className="px-6 py-4 border-b border-gray-50 dark:border-slate-800/50">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                </div>
            )}
            <div className={`p-6 ${children?.props?.className || ''}`}>
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-50 dark:border-slate-800 rounded-b-2xl">
                    {footer}
                </div>
            )}
        </motion.div>
    );
};

export default Card;
