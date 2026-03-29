import { Users, BookOpen, Server, AlertCircle } from 'lucide-react'; // Activity added back, it is used
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: _Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <_Icon size={24} className="text-gray-700" />
            </div>
            {trend && (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +{trend}%
                </span>
            )}
        </div>
        <div>
            <span className="block text-gray-500 text-sm font-medium mb-1">{title}</span>
            <span className="block text-3xl font-bold text-gray-800">{value}</span>
        </div>
    </div>
);

export default function AdminDashboard() {
    return (
        <div className="space-y-6 pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Yönetim Paneli</h1>
                    <p className="text-gray-500 mt-1">Sistem durumu ve genel istatistikler</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                        <Activity size={12} /> Sistem Online
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                        v2.4.0
                    </span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Aktif Kullanıcı" value="24,592" icon={Users} color="bg-blue-100" trend={12} />
                <StatCard title="Toplam Ders" value="1,840" icon={BookOpen} color="bg-purple-100" />
                <StatCard title="Sunucu Yükü" value="%42" icon={Server} color="bg-amber-100" />
                <StatCard title="Sistem Uyarıları" value="3" icon={AlertCircle} color="bg-red-100" />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center py-16">
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Yönetim Modülleri</h3>
                    <p className="text-gray-500 mb-6">Sol menüyü kullanarak Kullanıcı Yönetimi, Ders Atamaları ve Raporlama modüllerine erişebilirsiniz.</p>
                </div>
            </div>
        </div>
    );
}
