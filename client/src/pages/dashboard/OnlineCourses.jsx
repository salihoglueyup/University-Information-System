import { Calendar, Clock, ExternalLink, PlayCircle, Wifi } from 'lucide-react';

// Components

// Mock Data
import { onlineCourses } from '../../data/mockData';

export default function OnlineCourses() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Wifi className="text-emerald-600" /> Online Derslerim
                    </h1>
                    <p className="text-slate-500 text-sm">UZEM ve Moodle sistemi üzerinden yürütülen dersler</p>
                </div>
                <Button variant="primary" icon={ExternalLink} onClick={() => window.open('https://uzem.aydin.edu.tr', '_blank')}>
                    UZEM Sistemine Git
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {onlineCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-all group">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="secondary" className="mb-2">{course.code}</Badge>
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                        {course.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">{course.instructor}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <PlayCircle size={24} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold text-slate-600">
                                    <span>Tamamlanma Durumu</span>
                                    <span>%{course.progress}</span>
                                </div>
                                <ProgressBar value={course.progress} max={100} color="bg-emerald-500" />
                            </div>

                            <div className="flex items-center gap-6 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-slate-400" />
                                    <span>Son Erişim: {course.lastAccess}</span>
                                </div>
                                {course.nextLiveSession && (
                                    <div className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                                        <Calendar size={14} />
                                        <span>Canlı Ders: {course.nextLiveSession}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{course.platform}</span>
                            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                Derse Git <ExternalLink size={14} className="ml-2" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <ExternalLink size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-blue-900">Adobe Connect Kurulumu</h3>
                    <p className="text-blue-700 text-sm mt-1 max-w-2xl">
                        Canlı derslere katılabilmek için Adobe Connect uygulamasının bilgisayarınızda yüklü olması gerekmektedir.
                        Mobil cihazlar için App Store veya Google Play Store'dan indirebilirsiniz.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        Uygulamayı İndir
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Calendar, Card, ProgressBar } from '../../components/ui';
