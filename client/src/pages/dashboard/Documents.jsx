import { useState, useEffect } from 'react';
import { Download, Eye, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { FileText, FileBadge } from 'lucide-react';
import { toast } from 'react-toastify';

// Components
import axiosInstance from '../../api/axiosInstance';
import { Alert, Badge, Button, Card } from '../../components/ui';

export default function Documents() {
    const [documentsData, setDocumentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const res = await axiosInstance.get('/documents');
            setDocumentsData(res.data || []);
        } catch (err) {
            console.error('Belgeler çekilemedi', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);

        setUploading(true);
        try {
            await axiosInstance.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchDocs(); // Refresh list after successful upload
        } catch (err) {
            console.error('Yükleme hatası', err);
            toast.error('Dosya yüklenemedi.');
        } finally {
            setUploading(false);
        }
    };

    const downloadFile = async (fileUrl, fileName) => {
        try {
            const res = await axiosInstance.get(fileUrl, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'document');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Dosya indirilemedi', err);
            toast.error('Dosya indirilemedi.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="text-blue-600" /> Form ve Belgeler
                    </h1>
                    <p className="text-slate-500 text-sm">Resmi öğrenci belgeleri talep, yükleme ve görüntüleme ekranı</p>
                </div>
                <div>
                    <input
                        type="file"
                        id="doc-upload"
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <label htmlFor="doc-upload">
                        <Button
                            variant="primary"
                            icon={Upload}
                            as="span"
                            className="cursor-pointer"
                            disabled={uploading}
                        >
                            {uploading ? 'Yükleniyor...' : 'Yeni Belge Yükle'}
                        </Button>
                    </label>
                </div>
            </div>

            <Alert variant="info" title="E-İmzalı Belgeler Hakkında">
                Buradan alacağınız "E-İmzalı" ibareli belgeler resmi evrak niteliğinde olup, barkod numarası ile doğrulanabilir.
                Islak imza gerektirmez.
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                {documentsData.map((doc) => (
                    <Card key={doc._id || doc.id} className="hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileBadge size={20} />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge variant="secondary" className="text-[10px]">{doc.type}</Badge>
                                <span className="text-[9px] text-slate-400">{doc.size || ''}</span>
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-800 mb-6 group-hover:text-blue-700 transition-colors line-clamp-2" title={doc.title || doc.name}>
                            {doc.title || doc.name}
                        </h3>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                icon={Eye}
                                onClick={() => {
                                    if (doc.fileUrl) window.open(doc.fileUrl, '_blank');
                                }}
                            >
                                Onizle
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                icon={Download}
                                onClick={() => downloadFile(doc.fileUrl, doc.title)}
                            >
                                İndir
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
