import { useGraduationStatus } from '../../hooks/queries/useGraduationStatus';

export default function Graduation() {
    const { data: graduationStatus = {} } = useGraduationStatus();

    const required = graduationStatus.requiredCredits || 0;
    const creditProgress = required > 0 ? (graduationStatus.totalCredits / required) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <GraduationCap className="text-purple-600" /> Mezuniyet İşlemleri
                    </h1>
                    <p className="text-slate-500 text-sm">Mezuniyet durumu sorgulama ve ilişik kesme</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Mezuniyet İlerleme Durumu</h3>

                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Toplanan AKTS: {graduationStatus.totalCredits}</span>
                            <span className="font-bold">Gerekli: {graduationStatus.requiredCredits}</span>
                        </div>
                        <ProgressBar value={creditProgress} max={100} color="bg-purple-600" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                            {graduationStatus.gpa >= 2.0 ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                            <div>
                                <h4 className="font-bold text-slate-800">Genel Not Ortalaması (GNO)</h4>
                                <p className="text-sm text-slate-500">Mevcut: {graduationStatus.gpa} (Min: 2.00)</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                            {graduationStatus.internshipStatus === 'Tamamlandı' ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                            <div>
                                <h4 className="font-bold text-slate-800">Staj Zorunluluğu</h4>
                                <p className="text-sm text-slate-500">Durum: {graduationStatus.internshipStatus}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                            {graduationStatus.libraryStatus === 'Temiz' ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                            <div>
                                <h4 className="font-bold text-slate-800">Kütüphane Borcu</h4>
                                <p className="text-sm text-slate-500">Durum: {graduationStatus.libraryStatus}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                            {graduationStatus.thesisStatus === 'Teslim Edildi' ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                            <div>
                                <h4 className="font-bold text-slate-800">Bitirme Tezi</h4>
                                <p className="text-sm text-slate-500">Durum: {graduationStatus.thesisStatus}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6 bg-purple-50 border-purple-100">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileCheck size={32} />
                            </div>
                            <h3 className="font-bold text-purple-900">İlişik Kesme Belgesi</h3>
                            <p className="text-xs text-purple-700 mt-1">
                                Mezuniyet şartlarını sağladığınızda buradan ilişik kesme sürecini başlatabilirsiniz.
                            </p>
                        </div>
                        <Button variant="primary" className="w-full" disabled>Süreci Başlat (Henüz Hazır Değil)</Button>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { CheckCircle2, FileCheck, GraduationCap, XCircle } from 'lucide-react';
import { Button, Card, ProgressBar } from '../../components/ui';
