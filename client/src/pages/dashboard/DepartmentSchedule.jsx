import { useState, useEffect } from 'react';
import { Download, Printer } from 'lucide-react';

// Components
import axiosInstance from '../../api/axiosInstance';

export default function DepartmentSchedule() {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
    const timeSlots = Array.from({ length: 9 }, (_, i) => `${i + 9}:00`); // 09:00 - 17:00
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await axiosInstance.get('/schedule');
                const data = res.data;
                setScheduleData(data);
            } catch (err) {
                console.error("Program çekilemedi", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const getCourseAtSlot = (day, time) => {
        return scheduleData.find(s => s.day === day && s.start.startsWith(time.split(':')[0]));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="text-blue-600" /> Bölüm Ders Programı
                    </h1>
                    <p className="text-slate-500 text-sm">Yazılım Mühendisliği - 2025-2026 Bahar</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={Printer}>Yazdır</Button>
                    <Button variant="primary" size="sm" icon={Download}>PDF İndir</Button>
                </div>
            </div>

            <Card className="overflow-x-auto min-w-[800px] p-6 border-slate-200 shadow-sm relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-4">
                    {/* Header Row */}
                    <div className="font-bold text-slate-400 text-sm text-center py-2">Saat</div>
                    {days.map(day => (
                        <div key={day} className="font-bold text-slate-800 text-center py-2 bg-slate-50 rounded-lg">
                            {day}
                        </div>
                    ))}

                    {/* Time Slots */}
                    {timeSlots.map(time => (
                        <React.Fragment key={time}>
                            <div className="text-slate-500 text-sm font-medium text-center py-4 border-t border-slate-100">
                                {time}
                            </div>
                            {days.map(day => {
                                const course = getCourseAtSlot(day, time);
                                return (
                                    <div key={`${day}-${time}`} className="border-t border-slate-100 py-2 relative min-h-[100px]">
                                        {course && (
                                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg h-full hover:shadow-md transition-shadow cursor-pointer">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-blue-600 font-bold text-xs">{course.start} - {course.end}</span>
                                                    <Badge variant="info" className="text-[10px] px-1.5 py-0 h-5">{course.type || 'Ders'}</Badge>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{course.course}</h4>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                    {course.room}
                                                </p>
                                                <p className="text-[10px] text-slate-400 line-clamp-1">{course.instructor}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </Card>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Users size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">Grup Bilgilendirmesi</h4>
                    <p className="text-blue-600 text-xs mt-1">
                        Ders programında yer alan Grup A ve Grup B ayrımları, öğrenci numaranızın son hanesine göre belirlenmektedir.
                        Son hanesi tek olanlar A Grubu, çift olanlar B Grubu derslerini takip etmelidir.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
