
const Timeline = ({ items = [], className = '' }) => {
    return (
        <div className={`relative space-y-8 pl-4 ${className}`}>
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 -z-10"></div>

            {items.map((item, index) => (
                <div key={index} className="relative flex gap-6 group">
                    {/* Dot */}
                    <div className={`
            w-3 h-3 rounded-full mt-1.5 ring-4 ring-white shadow-sm flex-shrink-0
            ${item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'current' ? 'bg-blue-600 ring-blue-50' :
                                'bg-slate-300'}
          `}></div>

                    {/* Content */}
                    <div className="flex-1 -mt-1 pb-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                            <h4 className={`text-sm font-bold ${item.status === 'current' ? 'text-blue-700' : 'text-slate-800'}`}>
                                {item.title}
                            </h4>
                            <span className="text-xs text-slate-400 font-mono">
                                {item.date}
                            </span>
                        </div>
                        {item.description && (
                            <p className="text-sm text-slate-500 leading-relaxed mb-2">
                                {item.description}
                            </p>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {item.tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
