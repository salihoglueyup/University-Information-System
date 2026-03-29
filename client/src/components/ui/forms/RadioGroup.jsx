
const RadioGroup = ({ options = [], value, onChange, name, label, className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="space-y-2">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`
              flex items-center p-3 rounded-xl border cursor-pointer transition-all
              ${value === option.value
                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }
            `}
                    >
                        <div className="relative flex items-center">
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={() => onChange(option.value)}
                                className="peer sr-only"
                            />
                            <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                peer-checked:border-blue-600 peer-checked:border-[6px]
                border-slate-300 bg-white
              `}></div>
                        </div>
                        <div className="ml-3">
                            <span className={`block text-sm font-bold ${value === option.value ? 'text-blue-900' : 'text-slate-700'}`}>
                                {option.label}
                            </span>
                            {option.description && (
                                <span className={`block text-xs ${value === option.value ? 'text-blue-600' : 'text-slate-500'}`}>
                                    {option.description}
                                </span>
                            )}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;
