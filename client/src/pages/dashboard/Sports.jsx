import { Clock, Trophy } from 'lucide-react';
import { useSportsFacilities } from '../../hooks/queries/useSportsFacilities';

export default function Sports() {
    const { data: sportsFacilities = [] } = useSportsFacilities();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Trophy className="text-orange-600" /> Spor Tesisleri
                    </h1>
                    <p className="text-slate-500 text-sm">Tesis doluluk durumları ve rezervasyon</p>
                </div>
                <Button variant="primary" icon={Clock}>Randevu Al</Button>
            </div>

            {sportsFacilities.length === 0 && (
                <Card className="p-12 text-center text-slate-400 border-dashed">
                    <Trophy size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">Tesis bilgisi bulunmamaktadır.</p>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {sportsFacilities.map((facility) => (
                    <Card key={facility.id} className="p-0 overflow-hidden">
                        <div className="h-40 relative">
                            <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="sm">Programı Gör</Button>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-800">{facility.name}</h3>
                                <Badge variant={facility.status === 'Açık' ? 'success' : 'danger'}>{facility.status}</Badge>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Anlık Doluluk</span>
                                    <span>%{facility.occupancy}</span>
                                </div>
                                <ProgressBar value={facility.occupancy} max={100} color={facility.occupancy > 80 ? 'bg-red-500' : 'bg-emerald-500'} />
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock size={14} />
                                <span>{facility.hours}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card, ProgressBar } from '../../components/ui';
