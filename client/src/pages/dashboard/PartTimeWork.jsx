import { useState } from 'react';
import { Briefcase, CalendarCheck2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Badge, Button, Card, Input, Modal, ProgressBar } from '../../components/ui';
import { usePartTimeWork, useAddShift } from '../../hooks/queries/usePartTimeWork';

export default function PartTimeWork() {
    const { data: partTimeWork = {} } = usePartTimeWork();
    const addShift = useAddShift();

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ date: '', hours: '', total: '' });

    const worked = parseInt(partTimeWork.workedThisMonth) || 0;
    const limit = parseInt(partTimeWork.monthlyLimit) || 0;
    const workProgress = limit > 0 ? (worked / limit) * 100 : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        addShift.mutate(
            { date: form.date, hours: form.hours, total: Number(form.total) },
            {
                onSuccess: () => {
                    toast.success('Puantaj kaydedildi.');
                    setOpen(false);
                    setForm({ date: '', hours: '', total: '' });
                },
                onError: (err) => toast.error(err?.response?.data?.message || 'Puantaj kaydedilemedi.')
            }
        );
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
                        <Briefcase className="text-blue-600" /> Kısmi Zamanlı Çalışma
                    </h1>
                    <p className="text-slate-500 text-sm">Öğrenci asistanlık saatleri ve maaş takibi</p>
                </div>
            </div>

            {!partTimeWork.role ? (
                <Card className="p-12 text-center text-slate-400 border-dashed">
                    <Briefcase size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">Aktif bir kısmi zamanlı çalışma kaydınız bulunmamaktadır.</p>
                </Card>
            ) : (
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
                            {(partTimeWork.shifts || []).length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">Henüz puantaj girilmemiş.</p>
                            )}
                        </div>
                        <Button variant="outline" className="w-full mt-4" icon={CalendarCheck2} onClick={() => setOpen(true)}>Puantaj Gir</Button>
                    </Card>
                </div>
            )}

            <Modal isOpen={open} onClose={() => setOpen(false)} title="Puantaj Gir">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tarih"
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                    />
                    <Input
                        label="Saat Aralığı"
                        placeholder="09:00 - 13:00"
                        value={form.hours}
                        onChange={(e) => setForm({ ...form, hours: e.target.value })}
                    />
                    <Input
                        label="Toplam Saat"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={form.total}
                        onChange={(e) => setForm({ ...form, total: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                        <Button type="submit" variant="primary" disabled={addShift.isPending}>Kaydet</Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
}
