import { useState, useRef, useEffect, useMemo } from 'react';

const TimePicker = ({ label, value, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const [hour, minute] = useMemo(() => {
        if (!value || !value.includes(':')) return ['00', '00'];
        const [h = '00', m = '00'] = value.split(':');
        return [h, m];
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTimeChange = (h, m) => {
        if (onChange) onChange(`${h}:${m}`);
    };

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

    return (
        <div className={`w-full ${className}`} ref={containerRef}>
            {label && <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-left flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                >
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-slate-700 font-medium tracking-wide">
                        {hour}:{minute}
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-50 p-4 flex gap-4 justify-center">
                        {/* Hours */}
                        <div className="h-48 overflow-y-auto scrollbar-hide">
                            {hours.map(h => (
                                <div
                                    key={h}
                                    onClick={() => handleTimeChange(h, minute)}
                                    className={`
                                cursor-pointer px-4 py-2 rounded-lg text-sm text-center font-medium
                                ${h === hour ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}
                            `}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>

                        <div className="h-48 w-px bg-slate-100"></div>

                        {/* Minutes */}
                        <div className="h-48 overflow-y-auto scrollbar-hide">
                            {minutes.map(m => (
                                <div
                                    key={m}
                                    onClick={() => handleTimeChange(hour, m)}
                                    className={`
                                cursor-pointer px-4 py-2 rounded-lg text-sm text-center font-medium
                                ${m === minute ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}
                            `}
                                >
                                    {m}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimePicker;
