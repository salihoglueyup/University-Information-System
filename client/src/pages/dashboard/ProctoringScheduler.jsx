import { useState } from 'react';
import { useExamSessions } from '../../hooks/queries/useExamSessions';

export default function ProctoringScheduler() {
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { data: examSchedule = [] } = useExamSessions();

    const filteredExams = examSchedule.filter(exam => {
        const matchesStatus = filterStatus === 'All' || exam.status === filterStatus;
        const matchesSearch = (exam.courseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exam.courseCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exam.proctors || []).some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Planlandı': return 'primary';
            case 'Tamamlandı': return 'success';
            case 'Taslak': return 'warning';
            case 'İptal': return 'danger';
            default: return 'neutral';
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sınav ve Gözetmenlik Programı"
                description="Sınav takvimini görüntüleyin ve gözetmen görevlendirmelerini yönetin."
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Sınav Programı', href: '/dashboard/proctoring-scheduler' },
                ]}
            >
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download size={18} className="mr-2" />
                        Excel İndir
                    </Button>
                    <Button variant="primary">
                        <Calendar size={18} className="mr-2" />
                        Yeni Sınav Planla
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Filtreler">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Sınav Durumu</label>
                                <div className="space-y-2">
                                    {['All', 'Planlandı', 'Taslak', 'Tamamlandı'].map(status => (
                                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                checked={filterStatus === status}
                                                onChange={() => setFilterStatus(status)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{status === 'All' ? 'Tümü' : status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Göreviniz">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={18} className="text-blue-600" />
                                <span className="font-bold text-blue-900">Gözetmenlik</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-700">3 Sınav</div>
                            <div className="text-xs text-blue-600 mt-1">Bu hafta görevlisiniz</div>
                        </div>
                        <Button className="w-full" variant="outline">
                            Görev Takvimim
                        </Button>
                    </Card>
                </div>

                {/* Exam List */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Ders, kod veya gözetmen ara..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredExams.length === 0 && (
                                <div className="text-center py-12 text-gray-400 text-sm">Planlanmış sınav bulunamadı.</div>
                            )}
                            {filteredExams.map(exam => (
                                <div key={exam.id} className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all bg-white group">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center border border-indigo-100 shrink-0">
                                                <span className="text-xs font-bold uppercase">{exam.date.split('-')[1]}</span>
                                                <span className="text-2xl font-bold">{exam.date.split('-')[2]}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-lg text-gray-900">{exam.courseName}</h3>
                                                    <Badge variant="neutral">{exam.courseCode}</Badge>
                                                    <Badge variant="outline">{exam.examType}</Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-gray-400" />
                                                        <span>{exam.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} className="text-gray-400" />
                                                        <span>{exam.classrooms.join(', ')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} className="text-gray-400" />
                                                        <span>{exam.studentsCount} Öğrenci</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User size={16} className="text-gray-400" />
                                                        <span className="truncate max-w-[200px]" title={exam.instructor}>{exam.instructor}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-start gap-2">
                                                    <span className="text-xs font-bold text-gray-500 mt-0.5">Gözetmenler:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {exam.proctors.map((proctor, idx) => (
                                                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                                                                {proctor}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between min-w-[120px]">
                                            <Badge variant={getStatusVariant(exam.status)}>
                                                {exam.status}
                                            </Badge>

                                            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="sm" variant="outline">Düzenle</Button>
                                                <Button size="sm" variant="ghost">Detay</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
import { Calendar, Clock, Download, MapPin, Search, User, Users } from 'lucide-react';
import { Badge, Button, Card, PageHeader } from '../../components/ui';
