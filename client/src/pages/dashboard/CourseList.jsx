import { useState, useMemo } from 'react';
import { BookOpen, Edit2, Filter, Search, Trash2 } from 'lucide-react';

// Components

export default function CourseList({ courses, onEdit, onDelete }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('ALL');

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSemester = semesterFilter === 'ALL' || course.semester.toString() === semesterFilter;
            return matchesSearch && matchesSemester;
        });
    }, [courses, searchTerm, semesterFilter]);

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Ders adı veya kodu ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none"
                            value={semesterFilter}
                            onChange={(e) => setSemesterFilter(e.target.value)}
                        >
                            <option value="ALL">Tüm Dönemler</option>
                            <option value="1">1. Yarıyıl</option>
                            <option value="2">2. Yarıyıl</option>
                            <option value="3">3. Yarıyıl</option>
                            <option value="4">4. Yarıyıl</option>
                            <option value="5">5. Yarıyıl</option>
                            <option value="6">6. Yarıyıl</option>
                            <option value="7">7. Yarıyıl</option>
                            <option value="8">8. Yarıyıl</option>
                        </select>
                    </div>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                    {filteredCourses.length} ders listeleniyor
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Kod</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ders Adı</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Bölüm</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Kredi / AKTS</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Yarıyıl</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Tip</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <AnimatePresence mode='popLayout'>
                            {filteredCourses.map((course) => (
                                <motion.tr
                                    key={course.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group hover:bg-indigo-50/30 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-xs">
                                            {course.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800 text-sm">{course.courseName}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                        {course.department}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                            <span>{course.credit} Kr</span>
                                            <span className="w-px h-3 bg-gray-300"></span>
                                            <span>{course.ects} AKTS</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                                        {course.semester}. Yarıyıl
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${course.type === 'Zorunlu'
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-green-50 text-green-600'
                                            }`}>
                                            {course.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={Edit2}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600 icon-lg"
                                                onClick={() => onEdit && onEdit(course)}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={Trash2}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 icon-lg"
                                                onClick={() => onDelete && onDelete(course.id)}
                                            />
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                {filteredCourses.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Kayıtlı ders bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui';
