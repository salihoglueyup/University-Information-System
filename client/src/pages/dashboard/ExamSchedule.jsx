
// Components

// Mock Data
import { examSchedule } from '../../data/mockData';

export default function ExamSchedule() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDays className="text-blue-600" /> Sınav Programım
                    </h1>
                    <p className="text-slate-500 text-sm">2025-2026 Bahar Yarıyılı Ara Sınav (Vize) Takvimi</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Takvime Ekle</Button>
                    <Button variant="primary" size="sm">Yazdır</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examSchedule.map((exam, idx) => (
                    <Card key={idx} className="relative overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
                        {/* Decorative Top Border */}
                        <div className={`h-1.5 w-full bg-gradient-to-r ${exam.type === 'Online Sınav' ? 'from-purple-500 to-indigo-500' : 'from-blue-500 to-cyan-500'}`}></div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant={exam.type === 'Online Sınav' ? 'secondary' : 'primary'}>{exam.type}</Badge>
                                <span className="font-mono font-bold text-slate-300 text-sm">{exam.code}</span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-6 group-hover:text-blue-700 transition-colors h-14">
                                {exam.name}
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                        <CalendarDays size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Tarih</p>
                                        <p className="text-sm font-semibold">{exam.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Saat</p>
                                        <p className="text-sm font-semibold">{exam.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Sınav Yeri / Sıra</p>
                                        <p className="text-sm font-semibold">{exam.room} <span className="text-slate-300">|</span> {exam.seat}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-yellow-800 font-medium text-sm">
                    ⚠️ Sınav saatinden en az <b>15 dakika önce</b> sınav yerinde hazır bulunmanız gerekmektedir.
                    Öğrenci kimliği yanınızda olmayan öğrenciler sınava alınmayacaktır.
                </p>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Badge, Button, Card } from '../../components/ui';
