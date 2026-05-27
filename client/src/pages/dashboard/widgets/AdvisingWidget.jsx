
import { motion } from 'framer-motion';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdvisingWidget() {
    const advisees = [
        { id: 1, name: 'Ahmet Yılmaz', year: 4, status: 'Onay Bekliyor', issue: 'Ders Çakışması' },
        { id: 2, name: 'Ayşe Demir', year: 2, status: 'Riskli', issue: 'Düşük GNO' },
        { id: 3, name: 'Mehmet Kaya', year: 3, status: 'Tamam', issue: null },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                        <Users size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Danışmanlık</h2>
                        <p className="text-xs text-gray-400 font-medium">Öğrenci Takibi</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                    35 Öğrenci
                </button>
            </div>

            <div className="space-y-3">
                {advisees.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-indigo-50/30 border border-transparent hover:border-indigo-100 transition-colors group cursor-pointer">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                                {student.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">{student.name}</h4>
                                <p className="text-[10px] text-gray-500">{student.year}. Sınıf</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {student.issue ? (
                                <span className="flex items-center justify-end gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                    <AlertCircle size={10} /> {student.issue}
                                </span>
                            ) : (
                                <span className="flex items-center justify-end gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                                    <CheckCircle size={10} /> Tamam
                                </span>
                            )}
                            <button className="mt-1 text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600 transition-all">
                                Mesaj Gönder
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 text-xs font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                Tüm Listeyi Gör →
            </button>
        </motion.div>
    );
}
