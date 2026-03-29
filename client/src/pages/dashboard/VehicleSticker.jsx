import { ArrowRight } from 'lucide-react';

// Components

// Mock Data
import { vehicleSticker } from '../../data/mockData';

export default function VehicleSticker() {
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

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-slate-500">Plaka</span>
                            <span className="font-mono font-bold text-2xl bg-slate-100 px-2 py-1 rounded border border-slate-300">
                                {vehicleSticker.plate}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-slate-500">Marka / Model</span>
                            <span className="font-bold text-slate-800">{vehicleSticker.model}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-slate-500">Renk</span>
                            <span className="font-bold text-slate-800">{vehicleSticker.color}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-slate-500">Pul Durumu</span>
                            <Badge variant="success">{vehicleSticker.status}</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-slate-500 flex items-center gap-2"><Calendar size={14} /> Geçerlilik Tarihi</span>
                            <span className="font-mono text-slate-800">{vehicleSticker.validUntil}</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Yeni Araç Ekle / Güncelle</h3>
                    <form className="space-y-4">
                        <Input label="Araç Plakası" placeholder="34 XX 1234" />
                        <Input label="Marka / Model" placeholder="Örn: Renault Clio" />
                        <Input label="Ruhsat Sahibi" placeholder="Ad Soyad" />

                        <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-700 leading-relaxed border border-amber-100">
                            <strong>Dikkat:</strong> Araç pulu başvurusu için ruhsat fotokopisi güvenlik birimine teslim edilmelidir. Onay süreci 3 iş günüdür.
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button variant="primary" icon={ArrowRight}>Başvuru Oluştur</Button>
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
