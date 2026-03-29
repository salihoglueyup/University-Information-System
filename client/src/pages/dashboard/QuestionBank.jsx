import { useState } from 'react';
import { questionBank, courseCatalog } from '../../data/mockData';

export default function QuestionBank() {
    const [questions] = useState(questionBank);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('all');

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourse === 'all' || q.course === selectedCourse;
        return matchesSearch && matchesCourse;
    });

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Kolay': return 'bg-green-100 text-green-700';
            case 'Orta': return 'bg-yellow-100 text-yellow-700';
            case 'Zor': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

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
                        <div className="p-2 bg-violet-50 rounded-xl text-violet-600">
                            <Database size={24} />
                        </div>
                        Soru Bankası
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Vize ve final sınavları için soru havuzu oluşturun.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-200 transition-all">
                        <Plus size={18} />
                        Soru Ekle
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Soru metni veya konu ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                        />
                    </div>

                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    >
                        <option value="all">Tüm Dersler</option>
                        {courseCatalog.map(c => (
                            <option key={c.id} value={c.id}>{c.courseName}</option>
                        ))}
                    </select>
                </div>

                {/* Questions Grid */}
                <div className="p-6 grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {filteredQuestions.map((q) => (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                            {q.course}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getDifficultyColor(q.difficulty)}`}>
                                            {q.difficulty}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                            <Tag size={12} /> {q.topic}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {q.date}
                                    </div>
                                </div>

                                <p className="text-gray-800 font-medium mb-4 line-clamp-2">
                                    {q.text}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">
                                        {q.type}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
