import { useState } from 'react';
import { deptTasks } from '../../data/mockData';

export default function DepartmentTasks() {
    const [filter, setFilter] = useState('all'); // all, todo, in-progress, done

    const filteredTasks = deptTasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 h-[calc(100vh-100px)] flex flex-col"
        >
            {/* Header */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                            <ClipboardList size={24} />
                        </div>
                        Bölüm Görevleri
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Bölüm başkanlığı ve idari birimlerden gelen görev takibi.
                    </p>
                </div>
                <div className="relative z-10 flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all hover:scale-105 active:scale-95">
                        <Plus size={18} />
                        Yeni Görev
                    </button>
                </div>
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-purple-50/50 to-transparent pointer-events-none" />
            </div>

            {/* Filters */}
            <div className="shrink-0 flex flex-wrap items-center gap-2">
                {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'todo', label: 'Yapılacaklar' },
                    { id: 'in-progress', label: 'Devam Edenler' },
                    { id: 'done', label: 'Tamamlananlar' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === tab.id
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                            : 'bg-white text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            layout
                            className="bg-white p-4 rounded-2xl border border-gray-200 hover:shadow-md transition-all group group-hover:border-purple-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <Checkbox
                                        checked={task.status === 'done'}
                                        onCheckedChange={() => { }}
                                        className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <h3 className={`font-bold text-gray-800 text-lg transition-all ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                                            {task.task}
                                        </h3>
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getPriorityColor(task.priority)} flex items-center gap-1.5`}>
                                            <AlertTriangle size={12} />
                                            {task.priority === 'high' ? 'Yüksek Öncelik' : (task.priority === 'medium' ? 'Orta Öncelik' : 'Düşük Öncelik')}
                                        </span>

                                        <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5 font-medium">
                                            <Calendar size={12} className="text-gray-400" />
                                            Son Gün: {new Date(task.deadline).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                                        </span>

                                        <span className="text-xs text-gray-400 flex items-center gap-1.5 ml-auto font-medium">
                                            Tarafından: <span className="text-gray-600">{task.assignedBy}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <ClipboardList size={32} className="opacity-20" />
                        </div>
                        <p className="text-sm font-medium">Görüntülenecek görev bulunamadı.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Calendar, ClipboardList, MoreHorizontal, Plus } from 'lucide-react';
import { Checkbox } from '../../components/ui';
