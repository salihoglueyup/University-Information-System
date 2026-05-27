import { BookOpen, Calendar, GraduationCap, FileText } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../../../components/ui';

export default function StatsWidget({ user = {} }) {
    const stats = [
        { label: 'Genel Ortalama', value: user.gpa || "3.54", icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Tamamlanan Kredi', value: `${user.completedCredits || 0}/${user.totalCreditsRequired || 240}`, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Aktif Dönem', value: `${user.semester || 1}. Yarıyıl`, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { label: 'Bölüm', value: user.department || 'Yazılım', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    ];

    return (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" delay={0.2}>
            {stats.map((stat, idx) => (
                <StaggerItem
                    key={idx}
                    className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-lg transition-all hover:-translate-y-1`}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-2 tracking-tight">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                    </div>
                </StaggerItem>
            ))}
        </StaggerContainer>
    );
}
