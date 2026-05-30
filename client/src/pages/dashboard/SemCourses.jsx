import { ArrowRight, CheckCircle2, Clock, GraduationCap, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSemCourses, useEnrollSemCourse } from '../../hooks/queries/useSemCourses';

export default function SemCourses() {
    const { data: semCourses = [] } = useSemCourses();
    const enroll = useEnrollSemCourse();

    const handleEnroll = (id) => {
        enroll.mutate(id, {
            onSuccess: () => toast.success('Eğitim programına kaydınız alındı.'),
            onError: () => toast.error('Kayıt işlemi başarısız.')
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <GraduationCap className="text-rose-600" /> SEM - Sürekli Eğitim Merkezi
                    </h1>
                    <p className="text-slate-500 text-sm">Kariyerinize değer katacak sertifikalı eğitim programları</p>
                </div>
            </div>

            {semCourses.length === 0 && (
                <Card className="p-12 text-center text-slate-400 border-dashed">
                    <GraduationCap size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">Şu anda açık bir eğitim programı bulunmamaktadır.</p>
                </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {semCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-slate-200 relative">
                            {/* Placeholder Image */}
                            <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-400 font-bold text-lg">
                                {course.title.substring(0, 1)}
                            </div>
                            <div className="absolute top-4 right-4">
                                <Badge variant="success">{course.price}</Badge>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-2 truncate" title={course.title}>{course.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                                <span className="flex items-center gap-1"><User size={14} /> {course.instructor}</span>
                            </div>

                            <hr className="border-slate-100 my-4" />

                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-xs text-slate-600 font-medium">E-Devlet Onaylı Sertifika</span>
                            </div>

                            <Button variant="primary" className="w-full" icon={ArrowRight} disabled={enroll.isPending} onClick={() => handleEnroll(course.id)}>Kayıt Ol</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card } from '../../components/ui';
