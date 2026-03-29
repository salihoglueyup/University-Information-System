import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

export default function ScheduleWidget() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await axiosInstance.get('/schedule');
                setSchedule(res.data);
            } catch (error) {
                console.error("Error fetching schedule:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    // Sort schedule by start time
    const sortedSchedule = [...schedule].sort((a, b) => a.start.localeCompare(b.start));

    // Get today's schedule (mocking for demonstration, picking 'Pazartesi' or showing all as a summary)
    // In a real app, we would filter by new Date().getDay()
    const todaySchedule = sortedSchedule.filter(s => s.day === 'Pazartesi').slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="text-blue-600" size={20} /> Günün Programı
                </h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/schedule')} className="text-blue-600">
                    Tümünü Gör <ChevronRight size={16} />
                </Button>
            </div>

            <StaggerContainer className="space-y-4 flex-1" delay={0.5}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full py-8">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : todaySchedule.length > 0 ? (
                    todaySchedule.map((item, idx) => (
                        <StaggerItem key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border-l-4 border-blue-500 bg-white shadow-sm ring-1 ring-slate-100/50">
                            <div className="flex flex-col items-center justify-center min-w-[60px] text-slate-600 bg-slate-50 rounded-lg p-2">
                                <span className="font-bold text-lg leading-none text-blue-900">{item.start}</span>
                                <span className="text-xs text-slate-400 mt-1">{item.end}</span>
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                                <h4 className="font-bold text-slate-800 truncate text-sm md:text-base">{item.course}</h4>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-100"><MapPin size={12} className="text-red-500" /> {item.room}</span>
                                    <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium">{item.type}</span>
                                </div>
                            </div>
                        </StaggerItem>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 min-h-[200px]">
                        <div className="p-4 bg-slate-50 rounded-full">
                            <Coffee size={32} className="text-slate-300" />
                        </div>
                        <p className="font-medium text-sm">Bugün dersiniz bulunmuyor.</p>
                        <p className="text-xs text-slate-400">İyi dinlenmeler!</p>
                    </div>
                )}
            </StaggerContainer>
        </motion.div>
    );
}
