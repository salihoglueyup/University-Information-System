import { useState, useEffect } from 'react';
import { BarChart2, BookOpen, DollarSign, TrendingUp, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';
import axiosInstance from '../../api/axiosInstance';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Ensure auth token is sent (axios interceptor or local storage logic is handled elsewhere, but assuming config handles it)
                const res = await axiosInstance.get('/analytics');
                setAnalyticsData(res.data);
            } catch (error) {
                console.error("Analitik verisi çekilemedi", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!analyticsData) {
        return <div className="p-6 text-center text-red-500">Analitik verisi yüklenemedi. Lütfen yetkilerinizi kontrol edin (Sadece Admin).</div>;
    }

    const { kpis, financeData, campusUsageData } = analyticsData;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sistem Analitiği"
                description="Kampüs genelindeki finansal, akademik ve sosyal verilerin analizi."
                icon={BarChart2}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Toplam Gelir</p>
                            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">₺{(kpis.totalRevenue / 1000000).toFixed(1)}M</h3>
                        </div>
                        <DollarSign className="text-green-500" />
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
                        <TrendingUp size={12} className="mr-1" /> Bu yılki net kazanç
                    </p>
                </Card>
                <Card className="p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Aktif Öğrenci</p>
                            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{kpis.activeStudentsCount.toLocaleString()}</h3>
                        </div>
                        <Users className="text-blue-500" />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center">
                        <TrendingUp size={12} className="mr-1" /> Güncel Kayıtlı
                    </p>
                </Card>
                <Card className="p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Burs Oranı</p>
                            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">%{kpis.scholarshipRate}</h3>
                        </div>
                        <BookOpen className="text-purple-500" />
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Bugünkü Sistem Girişi</p>
                            <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">{kpis.dailyLoginCount.toLocaleString()}</h3>
                        </div>
                        <Users className="text-orange-500" />
                    </div>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Fakülte Bazlı Finansal Dağılım</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                                <YAxis tick={{ fill: '#64748b' }} />
                                <Tooltip formatter={(value) => `₺${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="revenue" name="Gelir" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="scholarship" name="Burs Miktarı" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Kampüs Alan Kullanımı</h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={campusUsageData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {campusUsageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};
import { Card, PageHeader } from '../../components/ui';

export default Analytics;
