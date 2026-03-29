
const Textarea = ({
    label,
    error,
    rows = 4,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <textarea
                rows={rows}
                className={`
          w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 
          focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-y
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 ml-1 text-xs text-red-500 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Textarea;
