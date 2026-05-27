import { FileText, Globe2, Plane } from 'lucide-react';

// Components

// Mock Data
import { erasmusApplications, erasmusChoices } from '../../data/mockData';

export default function Erasmus() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Globe2 className="text-indigo-600" /> Erasmus & Değişim
                    </h1>
                    <p className="text-slate-500 text-sm">Erasmus+ ve Farabi değişim programı işlemleri</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" icon={FileText}>Belgelerim</Button>
                    <Button variant="primary" icon={Plane}>Yeni Başvuru</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Applications History */}
                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-100">Başvuru Geçmişi</h3>
                    <div className="space-y-4">
                        {erasmusApplications.map((app) => (
                            <div key={app.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                            Erasmus+ Öğrenim Hareketliliği
                                        </h4>
                                        <p className="text-sm text-slate-500 mt-1">Dönem: {app.year} / {app.term}</p>
                                    </div>
                                    <Badge variant={
                                        app.status === 'Başvuru Alındı' ? 'info' :
                                            app.status === 'Asil' ? 'success' :
                                                app.status === 'Yedek' ? 'warning' : 'danger'
                                    }>
                                        {app.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm pt-2 border-t border-slate-200">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500">Erasmus Puanı</span>
                                        <span className="font-bold text-indigo-600 text-lg">{app.score}</span>
                                    </div>
                                    <div className="flex flex-col ml-auto text-right">
                                        <span className="text-xs text-slate-500">Son Güncelleme</span>
                                        <span className="font-medium text-slate-700">15.02.2026</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* University Choices */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800">2026-2027 Tercih Listesi</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Durum: Taslak</span>
                    </div>

                    <div className="space-y-3">
                        {erasmusChoices.map((choice, idx) => (
                            <div key={choice.id} className="flex gap-4 items-center p-3 bg-white hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors group">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{choice.university}</h4>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Globe2 size={12} /> {choice.country}
                                        </span>
                                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-auto">Kontenjan: {choice.quota}</Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Alert variant="info" className="mt-6 text-xs">
                        Tercih sıralamanızı başvuru bitiş tarihine kadar güncelleyebilirsiniz. Yerleştirmeler puan üstünlüğüne göre yapılacaktır.
                    </Alert>
                </Card>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Alert, Badge, Button, Card } from '../../components/ui';
