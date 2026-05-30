import { toast } from 'react-toastify';
import { useProctoringDuties, useConfirmDuty } from '../../hooks/queries/useProctoring';

export default function Proctoring() {
    const { data: proctoringDuties = [] } = useProctoringDuties();
    const confirmDuty = useConfirmDuty();

    const handleConfirm = (id) => {
        confirmDuty.mutate(id, {
            onSuccess: () => toast.success('Görev onaylandı.'),
            onError: () => toast.error('Görev onaylanamadı.')
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <ShieldCheck size={24} />
                        </div>
                        Gözetmenlik Görevlerim
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Atanmış sınav gözetmenliklerini buradan takip edip onaylayabilirsiniz.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="relative z-10 flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Sınav ara..."
                            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64"
                        />
                    </div>
                    <button className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>

                {/* Decorative Background */}
                <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-4">
                {proctoringDuties.length === 0 && (
                    <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                        <ShieldCheck size={32} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">Atanmış gözetmenlik göreviniz bulunmamaktadır.</p>
                    </div>
                )}
                {proctoringDuties.map((duty) => (
                    <motion.div
                        key={duty.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                            {/* Exam Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${duty.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {duty.status === 'confirmed' ? 'Onaylandı' : 'Onay Bekliyor'}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">#{duty.id}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    {duty.examName}
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-gray-400" />
                                        {new Date(duty.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-gray-400" />
                                        {duty.time}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="text-gray-400" />
                                        {duty.room}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User size={14} className="text-gray-400" />
                                        {duty.instructor}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {duty.status === 'pending' ? (
                                    <>
                                        <button onClick={() => handleConfirm(duty.id)} disabled={confirmDuty.isPending} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95">
                                            Görevi Onayla
                                        </button>
                                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all">
                                            Mazeret Bildir
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                        <CheckCircle size={18} />
                                        <span className="text-sm font-bold">Onayladınız</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Filter, MapPin, Search, ShieldCheck, User } from 'lucide-react';
