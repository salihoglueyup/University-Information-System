
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function TeachingScheduleWidget() {
    // Mock schedule for instructor
    const schedule = [
        { day: 'Pazartesi', time: '09:00 - 12:00', course: 'Yazılım Mimarisi', room: 'D-201', type: 'Ders' },
        { day: 'Pazartesi', time: '13:00 - 15:00', course: 'Ofis Saati', room: 'D-205', type: 'Ofis' },
        { day: 'Çarşamba', time: '10:00 - 13:00', course: 'Web Programlama', room: 'Lab-3', type: 'Lab' },
        { day: 'Cuma', time: '14:00 - 16:00', course: 'Bölüm Toplantısı', room: 'Toplantı Salonu', type: 'Toplantı' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Haftalık Program</h2>
                        <p className="text-xs text-gray-400 font-medium">Ders ve Görevler</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {schedule.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-gray-500 font-bold text-xs shrink-0">
                            <span>{item.day.slice(0, 3)}</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.course}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <Clock size={10} /> {item.time}
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <MapPin size={10} /> {item.room}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">
                Tüm Programı Görüntüle
            </button>
        </motion.div>
    );
}
