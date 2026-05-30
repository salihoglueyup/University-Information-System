import { motion } from 'framer-motion';
import { GraduationCap, Clock } from 'lucide-react';
import { useThesisStudents } from '../../../hooks/queries/useThesisStudents';

export default function ThesisWidget() {
    const { data: thesisStudents = [] } = useThesisStudents();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Tez/Proje Yönetimi</h2>
                        <p className="text-xs text-gray-400 font-medium">Öğrenci İlerleme Durumu</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
                    Tümünü Gör
                </button>
            </div>

            <div className="space-y-4">
                {thesisStudents.slice(0, 3).map((student) => (
                    <div key={student.id} className="group p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                                    {student.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">{student.projectTitle}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${student.progress >= 75 ? 'bg-green-100 text-green-700' :
                                    student.progress >= 40 ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                %{student.progress}
                            </span>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                                <span>İlerleme</span>
                                <span className="font-medium text-gray-600">{student.status}</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${student.progress >= 75 ? 'bg-green-500' :
                                            student.progress >= 40 ? 'bg-amber-500' :
                                                'bg-red-500'
                                        }`}
                                    style={{ width: `${student.progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Clock size={12} />
                                <span>Son Teslim: {new Date(student.deadline).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <button className="text-xs font-bold text-purple-600 hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors">
                                Detaylar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
