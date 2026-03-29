import { academicReports } from '../../data/mockData';

export default function AcademicReports() {
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
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <BarChart2 size={24} />
                        </div>
                        Akademik Raporlar
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Fakülte performansları ve öğrenci istatistikleri.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Toplam Öğrenci</p>
                        <h4 className="text-2xl font-bold text-gray-800">4,260</h4>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <TrendingUp size={12} /> +12% geçen yıla göre
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-purple-100 rounded-2xl text-purple-600">
                        <Award size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Genel Başarı Ort.</p>
                        <h4 className="text-2xl font-bold text-gray-800">2.84</h4>
                        <span className="text-xs font-bold text-gray-400">/ 4.00</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-orange-100 rounded-2xl text-orange-600">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Aktif Ders Sayısı</p>
                        <h4 className="text-2xl font-bold text-gray-800">842</h4>
                        <span className="text-xs font-bold text-blue-600">Bu dönem</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Faculty Stats Chart */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Fakülte Bazlı Öğrenci Dağılımı</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={academicReports.facultyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Öğrenci Sayısı" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Enrollment Trends */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Yıllara Göre Kayıt Eğilimi</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={academicReports.enrollmentTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line type="monotone" dataKey="students" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6 }} name="Kayıtlı Öğrenci" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
