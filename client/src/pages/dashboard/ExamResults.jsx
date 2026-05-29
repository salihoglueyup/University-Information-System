
// Components

import { useExamResults } from '../../hooks/queries/useExams';

export default function ExamResults() {
    const { data: examResults = [] } = useExamResults();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Award className="text-emerald-500" /> Sınav Sonuçları
                    </h1>
                    <p className="text-slate-500 text-sm">Açıklanan vize, final ve proje notları</p>
                </div>
            </div>

            <div className="grid gap-6">
                {examResults.map((course, idx) => (
                    <Card key={idx} className="border-none shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="font-mono text-xs">{course.code}</Badge>
                                <h3 className="font-bold text-slate-800 text-lg">{course.name}</h3>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Ortalama</p>
                                    <p className="font-bold text-slate-800">{course.average}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Harf Notu</p>
                                    <Badge variant="success" className="text-lg w-10 justify-center">{course.letter}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Sınav Türü</th>
                                        <th className="px-6 py-3">Tarih</th>
                                        <th className="px-6 py-3 text-center">Etki Oranı</th>
                                        <th className="px-6 py-3 text-right">Puan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {course.exams.map((exam, eIdx) => (
                                        <tr
                                            key={eIdx}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                            onClick={() => window.location.href = `/dashboard/exam-result/${course.code}-${eIdx}`}
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                {exam.type}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{exam.date}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant="info" className="text-[10px]">%{exam.weight}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-800 text-base">
                                                {exam.score}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                ))}
            </div>

            {examResults.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                    <FileText size={48} className="opacity-20 mb-4" />
                    <p className="font-bold">Henüz açıklanan sınav sonucu bulunmamaktadır.</p>
                </div>
            )}
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Award, FileText } from 'lucide-react';
import { Badge, Card } from '../../components/ui';
