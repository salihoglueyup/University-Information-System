import { useState } from 'react';
import { publications } from '../../data/mockData';

export default function Publications() {
    const [pubList] = useState(publications);
    const [searchTerm, setSearchTerm] = useState('');

    const totalPoints = pubList.reduce((acc, curr) => acc + curr.points, 0);

    const filteredPubs = pubList.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                            <BookOpen size={24} />
                        </div>
                        Yayın ve Projeler
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Akademik üretkenlik ve teşvik puanı takibi.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all">
                        <Plus size={18} />
                        Yeni Yayın Ekle
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-indigo-100 font-medium mb-1">Toplam Teşvik Puanı</p>
                        <h3 className="text-3xl font-bold">{totalPoints}</h3>
                        <div className="mt-4 flex items-center gap-2 text-sm bg-white/20 px-3 py-1.5 rounded-lg w-fit backdrop-blur-sm">
                            <Award size={16} />
                            <span>Hedef: 60 Puan</span>
                        </div>
                    </div>
                    <Trophy className="absolute -right-4 -bottom-4 text-white/20 w-32 h-32" />
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
                        <FileText size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Toplam Yayın</p>
                        <h4 className="text-2xl font-bold text-gray-800">{pubList.length}</h4>
                        <span className="text-xs font-bold text-gray-400">Son 5 yıl</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Yayın başlığı ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Yayın Başlığı</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tür</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Yıl</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Puan</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {filteredPubs.map((pub) => (
                                    <motion.tr
                                        key={pub.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {pub.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {pub.type}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-gray-500">
                                            {pub.year}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">
                                                {pub.points}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-600">
                                                {pub.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, FileText, Plus, Search, Trophy } from 'lucide-react';
