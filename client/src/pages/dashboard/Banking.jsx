import { ArrowDownLeft, ArrowUpRight, CreditCard, ShieldCheck, Wallet } from 'lucide-react';

// Components

// Mock Data
import { bankData } from '../../data/mockData';

export default function Banking() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Wallet className="text-indigo-600" /> Banka / Kart İşlemleri
                    </h1>
                    <p className="text-slate-500 text-sm">Kampüs kart bakiyesi ve hesap hareketleri</p>
                </div>
                <Button variant="primary" icon={ArrowDownLeft}>Para Yükle</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Cards Section */}
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                    {bankData.cards.map((card) => (
                        <div key={card.id} className={`p-6 rounded-2xl shadow-lg relative overflow-hidden text-white ${card.theme}`}>
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <CreditCard size={100} />
                            </div>

                            <div className="relative z-10 flex justify-between items-start mb-8">
                                <span className="text-sm font-bold uppercase tracking-wider opacity-80">{card.bank}</span>
                                <ShieldCheck size={20} className="opacity-60" />
                            </div>

                            <div className="relative z-10 mb-8">
                                <span className="block text-3xl font-mono tracking-widest drop-shadow-md">{card.balance}</span>
                                <span className="text-xs opacity-70">Kullanılabilir Bakiye</span>
                            </div>

                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <span className="block text-xs uppercase opacity-70 mb-1">Kart Sahibi</span>
                                    <span className="font-bold tracking-wide">{card.holder}</span>
                                </div>
                                <div>
                                    <span className="block text-xs uppercase opacity-70 mb-1 text-right">SKT</span>
                                    <span className="font-mono">{card.expiry}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Stats / Spending */}
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <PieChart className="text-slate-400" /> Harcama Analizi
                    </h3>
                    <div className="space-y-4">
                        {bankData.spendingData.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                                    <span className="font-medium text-slate-700">{item.category}</span>
                                </div>
                                <span className="font-bold text-slate-800">{item.amount} ₺</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Transactions */}
                <Card className="lg:col-span-3 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Son İşlemler</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Açıklama</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4 text-right">Tutar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bankData.transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                {tx.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            {tx.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary">{tx.category}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">{tx.date}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                            {tx.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card } from '../../components/ui';
