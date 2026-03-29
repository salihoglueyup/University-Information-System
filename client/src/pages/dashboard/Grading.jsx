import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList
} from 'lucide-react';
import { instructorCoursesData, gradingQueue } from '../../data/mockData';

export default function Grading() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all'); // all, pending, completed

    // Merge course info into grading queue for display
    const gradingTasks = gradingQueue.map(task => {
        const course = instructorCoursesData.find(c => c.name === task.courseName);
        return { ...task, courseCode: course?.code || 'UNK', students: course?.studentsEnrolled || 0 };
    });

    const filteredTasks = filter === 'all'
        ? gradingTasks
        : filter === 'pending'
            ? gradingTasks.filter(t => t.pendingCount > 0)
            : gradingTasks.filter(t => t.pendingCount === 0);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Not Girişi ve Değerlendirme"
                description="Sınav, proje ve ödev notlarını yönetin."
                icon={ClipboardList}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Bekleyen Görevler</p>
                            <h3 className="text-2xl font-bold text-gray-900">{gradingTasks.reduce((acc, t) => acc + t.pendingCount, 0)} <span className="text-sm font-normal text-gray-500">Öğrenci</span></h3>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tamamlanan</p>
                            <h3 className="text-2xl font-bold text-gray-900">%85</h3>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <BarChart2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Dönem Ortalaması</p>
                            <h3 className="text-2xl font-bold text-gray-900">72.4</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Task List */}
            <Card title="Değerlendirme Kuyruğu"
                action={
                    <div className="flex gap-2">
                        <Button
                            size="xs"
                            variant={filter === 'all' ? 'primary' : 'ghost'}
                            onClick={() => setFilter('all')}
                        >
                            Tümü
                        </Button>
                        <Button
                            size="xs"
                            variant={filter === 'pending' ? 'primary' : 'ghost'}
                            onClick={() => setFilter('pending')}
                        >
                            Bekleyenler
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    {filteredTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all bg-white"
                        >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className={`w - 12 h - 12 rounded - xl flex items - center justify - center font - bold text - lg ${task.pendingCount > 0 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                                    } `}>
                                    {task.courseCode.split(' ')[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {task.courseName}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Badge variant="secondary" size="sm">{task.type}</Badge>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> Son Gün: {task.dueDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Durum</div>
                                    <div className={`font - bold ${task.pendingCount > 0 ? 'text-orange-600' : 'text-green-600'} `}>
                                        {task.pendingCount > 0 ? `${task.pendingCount} Bekliyor` : 'Tamamlandı'}
                                    </div>
                                </div>
                                <Button onClick={() => navigate(`/ dashboard / grading / ${task.id} `)}>
                                    Not Gir
                                    <ChevronRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
