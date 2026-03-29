import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function Logs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [systemLogs, setSystemLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Read token to send because this is an admin protected route
                const res = await axiosInstance.get('/logs');
                const data = res.data;

                const mappedLogs = data.map(log => ({
                    id: log._id,
                    user: log.user,
                    action: log.action,
                    status: log.status,
                    date: new Date(log.createdAt).toLocaleString('tr-TR'),
                    ip: log.ip
                }));

                setSystemLogs(mappedLogs);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filteredLogs = systemLogs.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'error' && log.status === 'error') ||
            (filter === 'success' && log.status === 'success');
        return matchesSearch && matchesFilter;
    });

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
                        <div className="p-2 bg-gray-100 rounded-xl text-gray-600">
                            <Shield size={24} />
                        </div>
                        Sistem Logları
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Kullanıcı aktiviteleri, hatalar ve sistem işlemlerini izleyin.
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Kullanıcı veya işlem ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            Tümü
                        </button>
                        <button
                            onClick={() => setFilter('success')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            Başarılı
                        </button>
                        <button
                            onClick={() => setFilter('error')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            Hatalı
                        </button>
                    </div>
                </div>

                {/* Log List */}
                <div className="max-h-[600px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Kullanıcı</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">İşlem</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tarih</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">IP Adresi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence>
                                    {filteredLogs.map((log) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                {log.status === 'success' ? (
                                                    <div className="flex items-center gap-2 text-green-600">
                                                        <CheckCircle size={16} />
                                                        <span className="text-xs font-bold uppercase">Başarılı</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-red-600">
                                                        <AlertTriangle size={16} />
                                                        <span className="text-xs font-bold uppercase">Hata</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-800">{log.user}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {log.action}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg w-fit">
                                                    <Clock size={12} />
                                                    {log.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-gray-400">
                                                {log.ip}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                            {filteredLogs.length === 0 && (
                                <tbody className="divide-y divide-transparent">
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-400">
                                            Log kaydı bulunamadı...
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
