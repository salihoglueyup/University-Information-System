import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, CheckCircle, Clock, CreditCard, Wallet } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export default function Payments() {
    const [paymentsData, setPaymentsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await axiosInstance.get('/payments');
            const data = res.data;
            setPaymentsData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayTuition = async (installmentId) => {
        try {
            await axiosInstance.post('/payments/pay-tuition', { installmentId });

            // Re-fetch to update UI
            fetchPayments();
            toast.success('Ödeme başarıyla tamamlandı!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const { transactions, tuition, cards } = paymentsData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Finans ve Cüzdan</h1>
                    <p className="text-slate-500 text-sm">Harç ödemeleri ve kampüs içi harcamalarınız</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Kampüs Kartlarım & Cüzdan */}
                <div className="space-y-6 lg:col-span-1">
                    {cards.map(card => (
                        <div key={card.id} className={`p-6 rounded-2xl text-white shadow-lg ${card.theme} relative overflow-hidden group`}>
                            {/* Card Decoration */}
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

                            <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                                <div className="flex justify-between items-start">
                                    <div className="text-white/80 font-medium text-sm">{card.bank}</div>
                                    <CreditCard size={24} className="text-white/80" />
                                </div>
                                <div className="mt-4 mb-2">
                                    <div className="text-3xl font-bold tracking-tight">{card.balance}</div>
                                    <div className="text-white/60 text-xs mt-1 uppercase tracking-wider">{card.type}</div>
                                </div>
                                <div className="flex justify-between items-end mt-4 text-sm font-mono text-white/90">
                                    <div>{card.number}</div>
                                    <div className="text-xs">{card.expiry}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Card title="Son İşlemler" className="h-auto">
                        <div className="space-y-4">
                            {transactions.slice(0, 5).map(tx => (
                                <div key={tx._id || tx.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors p-2 -mx-2 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl flex-shrink-0 ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {tx.type === 'income' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{tx.title}</p>
                                            <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('tr-TR')} • {tx.category}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-slate-800'}`}>
                                        {tx.type === 'income' ? '+' : ''}{tx.amount} ₺
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Harç Ödemeleri */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-xl border-none">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                            <div>
                                <div className="text-slate-400 text-sm font-medium mb-1">Eğitim Ücreti (Yıllık)</div>
                                <div className="text-sm border border-slate-700 bg-slate-800/50 rounded-lg px-3 py-1.5 inline-flex items-center gap-2 mb-3">
                                    <span className="text-yellow-400">★</span> Burs: {tuition.scholarship}
                                </div>
                                <div className="text-3xl font-bold">{tuition.totalAmount.toLocaleString('tr-TR')} ₺</div>
                            </div>
                            <div className="flex items-center gap-8 md:text-right">
                                <div>
                                    <div className="text-emerald-400 text-sm font-medium mb-1">Ödenen</div>
                                    <div className="text-xl font-bold">{tuition.paidAmount.toLocaleString('tr-TR')} ₺</div>
                                </div>
                                <div className="w-px h-12 bg-slate-700"></div>
                                <div>
                                    <div className="text-rose-400 text-sm font-medium mb-1">Kalan</div>
                                    <div className="text-xl font-bold">{(tuition.totalAmount - tuition.paidAmount).toLocaleString('tr-TR')} ₺</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Ödeme Planı ve Taksitler">
                        <div className="space-y-4">
                            {tuition.installments.map(inst => (
                                <div key={inst._id} className="border border-slate-100 rounded-xl p-5 hover:border-slate-300 transition-all bg-white shadow-sm">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl mt-1 ${inst.status === 'Ödendi' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {inst.status === 'Ödendi' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg">{inst.term} Harç Bedeli</h4>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-1">
                                                    <span>Son Ödeme: {new Date(inst.date).toLocaleDateString('tr-TR')}</span>
                                                    <span>•</span>
                                                    <span>{inst.amount.toLocaleString('tr-TR')} ₺</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-2">
                                            <Badge variant={inst.status === 'Ödendi' ? 'success' : 'warning'} className="w-fit">
                                                {inst.status}
                                            </Badge>
                                            {inst.status !== 'Ödendi' ? (
                                                <Button size="sm" variant="primary" icon={Wallet} className="mt-2" onClick={() => handlePayTuition(inst._id)}>
                                                    Hemen Öde
                                                </Button>
                                            ) : (
                                                <Button size="xs" variant="ghost" className="mt-2 text-slate-400">Makbuz İndir</Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
import { Badge, Button, Card } from '../../components/ui';
