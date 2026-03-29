import { Ghost } from 'lucide-react';

const EmptyState = ({
    icon: _Icon = Ghost,
    title = "Veri Bulunamadı",
    description = "Aradığınız kriterlere uygun kayıt bulunmamaktadır.",
    action,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 ${className}`}>
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <_Icon size={48} className="text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm mb-8 mx-auto leading-relaxed">
                {description}
            </p>
            {action && (
                <div className="scale-100 hover:scale-105 transition-transform">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
