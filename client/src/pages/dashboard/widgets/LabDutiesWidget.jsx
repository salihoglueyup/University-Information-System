import { motion } from 'framer-motion';
import { Monitor, Users, Clock, ClipboardList, ChevronRight } from 'lucide-react';
import { useLabs } from '../../../hooks/queries/useLabs';

export default function LabDutiesWidget() {
    const { data: labSections = [] } = useLabs();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                        <Monitor size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Laboratuvarlarım</h2>
                        <p className="text-xs text-gray-400 font-medium">Ders Sorumlulukları</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {labSections.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6">Sorumlu olduğunuz laboratuvar bulunmamaktadır.</p>
                )}
                {labSections.map((lab) => (
                    <div
                        key={lab.id}
                        className="bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-100/50 rounded-2xl p-4 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                    >
                        {/* Decorative Background Icon */}
                        <div className="absolute -right-4 -top-4 text-emerald-50 opacity-50 transform rotate-12 group-hover:scale-110 transition-transform">
                            <Monitor size={80} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                                    {lab.code}
                                </span>
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                    <Users size={12} />
                                    {lab.studentCount} Öğrenci
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-800 text-sm mb-1 pr-6 leading-tight">
                                {lab.courseName}
                            </h3>
                            <p className="text-xs text-gray-500 mb-3 bg-white/50 inline-block px-1.5 py-0.5 rounded">
                                Grup: <span className="font-semibold text-emerald-700">{lab.section}</span> • {lab.room}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-emerald-100/30">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <Clock size={14} className="text-emerald-500" />
                                    <span className="font-medium bg-white/50 px-1 rounded">{lab.time}</span>
                                </div>

                                <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm shadow-emerald-200 transition-all hover:scale-105 active:scale-95">
                                    <ClipboardList size={14} />
                                    Yoklama
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                Tüm Labları Gör <ChevronRight size={14} />
            </button>
        </motion.div>
    );
}
