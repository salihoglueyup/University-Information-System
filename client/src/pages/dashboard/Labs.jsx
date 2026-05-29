import { labSections } from '../../data/mockData';

export default function Labs() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                <Monitor size={24} />
                            </div>
                            Laboratuvarlarım
                        </h1>
                        <p className="text-gray-500 mt-1 ml-12">
                            Sorumlu olduğunuz laboratuvar dersleri ve yoklama işlemleri.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors">
                            <BarChart2 size={18} />
                            Dönem Raporu
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95">
                            <ClipboardList size={18} />
                            Hızlı Yoklama
                        </button>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none" />
            </div>

            {/* Labs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {labSections.map((lab) => (
                    <motion.div
                        key={lab.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                    >
                        {/* Lab Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50/30 to-transparent">
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-3 py-1 bg-white border border-emerald-100 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                                    {lab.code}
                                </span>
                                <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{lab.courseName}</h2>
                            <p className="text-sm text-gray-500 font-medium">Grup: {lab.section}</p>
                        </div>

                        {/* Lab Details */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        <Clock size={12} /> Saat
                                    </div>
                                    <p className="font-semibold text-gray-700 text-sm">{lab.time}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        <MapPin size={12} /> Yer
                                    </div>
                                    <p className="font-semibold text-gray-700 text-sm">{lab.room}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        <Users size={12} /> Mevcut
                                    </div>
                                    <p className="font-semibold text-gray-700 text-sm">{lab.studentCount} Öğrenci</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        <Calendar size={12} /> Sonraki
                                    </div>
                                    <p className="font-semibold text-emerald-600 text-sm">
                                        {new Date(lab.nextSession).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-white border-2 border-emerald-100 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center justify-center gap-2">
                                <ClipboardList size={18} />
                                Ders Detayına Git & Yoklama Al
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Add New Lab Card (Placeholder) */}
                <button className="border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-emerald-300 hover:bg-emerald-50/30 hover:text-emerald-600 transition-all min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                        <Monitor size={32} />
                    </div>
                    <span className="font-bold">Yeni Laboratuvar Ekle</span>
                </button>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { BarChart2, Calendar, ChevronRight, ClipboardList, Clock, MapPin, Monitor, Users } from 'lucide-react';
