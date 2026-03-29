import { CalendarCheck } from 'lucide-react';

// Components

// Mock Data
import { electronicExams } from '../../data/mockData';

export default function ElectronicExams() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Monitor className="text-cyan-600" /> Elektronik Sınav Sistemi
                    </h1>
                    <p className="text-slate-500 text-sm">E-Sınav randevuları ve giriş belgeleri</p>
                </div>
                <Button variant="outline" icon={CalendarCheck}>Yeni Randevu Al</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {electronicExams.map((exam) => (
                    <Card key={exam.id} className="relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <Monitor className="text-slate-100 group-hover:text-cyan-50 transition-colors" size={64} />
                        </div>

                        <div className="relative z-10">
                            <Badge variant={exam.status === 'Randevu Alındı' ? 'success' : 'warning'} className="mb-4">
                                {exam.status}
                            </Badge>

                            <h3 className="font-bold text-lg text-slate-800 mb-1">{exam.course}</h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-6">Elektronik Sınav</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <CalendarCheck size={16} className="text-cyan-600" />
                                    <span>{exam.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <MapPin size={16} className="text-cyan-600" />
                                    <span className="line-clamp-1">{exam.center}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <Button variant="primary" size="sm" className="w-full">Giriş Belgesi İndir</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
