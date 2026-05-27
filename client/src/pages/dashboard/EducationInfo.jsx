import { Book, FileText, Globe, GraduationCap, Info } from 'lucide-react';

export default function EducationInfo() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <GraduationCap className="text-indigo-600" /> Eğitim Bilgi Sistemi (EBS)
                    </h1>
                    <p className="text-slate-500 text-sm">Bologna süreci, ders katalogları ve program bilgileri</p>
                </div>
                <Button variant="outline" icon={Globe}>EBS Web Sitesi</Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Program Information */}
                <Card className="p-6 border-l-4 border-l-indigo-600">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Program Bilgileri</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">Program Adı</span>
                            <span className="font-medium text-slate-800">Yazılım Mühendisliği (İngilizce)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">Derece</span>
                            <span className="font-medium text-slate-800">Lisans (Bachelor's Degree)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">Öğrenim Dili</span>
                            <span className="font-medium text-slate-800">İngilizce (%30)</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-500">Program Başkanı</span>
                            <span className="font-medium text-slate-800">Prof. Dr. Ahmet Yılmaz</span>
                        </div>
                    </div>
                </Card>

                {/* Quick Links */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Book size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Ders Kataloğu</h4>
                        <p className="text-sm text-slate-500">Müfredat, ders içerikleri ve AKTS kredileri.</p>
                    </Card>

                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Program Çıktıları</h4>
                        <p className="text-sm text-slate-500">Programın kazandırdığı yetkinlikler matrisi.</p>
                    </Card>

                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Info size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Yönetmelikler</h4>
                        <p className="text-sm text-slate-500">Eğitim-öğretim ve sınav yönetmeliği.</p>
                    </Card>

                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <GraduationCap size={24} />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Mezuniyet Şartları</h4>
                        <p className="text-sm text-slate-500">Mezuniyet için gerekli koşullar ve proje detayları.</p>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Button, Card } from '../../components/ui';
