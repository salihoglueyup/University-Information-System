import { financialReports } from '../../data/mockData';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';

export default function FinancialReports() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                            <DollarSign size={24} />
                        </div>
                        Mali Raporlar
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Ödeme durumları, gelir akışı ve burs istatistikleri.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                        <Wallet size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Toplam Gelir (Yıllık)</p>
                        <h4 className="text-2xl font-bold text-gray-800">₺45.2M</h4>
                        <span className="text-xs font-bold text-green-600">+8.5% beklenti üzeri</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600">
                        <CreditCard size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Tahsilat Oranı</p>
                        <h4 className="text-2xl font-bold text-gray-800">88%</h4>
                        <span className="text-xs font-bold text-gray-400">Geçen yıl: 85%</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-rose-100 rounded-2xl text-rose-600">
                        <PieChart size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Bekleyen Ödeme</p>
                        <h4 className="text-2xl font-bold text-gray-800">₺2.4M</h4>
                        <span className="text-xs font-bold text-red-500">200 Öğrenci</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Status Pie Chart */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Ödeme Durumu Dağılımı</h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={financialReports.paymentStats || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(financialReports.paymentStats || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Line Chart */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Aylık Tahsilat Grafiği</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialReports.monthlyRevenue || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, PieChart, Wallet } from 'lucide-react';
