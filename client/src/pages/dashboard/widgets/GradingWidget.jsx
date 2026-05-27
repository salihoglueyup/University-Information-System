import { gradingQueue } from '../../../data/mockData';
import { motion } from 'framer-motion';
import { PenTool, FileText, ChevronRight } from 'lucide-react';

export default function GradingWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
                        <PenTool size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Not Girişi</h2>
                        <p className="text-xs text-gray-400 font-medium">Bekleyen Değerlendirmeler</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg">
                        {gradingQueue.reduce((acc, curr) => acc + curr.pendingCount, 0)} Bekleyen
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                {gradingQueue.map((item) => (
                    <div
                        key={item.id}
                        className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-orange-600 group-hover:border-orange-200 transition-colors">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 group-hover:text-orange-700 transition-colors">
                                    {item.courseName}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                    <span className="font-medium bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                        {item.type}
                                    </span>
                                    <span>•</span>
                                    <span className="text-orange-600 font-medium">Son Gün: {new Date(item.dueDate).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <span className="block text-lg font-bold text-gray-800 group-hover:text-orange-700 transition-colors">
                                    {item.pendingCount}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Öğrenci</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group">
                <span>Tüm Değerlendirmeleri Gör</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
}
