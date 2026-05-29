import { useState } from 'react';
import { AlertCircle, Calendar, FileCheck, Stethoscope, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Badge, Button, Card, Modal, Input } from '../../components/ui';
import { useHealthReports, useCreateHealthReport } from '../../hooks/queries/useHealthReports';

const EMPTY_FORM = { hospital: '', diagnosis: '', date: '', days: 1 };

export default function HealthReports() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const { data: reports = [], isLoading } = useHealthReports();
    const createReport = useCreateHealthReport();

    const handleField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.hospital.trim() || !form.diagnosis.trim() || !form.date) {
            toast.warning('Lütfen hastane, tanı ve tarih alanlarını doldurun.');
            return;
        }
        createReport.mutate({ ...form, days: Number(form.days) || 1 }, {
            onSuccess: () => {
                toast.success('Raporunuz bildirildi.');
                setForm(EMPTY_FORM);
                setIsModalOpen(false);
            },
            onError: (err) => toast.error(err?.response?.data?.message || 'Rapor bildirilemedi.')
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
                        <Stethoscope className="text-red-500" /> Sağlık Raporları
                    </h1>
                    <p className="text-slate-500 text-sm">Mazeret sınavı ve devamsızlık için rapor bildirimi</p>
                </div>
                <Button variant="primary" icon={UploadCloud} onClick={() => setIsModalOpen(true)}>Rapor Yükle</Button>
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
                                {isLoading ? (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Yükleniyor...</td></tr>
                                ) : reports.length === 0 ? (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Henüz rapor bildirmediniz.</td></tr>
                                ) : reports.map((report) => (
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sağlık Raporu Bildir">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Hastane / Kurum" placeholder="Örn. Acıbadem Hastanesi" value={form.hospital} onChange={handleField('hospital')} required />
                    <Input label="Tanı" placeholder="Örn. Üst solunum yolu enfeksiyonu" value={form.diagnosis} onChange={handleField('diagnosis')} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Rapor Tarihi" type="date" value={form.date} onChange={handleField('date')} required />
                        <Input label="Süre (gün)" type="number" min="1" max="60" value={form.days} onChange={handleField('days')} required />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit" variant="primary" disabled={createReport.isPending}>
                            {createReport.isPending ? 'Gönderiliyor...' : 'Raporu Bildir'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
}
