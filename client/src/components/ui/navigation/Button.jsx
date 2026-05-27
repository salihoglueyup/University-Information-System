import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    isLoading = false,
    disabled,
    ...props
}) => {

    const baseStyles = "inline-flex items-center justify-center font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 focus:ring-blue-500",
        secondary: "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white focus:ring-gray-200 dark:focus:ring-slate-700",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 focus:ring-red-500",
        destructive: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 focus:ring-red-500",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 focus:ring-slate-200 dark:focus:ring-slate-700",
        outline: "border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:ring-blue-500",
        link: "bg-transparent text-blue-600 dark:text-blue-400 hover:underline p-0 h-auto font-normal shadow-none"
    };

    const sizes = {
        xs: "h-7 px-2 text-xs rounded-md",
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-12 px-6 text-base rounded-xl"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 size={18} className="animate-spin mr-2" />
            ) : Icon ? (
                <Icon size={18} className="mr-2" />
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
