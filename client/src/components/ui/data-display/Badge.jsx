
const Badge = ({ children, variant = 'info', size = 'md', className = '' }) => {
    const variants = {
        info: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-600/20 dark:ring-blue-500/30",
        success: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20 dark:ring-green-500/30",
        warning: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 ring-orange-600/20 dark:ring-orange-500/30",
        error: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-600/20 dark:ring-red-500/30",
        neutral: "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 ring-gray-500/20 dark:ring-slate-500/30"
    };

    const sizes = {
        sm: "text-[10px] px-1.5 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1"
    };

    return (
        <span className={`inline-flex items-center justify-center font-medium rounded-md ring-1 ring-inset ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
