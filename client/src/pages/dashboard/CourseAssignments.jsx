import { useState } from 'react';
import { courseCatalog, allUsers } from '../../data/mockData';

export default function CourseAssignments() {
    const [assignments, setAssignments] = useState(courseCatalog.map(c => ({
        ...c,
        instructor: null // Initial state, no instructor assigned
    })));
    const [searchTerm, setSearchTerm] = useState('');

    const instructors = allUsers.filter(u => u.role === 'academic');

    const handleAssign = (courseId, instructorId) => {
        const instructor = instructors.find(i => i.id === parseInt(instructorId));
        setAssignments(assignments.map(a =>
            a.id === courseId ? { ...a, instructor: instructor ? instructor.name : null } : a
        ));
    };

    const filteredAssignments = assignments.filter(a =>
        a.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                            <Briefcase size={24} />
                        </div>
                        Ders Atamaları
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Dönem dersleri için öğretim elemanı görevlendirmelerini yapın.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Ders ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ders Kodu</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ders Adı</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Bölüm</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Atanan Öğretim Elemanı</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {filteredAssignments.map((assignment) => (
                                    <motion.tr
                                        key={assignment.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group hover:bg-teal-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-teal-600">
                                            {assignment.id}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {assignment.courseName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {assignment.department}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <select
                                                    value={instructors.find(i => i.name === assignment.instructor)?.id || ""}
                                                    onChange={(e) => handleAssign(assignment.id, e.target.value)}
                                                    className={`w-full appearance-none pl-3 pr-8 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-all cursor-pointer ${assignment.instructor
                                                            ? 'bg-white border-gray-200 text-gray-800'
                                                            : 'bg-red-50 border-red-200 text-red-500'
                                                        }`}
                                                >
                                                    <option value="">Seçiniz...</option>
                                                    {instructors.map(inst => (
                                                        <option key={inst.id} value={inst.id}>
                                                            {inst.title} {inst.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <UserPlus size={16} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {assignment.instructor ? (
                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold">
                                                    <CheckCircle size={14} /> Atandı
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold animate-pulse">
                                                    <AlertCircle size={14} /> Bekleniyor
                                                </div>
                                            )}
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
import { AlertCircle, Briefcase, CheckCircle, Search, UserPlus } from 'lucide-react';
