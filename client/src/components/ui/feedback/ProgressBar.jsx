
const ProgressBar = ({ value, max = 100, color = 'blue', colorClass, showLabel = false, className = '', ...props }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colors = {
        blue: "bg-blue-600",
        green: "bg-emerald-500",
        red: "bg-red-500",
        yellow: "bg-amber-400",
        purple: "bg-purple-500"
    };

    return (
        <div className={`w-full ${className}`} {...props}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>İlerleme</span>
                    <span>%{Math.round(percentage)}</span>
                </div>
            )}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass || colors[color] || colors.blue}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
