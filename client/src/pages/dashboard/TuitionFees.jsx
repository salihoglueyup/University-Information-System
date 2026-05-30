import { AlertCircle, CreditCard, Download, Landmark } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTuitionFees, usePayTuition } from '../../hooks/queries/useTuitionFees';

export default function TuitionFees() {
    const { data: tuitionFees = [] } = useTuitionFees();
    const payTuition = usePayTuition();

    const firstUnpaid = tuitionFees.find(f => f.status === 'Ödenmedi');

    const handlePay = (id) => {
        payTuition.mutate(id, {
            onSuccess: () => toast.success('Ödeme alındı.'),
            onError: () => toast.error('Ödeme yapılamadı.')
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
                        <Landmark className="text-emerald-600" /> Harç Bilgileri
                    </h1>
                    <p className="text-slate-500 text-sm">Dönemlik harç ödemeleri ve borç sorgulama</p>
                </div>
                <Button variant="primary" icon={CreditCard} disabled={!firstUnpaid || payTuition.isPending} onClick={() => firstUnpaid && handlePay(firstUnpaid.id)}>Online Ödeme Yap</Button>
            </div>

            {tuitionFees.some(f => f.status === 'Ödenmedi') && (
                <Alert variant="danger" title="Ödenmemiş Borç Uyarısı" icon={AlertCircle}>
                    Lütfen ders kaydı yapabilmek için 2025-2026 Bahar dönemi harç ödemenizi tamamlayınız.
                </Alert>
            )}

            <Card className="overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Dönem</th>
                            <th className="px-6 py-4">Tutar</th>
                            <th className="px-6 py-4">Son Ödeme</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">Dekont</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tuitionFees.map((fee) => (
                            <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{fee.term}</td>
                                <td className="px-6 py-4 font-mono">{fee.amount}</td>
                                <td className="px-6 py-4">{fee.date}</td>
                                <td className="px-6 py-4">
                                    {fee.status === 'Ödendi' ? (
                                        <Badge variant="success">Ödendi</Badge>
                                    ) : (
                                        <Badge variant="danger" className="animate-pulse">Ödenmedi</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {fee.status === 'Ödenmedi' ? (
                                        <Button variant="primary" size="sm" icon={CreditCard} disabled={payTuition.isPending} onClick={() => handlePay(fee.id)}>Öde</Button>
                                    ) : fee.receipt ? (
                                        <Button variant="ghost" size="sm" icon={Download} className="text-slate-500">İndir</Button>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {tuitionFees.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">Harç kaydı bulunmamaktadır.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 flex items-center gap-4 bg-slate-50 border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-sm">
                        <Landmark size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">Banka Hesap Bilgileri</h4>
                        <p className="text-xs text-slate-500">Vakıfbank - TR12 0001 5001 5000 0000 0001 02</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-slate-50 border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-sm">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">Taksit İmkanları</h4>
                        <p className="text-xs text-slate-500">World ve Maximum karta 6 taksit imkanı</p>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Alert, Badge, Button, Card } from '../../components/ui';
