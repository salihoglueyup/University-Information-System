import { useState } from 'react';
import { BarChart, BookOpen, Building, GraduationCap, TrendingUp, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';


// Mock Data
const ENROLLMENT_DATA = [
    { year: '2019', lisans: 4000, onLisans: 2400, yuksekLisans: 800 },
    { year: '2020', lisans: 4500, onLisans: 2800, yuksekLisans: 950 },
    { year: '2021', lisans: 5100, onLisans: 3100, yuksekLisans: 1100 },
    { year: '2022', lisans: 5800, onLisans: 3600, yuksekLisans: 1300 },
    { year: '2023', lisans: 6200, onLisans: 4100, yuksekLisans: 1550 },
    { year: '2024', lisans: 7100, onLisans: 4800, yuksekLisans: 1800 },
];

const FACULTY_DISTRIBUTION = [
    { name: 'Mühendislik', value: 3500 },
    { name: 'İİBF', value: 4200 },
    { name: 'Tıp', value: 1200 },
    { name: 'Diş Hekimliği', value: 800 },
    { name: 'Hukuk', value: 2100 },
    { name: 'İletişim', value: 1900 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StatsWidget = ({ title, value, trend, icon: _Icon, colorClass, bgColorClass }) => (
    <Card className="overflow-hidden relative group">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/0 transform group-hover:scale-150 transition-transform duration-500 ease-in-out" />
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgColorClass} ${colorClass}`}>
                    <_Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {trend.startsWith('+') && <TrendingUp className="w-4 h-4" />}
                    {trend}
                </div>
            </div>
            <div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
                <div className="text-sm font-medium text-slate-500">{title}</div>
            </div>
        </div>
    </Card>
);

const Stats = () => {
    const [timeRange, setTimeRange] = useState('year');

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sistem İstatistikleri"
                description="Üniversite genelindeki öğrenci, personel ve akademik performansı izleyin."
                icon={BarChart}
                breadcrumbs={[
                    { label: 'Gösterge Paneli', path: '/dashboard' },
                    { label: 'Yönetim', path: '/dashboard/stats' },
                    { label: 'İstatistikler' }
                ]}
            />

            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">Genel Bakış</h3>
                <Select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-48"
                    options={[
                        { value: 'term', label: 'Bu Dönem' },
                        { value: 'year', label: 'Bu Yıl' },
                        { value: 'all', label: 'Tüm Zamanlar' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsWidget
                    title="Toplam Aktif Öğrenci"
                    value="13,700"
                    trend="+12% (Yıllık)"
                    icon={Users}
                    colorClass="text-blue-600"
                    bgColorClass="bg-blue-100"
                />
                <StatsWidget
                    title="Akademik Personel"
                    value="845"
                    trend="+3% (Yıllık)"
                    icon={GraduationCap}
                    colorClass="text-emerald-600"
                    bgColorClass="bg-emerald-100"
                />
                <StatsWidget
                    title="Açılan Dersler"
                    value="2,104"
                    trend="Sabit"
                    icon={BookOpen}
                    colorClass="text-indigo-600"
                    bgColorClass="bg-indigo-100"
                />
                <StatsWidget
                    title="Kampüs Doluluk"
                    value="%78"
                    trend="Yoğun"
                    icon={Building}
                    colorClass="text-amber-600"
                    bgColorClass="bg-amber-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800">Öğrenci Kayıt Trendleri (Son 6 Yıl)</h3>
                        <p className="text-sm text-slate-500">Derece düzeyine göre yıllık yeni kayıt istatistikleri.</p>
                    </div>
                    <div className="p-6 h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                                data={ENROLLMENT_DATA}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="lisans" name="Lisans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="onLisans" name="Ön Lisans" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="yuksekLisans" name="Yük. Lisans/Doktora" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-800">Fakülte Dağılımı</h3>
                        <p className="text-sm text-slate-500">Aktif öğrencilerin fakültelere göre dağılımı.</p>
                    </div>
                    <div className="p-6 h-[400px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={FACULTY_DISTRIBUTION}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={130}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {FACULTY_DISTRIBUTION.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value} Öğrenci`, 'Kayıtlı']}
                                />
                                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};
import { Card, PageHeader, Select } from '../../components/ui';

export default Stats;
