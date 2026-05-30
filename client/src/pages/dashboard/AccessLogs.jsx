import { useAccessLogs } from '../../hooks/queries/useAccessLogs';

export default function AccessLogs() {
    const { data: accessLogs = [] } = useAccessLogs();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Footprints className="text-slate-600" /> Kartlı Geçiş Logları
                    </h1>
                    <p className="text-slate-500 text-sm">Kampüs giriş/çıkış hareketleriniz</p>
                </div>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Lokasyon</th>
                            <th className="px-6 py-4">İşlem Türü</th>
                            <th className="px-6 py-4">Tarih / Saat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {accessLogs.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-slate-400">Geçiş kaydı bulunmamaktadır.</td>
                            </tr>
                        )}
                        {accessLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="font-medium text-slate-800">{log.location}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={log.type === 'Giriş' ? 'success' : 'danger'}>
                                        {log.type}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2 text-slate-500">
                                    <Clock size={16} />
                                    {log.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Clock, Footprints, MapPin } from 'lucide-react';
import { Badge, Card } from '../../components/ui';
