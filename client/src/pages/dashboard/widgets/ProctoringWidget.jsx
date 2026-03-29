import { proctoringDuties } from '../../../data/mockData';

export default function ProctoringWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Sınav Gözetmenlikleri</h2>
                        <p className="text-xs text-gray-400 font-medium">Yaklaşan Görevler</p>
                    </div>
                </div>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
                    {proctoringDuties.length} Sınav
                </span>
            </div>

            <div className="space-y-4">
                {proctoringDuties.map((duty) => (
                    <div
                        key={duty.id}
                        className="group relative border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-indigo-100 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm group-hover:text-indigo-700 transition-colors">
                                    {duty.examName}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar size={12} className="text-gray-400" />
                                        {new Date(duty.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                                    </div>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock size={12} className="text-gray-400" />
                                        {duty.time}
                                    </div>
                                </div>
                            </div>

                            {duty.status === 'confirmed' ? (
                                <span className="p-1.5 bg-green-50 text-green-600 rounded-lg flex items-center gap-1 text-[10px] font-bold border border-green-100">
                                    <CheckCircle size={12} />
                                    Onaylı
                                </span>
                            ) : (
                                <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg flex items-center gap-1 text-[10px] font-bold border border-amber-100 animate-pulse">
                                    <Clock size={12} />
                                    Bekliyor
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                                    <MapPin size={12} className="text-gray-400" />
                                    {duty.room}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <User size={12} className="text-gray-400" />
                                    {duty.instructor}
                                </div>
                            </div>

                            {duty.status === 'pending' && (
                                <button className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm shadow-indigo-200">
                                    Onayla
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 text-xs font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                Tüm Programı Görüntüle →
            </button>
        </motion.div>
    );
}
