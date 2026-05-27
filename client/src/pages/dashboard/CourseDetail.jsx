import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, BookOpen, Calendar, CheckCircle, Clock, Download, FileText, MapPin, MoreHorizontal, PenTool, Plus, Settings, Upload, Users, Video } from 'lucide-react';
import { useCourseDetail } from '../../hooks/queries/useCourseDetail';

export default function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const { data: course, isLoading: loading } = useCourseDetail(courseId);

    const tabs = [
        { id: 'overview', label: 'Genel Bakış', icon: BarChart2 },
        { id: 'syllabus', label: 'Ders İzlencesi', icon: FileText },
        { id: 'resources', label: 'Kaynaklar', icon: BookOpen },
        { id: 'assignments', label: 'Ödevler', icon: PenTool },
        { id: 'students', label: 'Öğrenci Listesi', icon: Users },
    ];

    if (loading) {
        return <div className="p-10 text-center">Yükleniyor...</div>;
    }

    if (!course) {
        return (
            <div className="text-center p-10">
                <h2 className="text-xl font-bold text-gray-800">Ders Bulunamadı</h2>
                <Button onClick={() => navigate('/dashboard/teaching-courses')} className="mt-4">
                    Geri Dön
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex flex-col gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit text-gray-500 pl-0 hover:bg-transparent hover:text-gray-800"
                    onClick={() => navigate('/dashboard/teaching-courses')}
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Derslere Dön
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
                            <Badge variant="primary">{course.code}</Badge>
                        </div>
                        <p className="text-gray-500 flex items-center gap-2">
                            <Clock size={16} />
                            {course.schedule && course.schedule[0] ? course.schedule[0].time : 'TBA'}
                            <span className="text-gray-300">|</span>
                            <MapPin size={16} />
                            {course.schedule && course.schedule[0] ? course.schedule[0].location : 'TBA'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline">
                            <Settings size={18} className="mr-2" />
                            Ayarlar
                        </Button>
                        <Button variant="primary">
                            <Plus size={18} className="mr-2" />
                            Yeni İçerik Ekle
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-1 overflow-x-auto pb-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } `}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && <OverviewTab course={course} />}
                    {activeTab === 'syllabus' && <SyllabusTab syllabus={course.syllabus} courseId={courseId} />}
                    {activeTab === 'resources' && <ResourcesTab resources={course.resources} courseId={courseId} />}
                    {activeTab === 'assignments' && <AssignmentsTab assignments={course.assignments} />}
                    {activeTab === 'students' && <StudentsTab students={course.students} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// Sub-components for Tabs

function OverviewTab({ course }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card title="Duyurular" action={<Button size="xs" variant="ghost">Tümü</Button>}>
                    <p className="text-gray-500 text-sm text-center py-4">Henüz duyuru bulunmamaktadır.</p>
                </Card>

                <Card title="Haftalık Program">
                    <div className="space-y-3">
                        {course.syllabus && course.syllabus.weeks ? course.syllabus.weeks.slice(0, 3).map((week, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
                                    {week.week}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{week.topic}</h4>
                                    <p className="text-xs text-gray-500">{week.outcomes}</p>
                                </div>
                                <Button size="icon" variant="ghost">
                                    <MoreHorizontal size={18} />
                                </Button>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm">Ders programı girilmemiş.</p>
                        )}
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <Card title="Ders İstatistikleri">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600">Kayıtlı Öğrenci</span>
                            <span className="font-bold text-gray-900 text-lg">{course.students ? course.students.length : 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600">Ortalama Devam</span>
                            <span className="font-bold text-green-600 text-lg">%85</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-600">Tamamlanan Kredi</span>
                            <span className="font-bold text-blue-600 text-lg">{course.credits}</span>
                        </div>
                    </div>
                </Card>

                <Card title="Hızlı İşlemler">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-20 flex-col gap-2">
                            <CheckCircle size={24} className="text-green-600" />
                            <span className="text-xs">Yoklama Başlat</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                            <PenTool size={24} className="text-blue-600" />
                            <span className="text-xs">Not Girişi</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                            <Upload size={24} className="text-purple-600" />
                            <span className="text-xs">Dosya Yükle</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2">
                            <Video size={24} className="text-red-600" />
                            <span className="text-xs">Online Ders</span>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function SyllabusTab({ syllabus, courseId }) {
    const navigate = useNavigate();

    if (!syllabus) return <div className="p-4 bg-yellow-50 text-yellow-800 rounded">Ders izlencesi bulunamadı.</div>;

    return (
        <Card className="p-6 relative">
            <div className="absolute top-6 right-6">
                <Button size="sm" onClick={() => navigate(`/dashboard/syllabus-editor/${courseId}`)}>
                    <PenTool size={16} className="mr-2" />
                    Düzenle
                </Button>
            </div>

            <div className="prose max-w-none">
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Ders Tanımı</h3>
                    <p className="text-gray-600 leading-relaxed">{syllabus.description || "Ders tanımı girilmemiş."}</p>
                </div>

                {syllabus.learningOutcomes && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Öğrenim Çıktıları</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {syllabus.learningOutcomes.map((lo, i) => (
                                <li key={i}>{lo}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-4">Haftalık Plan</h3>
                <div className="space-y-4 mb-8">
                    {syllabus.weeks && syllabus.weeks.map((week, idx) => (
                        <div key={idx} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0">
                            <div className="min-w-[60px] font-bold text-blue-600 pt-1">Hafta {week.week}</div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{week.topic}</h4>
                                <p className="text-sm text-gray-500 mt-1">{week.outcomes}</p>
                                <p className="text-xs text-gray-400 mt-1 italic">{week.materials}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4">Değerlendirme Sistemi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {syllabus.assessmentMethods && syllabus.assessmentMethods.map((grade, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">%{grade.weight}</div>
                            <div className="font-medium text-gray-700">{grade.type}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

function ResourcesTab({ resources, courseId }) {
    const navigate = useNavigate();

    // Fallback if resources is undefined
    const categories = resources && resources.categories ? resources.categories : [];

    return (
        <Card>
            <div className="mb-4 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Ders Materyalleri</h3>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/resource-hub/${courseId}`)}>
                        <BookOpen size={16} className="mr-2" />
                        Dosya Yöneticisi
                    </Button>
                    <Button size="sm">
                        <Upload size={16} className="mr-2" />
                        Hızlı Yükle
                    </Button>
                </div>
            </div>

            {categories.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Henüz dosya eklenmemiş.</p>
            ) : (
                <div className="space-y-6">
                    {categories.map((cat) => (
                        <div key={cat.id}>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                {cat.name}
                            </h4>
                            <div className="space-y-2">
                                {cat.files && cat.files.length > 0 ? cat.files.map(res => (
                                    <div key={res.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 group-hover:text-blue-700">{res.name}</h4>
                                                <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                                                    <span>{res.date}</span>
                                                    <span>{res.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs text-gray-400 text-right hidden sm:block">
                                                <div className="font-medium">{res.downloads || 0} İndirme</div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
                                                <Download size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-gray-400 pl-4 py-2">Bu kategoride dosya yok.</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}

function AssignmentsTab({ assignments }) {
    const navigate = useNavigate();
    const { courseId } = useParams();

    if (!assignments || assignments.length === 0) {
        return <div className="p-10 text-center bg-gray-50 rounded-lg text-gray-500">Henüz ödev atanmamış.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button>
                    <Plus size={16} className="mr-2" />
                    Yeni Ödev Ekle
                </Button>
            </div>
            {assignments.map(assign => (
                <Card key={assign.id} className="relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${assign.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-900 text-lg">{assign.title}</h3>
                                <Badge variant={assign.status === 'Active' ? 'success' : 'secondary'}>{assign.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Calendar size={14} /> Son Teslim: {assign.dueDate}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-gray-900">0 / 25</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Teslim</div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Düzenle</Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/dashboard/grading/${courseId}/${assign.id}`)}
                                >
                                    Notlandır
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

function StudentsTab({ students }) {
    if (!students || students.length === 0) {
        return <div className="p-10 text-center bg-gray-50 rounded-lg text-gray-500">Hiç öğrenci kayıtlı değil.</div>;
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Öğrenci Listesi ({students.length})</h3>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline">Excel Olarak İndir</Button>
                    <Button size="sm">Tümüne Mesaj At</Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="p-3">Numara</th>
                            <th className="p-3">Ad Soyad</th>
                            <th className="p-3">Vize</th>
                            <th className="p-3">Final</th>
                            <th className="p-3">Durum</th>
                            <th className="p-3 float-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map(student => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900">{student.id}</td>
                                <td className="p-3">{student.name}</td>
                                <td className="p-3">{student.midterm || '-'}</td>
                                <td className="p-3">{student.final || '-'}</td>
                                <td className="p-3">
                                    <Badge variant="success" size="sm">{student.status}</Badge>
                                </td>
                                <td className="p-3 text-right">
                                    <Button size="xs" variant="ghost">Profili Gör</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button, Card } from '../../components/ui';
