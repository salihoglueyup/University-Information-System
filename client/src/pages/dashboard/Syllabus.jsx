import { useState } from 'react';
import { syllabusData, courseCatalog } from '../../data/mockData';

export default function Syllabus() {
    const [weeks] = useState(syllabusData);
    const [selectedCourse, setSelectedCourse] = useState(courseCatalog[0].id);

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
                        <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                            <BookOpen size={24} />
                        </div>
                        Ders İzlencesi (Syllabus)
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Haftalık ders konuları ve kaynak yönetimi.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-200 transition-all">
                        <Download size={18} />
                        PDF İndir
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all">
                        <Plus size={18} />
                        Hafta Ekle
                    </button>
                </div>
            </div>

            {/* Course Selector */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4 overflow-x-auto">
                <span className="text-sm font-bold text-gray-500 whitespace-nowrap">Ders Seçimi:</span>
                {courseCatalog.map(course => (
                    <button
                        key={course.id}
                        onClick={() => setSelectedCourse(course.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCourse === course.id
                            ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-500/20'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {course.courseName}
                    </button>
                ))}
            </div>

            {/* Weeks List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {weeks.map((week) => (
                        <motion.div
                            key={week.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-amber-200 group"
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-shrink-0 w-16 h-16 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-amber-600 font-bold border border-amber-100">
                                    <span className="text-xs uppercase opacity-70">Hafta</span>
                                    <span className="text-2xl">{week.week}</span>
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                                        {week.topic}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                                            <Folder size={14} className="text-blue-500" />
                                            {week.resources}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                                        <FileText size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-3xl text-gray-400 font-bold flex items-center justify-center gap-2 hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50/50 transition-all"
                >
                    <Plus size={20} />
                    Yeni Hafta Ekle
                </motion.button>
            </div>
        </motion.div>
    );
}
