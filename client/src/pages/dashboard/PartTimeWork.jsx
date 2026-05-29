import { Briefcase, CalendarCheck2, Clock } from 'lucide-react';

// Components

// Mock Data
import { partTimeWork } from '../../data/mockData';

export default function PartTimeWork() {
    const workProgress = (parseInt(partTimeWork.workedThisMonth) / parseInt(partTimeWork.monthlyLimit)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase className="text-blue-600" /> Kısmi Zamanlı Çalışma
                    </h1>
                    <p className="text-slate-500 text-sm">Öğrenci asistanlık saatleri ve maaş takibi</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 md:col-span-2">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">{partTimeWork.role}</h3>
                            <p className="text-slate-500">{partTimeWork.department}</p>
                        </div>
                        <Badge variant="success">{partTimeWork.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <span className="text-blue-600 text-sm font-bold block mb-1">Saatlik Ücret</span>
                            <span className="text-2xl font-bold text-slate-800">{partTimeWork.hourlyRate}</span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                            <span className="text-green-600 text-sm font-bold block mb-1">Tahmini Hak Ediş</span>
                            <span className="text-2xl font-bold text-slate-800">{partTimeWork.salary}</span>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Bu Ay Çalışılan: {partTimeWork.workedThisMonth}</span>
                            <span className="font-bold">Limit: {partTimeWork.monthlyLimit}</span>
                        </div>
                        <ProgressBar value={workProgress} max={100} color="bg-blue-500" />
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-slate-400" /> Son Çalışmalar
                    </h3>
                    <div className="space-y-4">
                        {(partTimeWork.shifts || []).map((shift, idx) => (
                            <div key={idx} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                <div>
                                    <span className="block font-bold text-slate-700">{shift.date}</span>
                                    <span className="text-xs text-slate-500">{shift.hours}</span>
                                </div>
                                <Badge variant="secondary">{shift.total} Saat</Badge>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" icon={CalendarCheck2}>Puantaj Gir</Button>
                </Card>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card, ProgressBar } from '../../components/ui';
