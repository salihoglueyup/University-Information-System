import { useState } from 'react';
import { AlertCircle, BookOpen, CheckCircle, ChevronRight, Clock, FileText, Filter, MapPin, MoreVertical, PenTool, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInstructorCourses } from '../../hooks/queries/useInstructorCourses';

export default function InstructorCourses() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const { data: instructorCoursesData = [] } = useInstructorCourses();

    const filteredCourses = instructorCoursesData.filter(course =>
        (course.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Verilen Dersler"
                description="Bu dönem eğitimini yürüttüğünüz derslerin listesi ve yönetim paneli."
                icon={BookOpen}
                action={
                    <Button variant="outline" size="sm">
                        <FileText size={16} className="mr-2" />
                        Ders İzlencelerini İndir
                    </Button>
                }
            />

            {/* Quick Stats or Filters could go here */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Ders kodu veya adı ile ara..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        Toplam <span className="font-bold text-gray-800">{filteredCourses.length}</span> ders listeleniyor
                    </span>
                    <Button variant="ghost" size="icon">
                        <Filter size={18} />
                    </Button>
                </div>
            </div>

            {filteredCourses.length === 0 && (
                <Card className="p-12 text-center text-gray-400 border-dashed">
                    <BookOpen size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Bu dönem yürüttüğünüz bir ders bulunmamaktadır.</p>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCourses.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-100 group relative overflow-hidden">
                            {/* Decorative gradient header */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="primary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                            {course.code}
                                        </Badge>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                            {course.type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                        {course.name}
                                    </h3>
                                </div>
                                <button className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-full transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Ders Saati</p>
                                        <p className="font-medium">{course.schedule}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Derslik</p>
                                        <p className="font-medium">{course.room}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Kayıtlı Öğrenci</p>
                                        <p className="font-medium">{course.studentsEnrolled}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                        <CheckCircle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Devam Oranı</p>
                                        <p className="font-medium">%{course.attendanceRate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex-1 text-center border-r border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">Ders İzlencesi</p>
                                    <div className={`text-xs font-bold flex items-center justify-center gap-1 ${course.syllabusStatus === 'Tamamlandı' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {course.syllabusStatus === 'Tamamlandı' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                        {course.syllabusStatus}
                                    </div>
                                </div>
                                <div className="flex-1 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Bekleyen Not</p>
                                    <div className={`text-xs font-bold flex items-center justify-center gap-1 ${course.pendingGrading > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                        {course.pendingGrading} Öğrenci
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <Button
                                    className="flex-1"
                                    onClick={() => navigate(`/dashboard/course/${course.id}`)}
                                >
                                    Ders Detayı
                                    <ChevronRight size={16} className="ml-1 opacity-70" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="px-3"
                                    title="Not Girişi"
                                    onClick={() => navigate('/dashboard/grading')}
                                >
                                    <PenTool size={18} />
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="px-3"
                                    title="Yoklama Al"
                                >
                                    <CheckCircle size={18} />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card, PageHeader } from '../../components/ui';
