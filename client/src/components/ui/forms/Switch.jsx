
const Switch = ({ checked, onChange, label, disabled, className = '', ...props }) => {
    return (
        <label className={`inline-flex items-center gap-3 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    {...props}
                />
                <div className={`
          w-11 h-6 bg-slate-200 rounded-full peer 
          peer-focus:ring-2 peer-focus:ring-blue-100 
          peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
          after:bg-white after:border-gray-300 after:border after:rounded-full 
          after:h-5 after:w-5 after:transition-all 
          peer-checked:bg-blue-600 border border-transparent
        `}></div>
            </div>
            {label && (
                <span className="text-sm font-medium text-slate-700 select-none group-hover:text-slate-900">
                    {label}
                </span>
            )}
        </label>
    );
};

export default Switch;
