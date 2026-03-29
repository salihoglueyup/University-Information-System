import { useRef, useState, useEffect } from 'react';

const InputOTP = ({ length = 6, onChange, className = '' }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Allow only one digit
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Call onChange with full string
        const combinedOtp = newOtp.join("");
        if (onChange) onChange(combinedOtp);

        // Move to next input if value is entered
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);
    };

    const handleKeyDown = (index, e) => {
        // Move to prev input on backspace if current is empty
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className={`flex gap-2 justify-center ${className}`}>
            {otp.map((value, index) => (
                <input
                    key={index}
                    type="text"
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`
            w-10 h-12 text-center text-xl font-bold rounded-xl border border-slate-200 bg-slate-50
            focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all
            ${value ? 'border-blue-400 bg-blue-50/10' : ''}
          `}
                />
            ))}
        </div>
    );
};

export default InputOTP;
