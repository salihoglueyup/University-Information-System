import { Check } from 'lucide-react';

const Checkbox = ({ label, checked, onChange, disabled, className = '', ...props }) => {
    return (
        <label className={`inline-flex items-center gap-2 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
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
          w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center
          peer-checked:bg-blue-600 peer-checked:border-blue-600
          peer-focus:ring-2 peer-focus:ring-blue-100 
          border-slate-300 bg-white group-hover:border-blue-400
        `}>
                    <Check size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                </div>
            </div>
            {label && (
                <span className="text-sm text-slate-700 font-medium select-none group-hover:text-slate-900">
                    {label}
                </span>
            )}
        </label>
    );
};

export default Checkbox;
