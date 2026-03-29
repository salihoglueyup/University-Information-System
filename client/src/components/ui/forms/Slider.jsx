import { useState, useRef, useEffect } from 'react';

const Slider = ({ min = 0, max = 100, value = 50, onChange, className = '' }) => {
    const [internalValue, setInternalValue] = useState(value);
    const trackRef = useRef(null);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const handleMouseDown = (e) => {
        updateValue(e);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        updateValue(e);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const updateValue = (e) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);
        const newValue = Math.round(min + percentage * (max - min));

        setInternalValue(newValue);
        if (onChange) onChange(newValue);
    };

    const percentage = ((internalValue - min) / (max - min)) * 100;

    return (
        <div className={`w-full py-2 ${className}`}>
            <div
                ref={trackRef}
                className="relative h-2 bg-slate-200 rounded-full cursor-pointer group"
                onMouseDown={handleMouseDown}
            >
                <div
                    className="absolute h-full bg-blue-600 rounded-full transition-all duration-75 group-hover:bg-blue-500"
                    style={{ width: `${percentage}%` }}
                ></div>
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                    style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {internalValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slider;
