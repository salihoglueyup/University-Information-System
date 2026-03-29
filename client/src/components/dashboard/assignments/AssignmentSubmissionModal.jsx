import { useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
export default function AssignmentSubmissionModal({ isOpen, onClose, assignment }) {
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen || !assignment) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', `${assignment.title} - Ödev Teslimi`);
            formData.append('type', 'Diğer');

            await axiosInstance.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
                    >
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{assignment.title}</h2>
                                    <p className="text-sm text-slate-500">{assignment.course}</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto space-y-6">
                                {/* Assignment Details */}
                                <div className="space-y-4">
                                    <div className="flex gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                                            <Clock size={16} />
                                            <span className="font-medium">Son Teslim: {assignment.dueDate}</span>
                                        </div>
                                        <Badge variant={assignment.status === 'Tamamlandı' ? 'success' : 'warning'}>
                                            {assignment.status}
                                        </Badge>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm leading-relaxed border border-slate-100">
                                        {assignment.description || "Bu ödev için detaylı açıklama girilmemiş. Lütfen ders notlarını kontrol edin."}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-4"></div>

                                {/* Submission Form */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                        <Upload size={18} className="text-blue-600" />
                                        Ödev Teslimi
                                    </h3>

                                    {/* File Upload Area */}
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50 group text-center cursor-pointer relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                        />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Paperclip size={24} />
                                            </div>
                                            {file ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">{file.name}</p>
                                                    <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="font-medium text-slate-600">Dosya yüklemek için tıklayın veya sürükleyin</p>
                                                    <p className="text-sm text-slate-400">PDF, DOCX, ZIP (Max 50MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Comment Section */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Öğrenci Notu (Opsiyonel)</label>
                                        <div className="border border-slate-200 rounded-xl overflow-hidden min-h-[100px]">
                                            <textarea
                                                className="w-full h-full p-3 text-sm text-slate-700 outline-none resize-none bg-slate-50/30 focus:bg-white transition-colors"
                                                placeholder="Eğitmeninize iletmek istediğiniz notlar..."
                                                rows="4"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                                <Button variant="ghost" onClick={onClose}>İptal</Button>
                                <Button
                                    disabled={!file || isSubmitting || isSuccess}
                                    onClick={handleSubmit}
                                    className={`min-w-[120px] ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Yükleniyor...
                                        </span>
                                    ) : isSuccess ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle size={18} />
                                            Gönderildi
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Upload size={18} />
                                            Teslim Et
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
