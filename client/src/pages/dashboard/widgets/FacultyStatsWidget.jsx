
export default function FacultyStatsWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                        <BarChart2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Fakülte İstatistikleri</h2>
                        <p className="text-xs text-gray-400 font-medium">Genel Durum</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select className="text-xs bg-gray-50 border-gray-200 rounded-lg px-2 py-1 outline-none text-gray-600">
                        <option>Bu Dönem</option>
                        <option>Geçen Dönem</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-blue-500" />
                        <span className="text-xs font-bold text-gray-500">Toplam Öğrenci</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">1,245</p>
                    <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1">
                        <TrendingUp size={10} /> +%5 Geçen Yıla Göre
                    </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={16} className="text-purple-500" />
                        <span className="text-xs font-bold text-gray-500">Açılan Ders</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">84</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">
                        %92 Doluluk Oranı
                    </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-orange-500" />
                        <span className="text-xs font-bold text-gray-500">Akademik Kadro</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">42</p>
                    <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1">
                        <TrendingUp size={10} /> +2 Yeni Katılım
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
