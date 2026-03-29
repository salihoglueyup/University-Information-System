import { Plus, PenTool, FileText, Users, Calendar, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuickActions({ title }) {
    const actions = [
        { label: 'Duyuru Ekle', icon: Plus, color: 'bg-blue-100 text-blue-600', path: '/announcements/new' },
        { label: 'Not Girişi', icon: PenTool, color: 'bg-green-100 text-green-600', path: '/grading' },
        { label: 'Ders Programı', icon: Calendar, color: 'bg-purple-100 text-purple-600', path: '/schedule' },
        { label: 'E-Posta Gönder', icon: Mail, color: 'bg-orange-100 text-orange-600', path: '/email/compose' },
    ];

    if (['ASST_PROF', 'ASSOC_PROF', 'PROFESSOR'].includes(title)) {
        actions.push({ label: 'Danışmanlık', icon: Users, color: 'bg-indigo-100 text-indigo-600', path: '/advising' });
    }

    if (title === 'DEAN') {
        actions.push({ label: 'Bölüm Raporu', icon: FileText, color: 'bg-rose-100 text-rose-600', path: '/reports' });
    }

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3 ml-1">Hızlı İşlemler</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {actions.map((action, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                    >
                        <div className={`p-2.5 rounded-lg mb-2 ${action.color} group-hover:scale-110 transition-transform`}>
                            <action.icon size={20} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">{action.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
