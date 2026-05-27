import { Check } from 'lucide-react';

const Stepper = ({ steps = [], currentStep = 0, className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10
                  ${isCompleted || isCurrent ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-slate-200 text-slate-400'}
                  ${isCurrent ? 'ring-4 ring-blue-50 scale-110' : ''}
                `}
                            >
                                {isCompleted ? <Check size={18} strokeWidth={3} /> : <span className="font-bold text-sm">{index + 1}</span>}
                            </div>
                            <span
                                className={`
                  absolute top-12 text-xs font-bold whitespace-nowrap transition-colors duration-300
                  ${isCompleted || isCurrent ? 'text-blue-700' : 'text-slate-400'}
                `}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
