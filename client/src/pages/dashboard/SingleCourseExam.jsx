import { useState } from 'react';

// Components

export default function SingleCourseExam() {
    const [isApplied, setIsApplied] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsApplied(true);
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
                        <GraduationCap className="text-emerald-600" /> Tek Ders Sınavı
                    </h1>
                    <p className="text-slate-500 text-sm">Mezuniyet aşamasındaki öğrenciler için tek ders sınav başvurusu</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        {!isApplied ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex items-center gap-3 mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <AlertCircle className="text-emerald-600 flex-shrink-0" />
                                    <p className="text-sm text-emerald-800">
                                        Tek ders sınavına sadece mezuniyeti için en fazla bir başarısız dersi kalan ve diğer tüm yükümlülükleri yerine getirmiş öğrenciler başvurabilir.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Öğrenci No" value="B211200051" disabled />
                                    <Input label="Bölüm" value="Yazılım Mühendisliği" disabled />
                                </div>

                                <Select
                                    label="Ders Seçiniz"
                                    options={[
                                        { value: '', label: 'Ders Seçiniz...' },
                                        { value: 'YZM302', label: 'YZM302 - Yazılım Mimarisi (FF)' }
                                    ]}
                                />

                                <div className="flex justify-end pt-4">
                                    <Button variant="primary" type="submit">Başvuruyu Gönder</Button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Başvurunuz Onaylandı!</h3>
                                <p className="text-slate-500 max-w-md">
                                    Tek ders sınavı başvurunuz Fakülte Yönetim Kurulu tarafından değerlendirilecektir. Sonucu "Belgelerim" sayfasından takip edebilirsiniz.
                                </p>
                                <Button variant="outline" onClick={() => setIsApplied(false)}>Yeni Başvuru</Button>
                            </div>
                        )}
                    </Card>
                </div>

                <div>
                    <Card className="bg-slate-900 text-white border-none p-6">
                        <h3 className="font-bold text-lg mb-4">Başvuru Şartları</h3>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                Toplam AKTS kredisini tamamlamış olmak (240 AKTS).
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                Müfredattaki tüm dersleri almış ve devam koşulunu sağlamış olmak.
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                Sadece FF, FD veya DD notu olan tek bir dersin kalmış olması.
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, GraduationCap } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/ui';
