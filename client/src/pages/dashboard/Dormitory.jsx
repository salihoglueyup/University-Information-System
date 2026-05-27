import { useState, useEffect } from 'react';
import { BedDouble, CalendarCheck, Home, Wallet } from 'lucide-react';

// Components
import axiosInstance from '../../api/axiosInstance';

export default function Dormitory() {
    const [dormitoryData, setDormitoryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDormInfo = async () => {
            try {
                const res = await axiosInstance.get('/dormitory');
                const data = res.data;
                setDormitoryData(data);
            } catch (err) {
                console.error("Yurt bilgisi çekilemedi", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDormInfo();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!dormitoryData) {
        return <div className="p-4 text-center text-slate-500">Yurt kaydınız bulunamadı.</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Home className="text-indigo-600" /> Yurt İşlemleri
                    </h1>
                    <p className="text-slate-500 text-sm">Yurt başvurusu, ödemeler ve izin takibi</p>
                </div>
                <Button variant="outline" icon={CalendarCheck}>Yeni İzin Talebi</Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Room Info */}
                <Card className="p-6 border-t-4 border-t-indigo-500">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <BedDouble size={20} className="text-indigo-600" /> Oda Bilgileri
                    </h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-500">Oda No</span>
                            <span className="font-bold text-slate-800">{dormitoryData.info.room}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-500">Oda Tipi</span>
                            <span className="font-bold text-slate-800">{dormitoryData.info.type}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-500">Yatak</span>
                            <span className="font-bold text-slate-800">{dormitoryData.info.bed}</span>
                        </div>

                        <div>
                            <span className="text-sm text-slate-500 block mb-2">Oda Arkadaşları</span>
                            <div className="flex gap-2">
                                {dormitoryData.info.friends.map((friend, idx) => (
                                    <Badge key={idx} variant="secondary">{friend}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Payments */}
                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Wallet size={20} className="text-emerald-600" /> Ödeme Durumu
                    </h3>

                    <div className="text-center p-6 bg-emerald-50 rounded-xl mb-4">
                        <p className="text-sm text-emerald-600 mb-1">Son Ödeme Tarihi: {dormitoryData.paymentStatus.nextPayment}</p>
                        <h2 className="text-3xl font-bold text-emerald-700">{dormitoryData.paymentStatus.amount}</h2>
                        <Badge variant="success" className="mt-2">Ödendi</Badge>
                    </div>

                    <Button variant="primary" className="w-full">Ödeme Geçmişi</Button>
                </Card>

                {/* Permissions Table */}
                <Card className="lg:col-span-2">
                    <h3 className="font-bold text-lg text-slate-800 p-4 border-b border-slate-100">İzin Geçmişi</h3>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Tarih</th>
                                <th className="px-6 py-3">Tür</th>
                                <th className="px-6 py-3">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dormitoryData.permissions.map((perm, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-3 font-mono">{perm.date}</td>
                                    <td className="px-6 py-3">{perm.type}</td>
                                    <td className="px-6 py-3">
                                        <Badge variant={perm.status === 'Onaylandı' ? 'success' : 'warning'}>{perm.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card } from '../../components/ui';
