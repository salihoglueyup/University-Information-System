import { useState } from 'react';
import { ArrowRight, Calendar, CarFront, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Alert, Badge, Button, Card, Input } from '../../components/ui';
import { useVehicle, useApplyVehicle } from '../../hooks/queries/useVehicle';

const EMPTY_FORM = { plate: '', model: '', owner: '' };

const statusVariant = (status) => {
    if (status === 'Aktif') return 'success';
    if (status === 'Reddedildi') return 'danger';
    return 'warning';
};

export default function VehicleSticker() {
    const [form, setForm] = useState(EMPTY_FORM);
    const { data: vehicle } = useVehicle();
    const applyVehicle = useApplyVehicle();

    const handleField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.plate.trim() || form.plate.trim().length < 5 || !form.model.trim()) {
            toast.warning('Lütfen geçerli bir plaka ve marka/model girin.');
            return;
        }
        applyVehicle.mutate(form, {
            onSuccess: () => {
                toast.success('Araç başvurunuz alındı.');
                setForm(EMPTY_FORM);
            },
            onError: (err) => toast.error(err?.response?.data?.message || 'Başvuru oluşturulamadı.')
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
                        <CarFront className="text-stone-800" /> Araç Pulu İşlemleri
                    </h1>
                    <p className="text-slate-500 text-sm">Kampüs giriş için araç kayıt ve HGS pulu başvurusu</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-l-4 border-l-stone-800">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" /> Mevcut Araç Bilgisi
                    </h3>

                    {vehicle ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Plaka</span>
                                <span className="font-mono font-bold text-2xl bg-slate-100 px-2 py-1 rounded border border-slate-300">
                                    {vehicle.plate}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Marka / Model</span>
                                <span className="font-bold text-slate-800">{vehicle.model || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Renk</span>
                                <span className="font-bold text-slate-800">{vehicle.color || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Pul Durumu</span>
                                <Badge variant={statusVariant(vehicle.status)}>{vehicle.status}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-500 flex items-center gap-2"><Calendar size={14} /> Geçerlilik Tarihi</span>
                                <span className="font-mono text-slate-800">{vehicle.validUntil || '—'}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm py-6 text-center">Kayıtlı aracınız bulunmuyor. Sağdaki formdan başvuru oluşturabilirsiniz.</p>
                    )}
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Yeni Araç Ekle / Güncelle</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Input label="Araç Plakası" placeholder="34 XX 1234" value={form.plate} onChange={handleField('plate')} required />
                        <Input label="Marka / Model" placeholder="Örn: Renault Clio" value={form.model} onChange={handleField('model')} required />
                        <Input label="Ruhsat Sahibi" placeholder="Ad Soyad" value={form.owner} onChange={handleField('owner')} />

                        <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-700 leading-relaxed border border-amber-100">
                            <strong>Dikkat:</strong> Araç pulu başvurusu için ruhsat fotokopisi güvenlik birimine teslim edilmelidir. Onay süreci 3 iş günüdür.
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button type="submit" variant="primary" icon={ArrowRight} disabled={applyVehicle.isPending}>
                                {applyVehicle.isPending ? 'Gönderiliyor...' : 'Başvuru Oluştur'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

            <Alert variant="warning" title="Kampüs İçi Hız Sınırı">
                Kampüs içerisinde hız sınırı 20 km/s'dir. Kurallara uymayan araçların giriş izni iptal edilir.
            </Alert>
        </motion.div>
    );
}
