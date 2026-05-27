import { useState, useEffect } from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function AcademicCalendar() {
    const [calendarData, setCalendarData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                const res = await axiosInstance.get('/academic-calendar');
                setCalendarData(res.data);
            } catch (error) {
                console.error("Error fetching academic calendar:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCalendarData();
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <CalendarIcon className="text-indigo-600" /> Akademik Takvim
                    </h1>
                    <p className="text-slate-500 text-sm">2025-2026 Eğitim Öğretim Yılı Önemli Tarihler</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={ChevronLeft}>Önceki</Button>
                    <Button variant="outline" size="sm">Bugün</Button>
                    <Button variant="outline" size="sm" icon={ChevronRight}>Sonraki</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        calendarData.map((monthData, idx) => (
                            <Card key={idx} className="overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold text-slate-700 flex justify-between items-center">
                                    <span>{monthData.month}</span>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {monthData.events.map((event, eIdx) => (
                                        <div key={eIdx} className="p-4 hover:bg-slate-50 transition-colors flex gap-4">
                                            <div className="flex-shrink-0 w-16 text-center">
                                                <span className="block text-2xl font-bold text-indigo-600">{event.day}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{event.title}</h4>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant={event.type === 'Exam' ? 'danger' : 'secondary'}>{event.type}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )))}
                </div>

                <div className="space-y-6">
                    <Card className="p-6 bg-indigo-900 text-white">
                        <h3 className="font-bold text-lg mb-4">Yaklaşan Etkinlikler</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 opacity-90">
                                <Clock size={18} className="mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-bold block">Ders Ekle-Sil Haftası</span>
                                    <span className="text-sm">20 Şubat Cuma, 17:00'a kadar</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 opacity-90">
                                <CalendarIcon size={18} className="mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-bold block">Resmi Tatil</span>
                                    <span className="text-sm">23 Nisan Ulusal Egemenlik ve Çocuk Bayramı</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Takvim Açıklamaları</h3>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Akademik: Ders başlangıcı, bitişi vb.</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Sınavlar: Ara sınav, final, bütünleme.</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Tatil: Resmi ve dini bayramlar.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card } from '../../components/ui';
