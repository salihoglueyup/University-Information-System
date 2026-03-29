import { ExternalLink } from 'lucide-react';

const moodleCourses = [
    { id: 1, name: "Yazılım Mimarisi (YZM302)", progress: 75, nextTask: "Rapor Teslimi", deadline: "15 Şubat", code: "YZM302" },
    { id: 2, name: "Web Programlama (YZM304)", progress: 60, nextTask: "Quiz 3", deadline: "18 Şubat", code: "YZM304" },
    { id: 3, name: "Yapay Zeka (YZM310)", progress: 40, nextTask: "Proje Taslağı", deadline: "25 Şubat", code: "YZM310" },
    { id: 4, name: "İşletme Yönetimi (ISL102)", progress: 90, nextTask: "Video İzle", deadline: "14 Şubat", code: "ISL102" }
];

export default function Moodle() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="text-orange-600" /> UZEM - Moodle
                    </h1>
                    <p className="text-slate-500 text-sm">Uzaktan eğitim portalı ve ders materyalleri</p>
                </div>
                <Button variant="outline" icon={ExternalLink}>Moodle'a Git</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moodleCourses.map((course) => (
                    <Card key={course.id} className="p-0 overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-1">{course.name}</h3>
                                <p className="text-sm opacity-90">{course.code}</p>
                            </div>
                            <Presentation className="absolute bottom-[-10px] right-[-10px] opacity-20 transform rotate-12" size={80} />
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <div className="flex justify-between text-xs font-semibold mb-2 uppercase tracking-wide text-slate-500">
                                    <span>İlerleme</span>
                                    <span className="text-orange-600">%{course.progress}</span>
                                </div>
                                <ProgressBar value={course.progress} max={100} color="bg-orange-500" h="h-2" />
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100 mb-4">
                                <CheckSquare size={18} className="text-orange-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="block text-xs uppercase text-orange-600 font-bold mb-0.5">Sıradaki Görev</span>
                                    <span className="text-sm font-medium text-slate-800 block">{course.nextTask}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-100">
                                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                                    <Clock size={14} /> Son: {course.deadline}
                                </span>
                                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">Ders Sayfası</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-indigo-50 border-dashed border-2 border-indigo-200 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm mb-3">
                        <Presentation size={24} />
                    </div>
                    <h3 className="font-bold text-indigo-900 mb-1">Canlı Ders Bağlantıları</h3>
                    <p className="text-sm text-indigo-700/80 mb-4 max-w-xs">
                        Senkron dersler için BigBlueButton veya Zoom bağlantılarına buradan ulaşabilirsiniz.
                    </p>
                    <Button variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-transparent">Takvimi Görüntüle</Button>
                </Card>

                <Card className="p-6 bg-emerald-50 border-dashed border-2 border-emerald-200 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm mb-3">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="font-bold text-emerald-900 mb-1">Ders Kaynakları</h3>
                    <p className="text-sm text-emerald-700/80 mb-4 max-w-xs">
                        Ders izlenceleri, PDF notlar ve ek kaynaklara hızlı erişim sağlayın.
                    </p>
                    <Button variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent">Kaynaklara Git</Button>
                </Card>
            </div>
        </motion.div>
    );
}
