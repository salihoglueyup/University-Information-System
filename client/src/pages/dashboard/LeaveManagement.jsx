import { useState } from 'react';
import { leaveRequests } from '../../data/mockData';

export default function LeaveManagement() {
    const [requests] = useState(leaveRequests);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Onaylandı': return 'text-green-600 bg-green-50';
            case 'Bekliyor': return 'text-orange-600 bg-orange-50';
            case 'Reddedildi': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                            <FileText size={24} />
                        </div>
                        İzin ve Görevlendirme
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Yıllık izin, rapor ve akademik görevlendirme talepleri.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all">
                        <Plus size={18} />
                        Yeni Talep
                    </button>
                </div>
            </div>

            {/* Leave Balance Cards (Mock) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Kalan Yıllık İzin</p>
                        <h4 className="text-2xl font-bold text-gray-800">14 Gün</h4>
                        <span className="text-xs font-bold text-gray-400">Bu yıl: 20 Gün</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-purple-100 rounded-2xl text-purple-600">
                        <Plane size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Görevlendirme</p>
                        <h4 className="text-2xl font-bold text-gray-800">2 Adet</h4>
                        <span className="text-xs font-bold text-green-600">Aktif</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-orange-100 rounded-2xl text-orange-600">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Bekleyen Onay</p>
                        <h4 className="text-2xl font-bold text-gray-800">1</h4>
                        <span className="text-xs font-bold text-orange-500">İşlemde</span>
                    </div>
                </div>
            </div>

            {/* Request List */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Talep Geçmişi</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Talep Türü</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Açıklama</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Tarih Aralığı</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Süre</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {requests.map((req) => (
                                    <motion.tr
                                        key={req.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {req.type}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {req.reason}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                                            {req.startDate} - {req.endDate}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-gray-800">{req.days}</span> <span className="text-xs text-gray-400">Gün</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 w-fit mx-auto ${getStatusColor(req.status)}`}>
                                                {req.status === 'Onaylandı' && <CheckCircle size={14} />}
                                                {req.status === 'Bekliyor' && <Clock size={14} />}
                                                {req.status === 'Reddedildi' && <AlertCircle size={14} />}
                                                {req.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Calendar, CheckCircle, Clock, FileText, Plane, Plus } from 'lucide-react';
