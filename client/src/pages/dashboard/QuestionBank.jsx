import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Database, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { Button, Input, Modal, Select } from '../../components/ui';
import { useQuestions, useCreateQuestion, useDeleteQuestion } from '../../hooks/queries/useQuestions';

const DIFFICULTIES = ['Kolay', 'Orta', 'Zor'];
const TYPES = ['Klasik', 'Test', 'Doğru/Yanlış', 'Boşluk Doldurma'];

export default function QuestionBank() {
    const { data: questions = [] } = useQuestions();
    const createQuestion = useCreateQuestion();
    const deleteQuestion = useDeleteQuestion();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ text: '', course: '', topic: '', difficulty: 'Orta', type: 'Klasik' });

    // Distinct course codes present in the bank, for the filter dropdown.
    const courses = [...new Set(questions.map(q => q.course).filter(Boolean))];

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = (q.text || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (q.topic || '').toLowerCase().includes(searchTerm.toLowerCase());
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

    const handleSubmit = (e) => {
        e.preventDefault();
        createQuestion.mutate(form, {
            onSuccess: () => {
                toast.success('Soru eklendi.');
                setOpen(false);
                setForm({ text: '', course: '', topic: '', difficulty: 'Orta', type: 'Klasik' });
            },
            onError: (err) => toast.error(err?.response?.data?.message || 'Soru eklenemedi.')
        });
    };

    const handleDelete = (id) => {
        deleteQuestion.mutate(id, {
            onSuccess: () => toast.success('Soru silindi.'),
            onError: () => toast.error('Silme işlemi başarısız.')
        });
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
                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-200 transition-all"
                    >
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
                        {courses.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Questions Grid */}
                <div className="p-6 grid grid-cols-1 gap-4">
                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <Database size={32} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">Soru bulunamadı. İlk sorunuzu ekleyin.</p>
                        </div>
                    )}
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
                                        {q.course && (
                                            <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                                {q.course}
                                            </span>
                                        )}
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getDifficultyColor(q.difficulty)}`}>
                                            {q.difficulty}
                                        </span>
                                        {q.topic && (
                                            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                <Tag size={12} /> {q.topic}
                                            </span>
                                        )}
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
                                        <button
                                            onClick={() => handleDelete(q.id)}
                                            disabled={deleteQuestion.isPending}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Question Modal */}
            <Modal isOpen={open} onClose={() => setOpen(false)} title="Yeni Soru Ekle">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Soru Metni</label>
                        <textarea
                            value={form.text}
                            onChange={(e) => setForm({ ...form, text: e.target.value })}
                            required
                            rows={4}
                            placeholder="Soruyu buraya yazın..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Ders Kodu"
                            placeholder="BIL101"
                            value={form.course}
                            onChange={(e) => setForm({ ...form, course: e.target.value })}
                        />
                        <Input
                            label="Konu"
                            placeholder="Diziler"
                            value={form.topic}
                            onChange={(e) => setForm({ ...form, topic: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Zorluk"
                            value={form.difficulty}
                            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                            options={DIFFICULTIES.map(d => ({ value: d, label: d }))}
                        />
                        <Select
                            label="Tür"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            options={TYPES.map(t => ({ value: t, label: t }))}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                        <Button type="submit" variant="primary" disabled={createQuestion.isPending}>Ekle</Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
}
