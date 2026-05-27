import { useState } from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, max = 5, onChange, readOnly = false, className = '' }) => {
    const [hoverValue, setHoverValue] = useState(null);

    const handleMouseEnter = (val) => {
        if (!readOnly) {
            setHoverValue(val);
        }
    };

    const handleMouseLeave = () => {
        setHoverValue(null);
    };

    const handleClick = (val) => {
        if (!readOnly && onChange) {
            onChange(val);
        }
    };

    return (
        <div className={`flex gap-1 ${className}`}>
            {[...Array(max)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = (hoverValue || value) >= starValue;

                return (
                    <button
                        key={index}
                        type="button"
                        className={`transition-transform ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starValue)}
                        disabled={readOnly}
                    >
                        <Star
                            size={20}
                            className={`transition-colors ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default Rating;
