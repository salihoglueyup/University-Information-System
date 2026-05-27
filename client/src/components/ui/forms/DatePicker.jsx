import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

const DatePicker = ({ label, value, onChange, error, className = '', range = false, ...props }) => {

    // For range mode, value implies { start: string, end: string }
    // For single mode, value implies string

    const handleStartChange = (e) => {
        onChange({ ...value, start: e.target.value });
    };

    const handleEndChange = (e) => {
        onChange({ ...value, end: e.target.value });
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}

            {range ? (
                <div className="flex items-center gap-2">
                    <div className="relative group flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
                            <CalendarIcon size={16} />
                        </div>
                        <input
                            type="date"
                            value={value?.start || ''}
                            onChange={handleStartChange}
                            className={`
                                w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 
                                focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                                appearance-none
                            `}
                        />
                    </div>
                    <ArrowRight size={14} className="text-slate-400" />
                    <div className="relative group flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
                            <CalendarIcon size={16} />
                        </div>
                        <input
                            type="date"
                            value={value?.end || ''}
                            onChange={handleEndChange}
                            className={`
                                w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 
                                focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                                appearance-none
                            `}
                        />
                    </div>
                </div>
            ) : (
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
                        <CalendarIcon size={18} />
                    </div>
                    <input
                        type="date"
                        value={value}
                        onChange={onChange}
                        className={`
                            w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 
                            focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}
                            appearance-none
                        `}
                        {...props}
                    />
                </div>
            )}

            {error && (
                <p className="mt-1 ml-1 text-xs text-red-500 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default DatePicker;
