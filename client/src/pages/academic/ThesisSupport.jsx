import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { thesisAssistance } from '../../data/mockData';

export default function ThesisSupport() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredStudents = thesisAssistance.filter(student => {
        const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || student.status.toLowerCase().replace(' ', '') === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Draft Review': return 'warning';
            case 'Proposal': return 'info';
            case 'Final': return 'success';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tez ve Proje Asistanlığı"
                description="Danışmanlığını yürüttüğünüz öğrencilerin tez ve proje süreçlerinin takibi."
                icon={GraduationCap}
                action={
                    <Button variant="outline" size="sm">
                        <FileText size={16} className="mr-2" />
                        Rapor Oluştur
                    </Button>
                }
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Users size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Toplam Öğrenci</p>
                            <h3 className="text-2xl font-bold">{thesisAssistance.length}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-indigo-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">İnceleme Bekleyen</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {thesisAssistance.filter(s => s.status === 'Draft Review').length}
                            </h3>
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-indigo-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Bu Dönem Tamamlanan</p>
                            <h3 className="text-2xl font-bold text-gray-800">0</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Öğrenci veya proje ara..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['all', 'draftreview', 'proposal', 'final'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === status
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status === 'all' ? 'Tümü' :
                                status === 'draftreview' ? 'İnceleme Bekleyen' :
                                    status === 'proposal' ? 'Öneri Aşamasında' : 'Tamamlanan'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Student List */}
            <div className="grid gap-4">
                {filteredStudents.map((student, index) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="group hover:shadow-md transition-all duration-300 border-gray-100">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Left: Student Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                                {student.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{student.projectTitle}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <User size={14} />
                                                    {student.studentName}
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                        Danışman: {student.advisor}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={getStatusColor(student.status)} className="capitalize">
                                            {student.status}
                                        </Badge>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-medium text-gray-600">İlerleme Durumu</span>
                                            <span className="font-bold text-indigo-600">%{student.progress}</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                                style={{ width: `${student.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Tasks & Actions */}
                                <div className="md:w-1/3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Son Aktiviteler</h4>
                                        <div className="space-y-2">
                                            {student.tasks.slice(0, 2).map(task => (
                                                <div key={task.id} className="flex items-center gap-2 text-sm">
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${task.completed ? 'bg-green-50 border-green-200 text-green-600' : 'border-gray-300'
                                                        }`}>
                                                        {task.completed && <CheckCircle size={10} />}
                                                    </div>
                                                    <span className={task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                            ))}
                                            {student.tasks.length > 2 && (
                                                <p className="text-xs text-gray-400 pl-6">+{student.tasks.length - 2} diğer görev</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                                        <Button variant="ghost" size="sm" className="flex-1 text-gray-600">
                                            <MessageSquare size={16} className="mr-2" />
                                            Yorum Yap
                                        </Button>
                                        <Button size="sm" className="flex-1">
                                            Detaylar
                                            <ChevronRight size={16} className="ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
