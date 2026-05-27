
// Components

// Mock Data
import { shuttleHours } from '../../data/mockData';

export default function ShuttleSchedule() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Bus className="text-yellow-500" /> Ring Seferleri
                    </h1>
                    <p className="text-slate-500 text-sm">Kampüs ile ana ulaşım noktaları arasındaki ücretsiz ring servis saatleri</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {shuttleHours.map((route, idx) => (
                    <Card key={idx} className="overflow-hidden">
                        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <Bus size={18} className="text-yellow-400" />
                                {route.route}
                            </h3>
                            <Badge variant="warning" className="text-xs">Ücretsiz</Badge>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-wrap gap-2 text-center items-center justify-center">
                                {route.times.map((time, tIdx) => (
                                    <div key={tIdx} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 hover:bg-yellow-50 hover:border-yellow-200 transition-colors cursor-default">
                                        <span className="font-mono font-bold text-slate-700">{time}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col gap-2 text-sm text-slate-500 border-t pt-4">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>Kalkış: <b>Rektörlük Binası Önü</b></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>Tahmini Süre: <b>15 Dakika</b></span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-4 items-start">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 mt-1">
                    <Clock size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-yellow-800">Bilgilendirme</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                        Ring servislerimiz trafik durumuna göre 5-10 dakika gecikmeli olabilir.
                        Sınav dönemlerinde sefer saatleri güncellenmektedir.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Bus, Clock, MapPin } from 'lucide-react';
import { Badge, Card } from '../../components/ui';
