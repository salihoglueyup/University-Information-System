
const Avatar = ({ src, alt, fallback, size = 'md', className = '', ...props }) => {

    const sizes = {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg"
    };

    return (
        <div
            className={`relative inline-block rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-white dark:border-slate-700 shadow-sm flex-shrink-0 transition-colors duration-300 ${sizes[size]} ${className}`}
            {...props}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || "Avatar"}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-800 text-blue-700 dark:text-blue-400 font-bold transition-colors duration-300">
                    {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
                </div>
            )}
        </div>
    );
};

export default Avatar;
