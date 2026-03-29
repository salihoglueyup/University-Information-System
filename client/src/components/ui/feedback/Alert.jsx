import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Alert = ({ variant = 'info', title, children, className = '' }) => {
    const variants = {
        info: "bg-blue-50 text-blue-800 border-blue-200",
        success: "bg-green-50 text-green-800 border-green-200",
        warning: "bg-orange-50 text-orange-800 border-orange-200",
        error: "bg-red-50 text-red-800 border-red-200"
    };

    const icons = {
        info: Info,
        success: CheckCircle,
        warning: AlertCircle,
        error: XCircle
    };

    const Icon = icons[variant];

    return (
        <div className={`flex items-start p-4 mb-4 rounded-xl border ${variants[variant]} ${className}`}>
            <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0 opacity-80" />
            <div>
                {title && <h3 className="font-bold mb-1">{title}</h3>}
                <div className="text-sm opacity-90 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Alert;
