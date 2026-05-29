import { AlertCircle, Calendar, FileCheck, Stethoscope, UploadCloud } from 'lucide-react';

// Components

// Mock Data
import { healthReports } from '../../data/mockData';

export default function HealthReports() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Stethoscope className="text-red-500" /> Sağlık Raporları
                    </h1>
                    <p className="text-slate-500 text-sm">Mazeret sınavı ve devamsızlık için rapor bildirimi</p>
                </div>
                <Button variant="primary" icon={UploadCloud}>Rapor Yükle</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <FileCheck className="text-slate-400" /> Rapor Geçmişi
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Tarih</th>
                                    <th className="px-4 py-3">Hastane / Kurum</th>
                                    <th className="px-4 py-3">Tanı</th>
                                    <th className="px-4 py-3">Süre</th>
                                    <th className="px-4 py-3">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {healthReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-700 flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {report.date}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{report.hospital}</td>
                                        <td className="px-4 py-3 text-slate-800 font-medium">{report.diagnosis}</td>
                                        <td className="px-4 py-3 text-slate-600">{report.days} Gün</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={report.status === 'Onaylandı' ? 'success' : report.status === 'Bekliyor' ? 'warning' : 'danger'}>
                                                {report.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="p-6 bg-amber-50 border-amber-100">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-800 text-lg mb-2">Önemli Uyarılar</h4>
                            <ul className="list-disc list-inside text-sm text-amber-700 space-y-2">
                                <li>Raporunuzun aslı sınav tarihinden itibaren <strong>3 iş günü</strong> içinde Fakülte Sekreterliğine teslim edilmelidir.</li>
                                <li>Özel hastane raporları başhekimlik onaylı olmalıdır.</li>
                                <li>Rapor süresince girilen sınavlar ve dersler geçersiz sayılır.</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card } from '../../components/ui';
