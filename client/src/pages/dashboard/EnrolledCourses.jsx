import { useNavigate } from 'react-router-dom';
import { Clock, GraduationCap, MapPin, MoreHorizontal, User } from 'lucide-react';

// Components
import { useEnrolledCourses } from '../../hooks/useEnrolledCourses';

export default function EnrolledCourses() {
    const { data: courses = [], isLoading } = useEnrolledCourses();
    const navigate = useNavigate();

    // Enriching the backend data with more details for this view
    const enrichedCourses = courses.map((course, idx) => ({
        ...course,
        instructor: {
            name: course.instructor || ["Prof. Dr. Ahmet Yılmaz", "Dr. Ayşe Kaya", "Dr. Mehmet Demir"][idx % 3],
            image: `https://i.pravatar.cc/150?u=${idx}`
        },
        schedule: ["Pazartesi 09:00", "Salı 13:00", "Çarşamba 10:00"][idx % 3],
        location: ["D-201", "Lab-3", "Amfi-2"][idx % 3],
        description: "Bu ders, temel kavramları ve ileri düzey uygulamaları kapsamaktadır.",
        students: 45
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Yazıldığım Dersler</h1>
                    <p className="text-slate-500 text-sm">2025-2026 Güz Dönemi</p>
                </div>
                <Button variant="primary" icon={GraduationCap}>Ders Kaydı</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    enrichedCourses.map((course) => (
                        <Card
                            key={course.code}
                            className="hover:shadow-md transition-shadow group cursor-pointer"
                            onClick={() => navigate(`/dashboard/course/${course.code}`)}
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="font-mono">{course.code}</Badge>
                                    <Button variant="ghost" size="sm" icon={MoreHorizontal} className="h-8 w-8 p-0" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                        {course.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 py-2">
                                    <Avatar src={course.instructor.image} size="sm" />
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-700">{course.instructor.name}</p>
                                        <p className="text-xs text-slate-400">Öğretim Üyesi</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-blue-500" />
                                        <span>{course.schedule}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-red-500" />
                                        <span>{course.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap size={16} className="text-purple-500" />
                                        <span>{course.credit} Kredi</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-emerald-500" />
                                        <span>{course.students} Öğrenci</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                                <Button variant="secondary" className="w-full text-xs">Ders Materyalleri</Button>
                                <Button variant="primary" className="w-full text-xs">Moodle'a Git</Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Avatar, Badge, Button, Card, Separator } from '../../components/ui';
