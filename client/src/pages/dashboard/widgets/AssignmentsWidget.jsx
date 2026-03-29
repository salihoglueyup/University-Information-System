import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

export default function AssignmentsWidget() {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                const userId = storedUser.id || storedUser._id;

                const res = await axiosInstance.get('/assignments');
                const responseJson = res.data;
                const dataArray = responseJson.data || responseJson;

                const userAssignments = dataArray.filter(a => a.userId === userId || a.userId === 'all' || !a.userId || a.userId === userId?.toString());
                setAssignments(userAssignments.length > 0 ? userAssignments : dataArray);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    // Filter pending assignments
    const pendingAssignments = assignments.filter(a => a.status !== 'Tamamlandı').slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle className="text-amber-500" size={20} /> Yaklaşan Ödevler
                </h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/assignments')} className="text-blue-600">
                    Tümünü Gör <ChevronRight size={16} />
                </Button>
            </div>

            <StaggerContainer className="space-y-4 flex-1" delay={0.6}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full py-8">
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : pendingAssignments.length > 0 ? (
                    pendingAssignments.map((item, idx) => (
                        <StaggerItem key={item._id || item.id || idx} className="group p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={item.status === 'Bekliyor' ? 'warning' : 'info'} className="text-[10px] px-2 py-0.5">
                                    {item.status}
                                </Badge>
                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <Clock size={12} className={item.daysLeft <= 2 ? "text-red-500" : "text-slate-400"} />
                                    {item.dueDate}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {item.title}
                            </h4>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1">
                                    <Calendar size={10} /> {item.course}
                                </p>
                                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 w-2/3 rounded-full"></div>
                                </div>
                            </div>
                        </StaggerItem>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 min-h-[200px]">
                        <div className="p-4 bg-emerald-50 rounded-full">
                            <CheckCircle2 size={32} className="text-emerald-400" />
                        </div>
                        <p className="font-medium text-sm">Harika! Bekleyen ödeviniz yok.</p>
                        <Button size="sm" variant="outline">Tekrar Kontrol Et</Button>
                    </div>
                )}
            </StaggerContainer>
        </motion.div>
    );
}
