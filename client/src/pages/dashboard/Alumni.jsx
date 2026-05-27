import { Briefcase, MessageSquare, UserCheck, Users } from 'lucide-react';

export default function Alumni() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="text-indigo-600" /> Mezunlar Platformu
                    </h1>
                    <p className="text-slate-500 text-sm">Mezunlarımızla iletişim kurun ve network oluşturun</p>
                </div>
                <Button variant="primary" icon={UserCheck}>Mezun Bilgi Sistemi</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 text-center border-t-4 border-t-indigo-500">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                        <Briefcase size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Mentorluk Programı</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Sektördeki deneyimli mezunlarımızdan kariyer rehberliği alın.
                    </p>
                    <Button variant="outline" className="w-full">Mentor Bul</Button>
                </Card>

                <Card className="p-6 text-center border-t-4 border-t-rose-500">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-4">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Mezun Forumu</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Sektörel tartışmalara katılın, sorular sorun ve deneyimlerinizi paylaşın.
                    </p>
                    <Button variant="outline" className="w-full">Foruma Git</Button>
                </Card>

                <Card className="p-6 text-center border-t-4 border-t-emerald-500">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                        <Users size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Mezunlar Derneği</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Etkinliklerden haberdar olun ve dernek ayrıcalıklarından yararlanın.
                    </p>
                    <Button variant="outline" className="w-full">Üyelik İşlemleri</Button>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Başarı Hikayeleri</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <img src="https://i.pravatar.cc/150?u=a" alt="Alumni" className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                            <h4 className="font-bold text-slate-800">Ahmet Yılmaz</h4>
                            <p className="text-xs text-indigo-600 font-bold mb-1">Google - Yazılım Mühendisi</p>
                            <p className="text-sm text-slate-500 line-clamp-2">
                                "Üniversitemde aldığım eğitim ve Erasmus deneyimim kariyerimde dönüm noktası oldu..."
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <img src="https://i.pravatar.cc/150?u=b" alt="Alumni" className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                            <h4 className="font-bold text-slate-800">Zeynep Kaya</h4>
                            <p className="text-xs text-indigo-600 font-bold mb-1">Trendyol - Ürün Yöneticisi</p>
                            <p className="text-sm text-slate-500 line-clamp-2">
                                "Girişimcilik kulübündeki aktif görevlerim bana liderlik vasıfları kazandırdı..."
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Button, Card } from '../../components/ui';
