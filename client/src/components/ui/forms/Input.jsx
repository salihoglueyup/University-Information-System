
const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
                        w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-sm text-slate-900 dark:text-slate-100 
                        placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all
                        ${Icon ? 'pl-10' : ''}
                        ${error ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-500/20' : ''}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 ml-1 text-xs text-red-500 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
