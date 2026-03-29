import { Phone } from 'lucide-react';

// Components

// Mock Data
import { healthAppointments } from '../../data/mockData';

export default function HealthCenter() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <HeartPulse className="text-red-600" /> Sağlık Merkezi
                    </h1>
                    <p className="text-slate-500 text-sm">Poliklinik randevuları, nöbetçi eczane ve acil durum bilgileri</p>
                </div>
                <Button variant="danger" icon={Phone}>Acil Durum: 112</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Appointments Section */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <CalendarCheck size={20} className="text-blue-600" /> Randevularım
                        </h3>
                        <Button variant="outline" size="sm">Yeni Randevu</Button>
                    </div>

                    <div className="space-y-3">
                        {healthAppointments.map((app) => (
                            <div key={app.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                                        <Stethoscope size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{app.department}</h4>
                                        <p className="text-sm text-slate-500">{app.doctor}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-700">{app.date}</p>
                                    <p className="text-sm text-slate-500">{app.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 border-l-4 border-l-red-500">
                        <h3 className="font-bold text-red-700 mb-2">Mediko Çalışma Saatleri</h3>
                        <p className="text-sm text-slate-600 mb-4">Hafta içi her gün 08:30 - 17:30 arasında hizmet vermektedir.</p>
                        <div className="space-y-2 text-sm font-medium text-slate-700">
                            <div className="flex justify-between"><span>Poliklinik</span><span>09:00 - 16:30</span></div>
                            <div className="flex justify-between"><span>Psikolojik Dan.</span><span>Randevulu</span></div>
                        </div>
                    </Card>

                    <Card className="bg-blue-600 text-white p-6 border-none">
                        <h3 className="font-bold text-lg mb-2">Nöbetçi Eczane</h3>
                        <p className="text-blue-100 text-sm mb-4">Kampüse en yakın nöbetçi eczane (Bugün)</p>

                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <h4 className="font-bold text-lg">Şifa Eczanesi</h4>
                            <p className="text-sm opacity-90 mt-1">Beşyol Meydanı No:12</p>
                            <div className="mt-3 flex gap-2">
                                <Button variant="secondary" size="sm" className="w-full text-blue-900 bg-white hover:bg-blue-50">Haritada Gör</Button>
                                <Button variant="outline" size="sm" className="w-full border-white/30 hover:bg-white/10">Ara</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
