import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useCourseDetail } from '../../hooks/queries/useCourseDetail';
import { toast } from 'react-hot-toast';

export default function ResourceHub() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading: loading } = useCourseDetail(courseId);
    const [viewMode, setViewMode] = useState('list'); // 'grid' | 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [localResources, setLocalResources] = useState(null);
    const resources = localResources || data?.resources || { categories: [] };
    // Mock upload state
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = () => {
        setUploading(true);
        // Simulate upload
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setUploading(false);
                    setUploadProgress(0);
                    toast.success("Dosya başarıyla yüklendi!");
                    // Mock add file
                    const newFile = {
                        id: `new-${Date.now()}`,
                        name: "Yeni Ders Kaydı.pdf",
                        type: "pdf",
                        size: "1.5MB",
                        date: new Date().toLocaleDateString('tr-TR'),
                        downloads: 0
                    };
                    // Ideally we'd update the state deep here, this is simplified
                    const newCats = [...resources.categories];
                    if (newCats.length > 0) newCats[0].files.push(newFile);
                    setLocalResources({ ...resources, categories: newCats });
                }, 500);
            }
        }, 300);
    };

    const getAllFiles = () => {
        if (!resources.categories) return [];
        return resources.categories.flatMap(cat => cat.files.map(f => ({ ...f, category: cat.name })));
    };

    const filteredFiles = activeCategory === 'all'
        ? getAllFiles()
        : resources.categories.find(c => c.id === activeCategory)?.files || [];

    const searchResults = filteredFiles.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(`/dashboard/course/${courseId}`)}>
                    <ArrowLeft size={18} className="mr-2" />
                    Ders Detayına Dön
                </Button>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Dosya ara..."
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Sidebar */}
                <Card className="w-64 flex-shrink-0 flex flex-col p-4 bg-white/50 h-full">
                    <Button variant="primary" className="mb-6" onClick={handleUpload} disabled={uploading}>
                        <Upload size={18} className="mr-2" />
                        Dosya Yükle
                    </Button>

                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-2">Kategoriler</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Grid size={18} />
                            Tüm Dosyalar
                        </button>
                        {resources.categories?.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <Folder size={18} />
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t">
                        <div className="px-2 mb-2 flex justify-between text-xs text-gray-500">
                            <span>Depolama</span>
                            <span>%45</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[45%]" />
                        </div>
                    </div>
                </Card>

                {/* File Area */}
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">{activeCategory === 'all' ? 'Tüm Dosyalar' : resources.categories.find(c => c.id === activeCategory)?.name}</span>
                            <span className="px-2 py-0.5 bg-gray-200 rounded-full text-xs">{searchResults.length} dosya</span>
                        </div>
                        <div className="flex bg-white rounded-lg border p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Grid size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 relative">
                        {uploading && (
                            <div className="absolute top-0 left-0 right-0 z-10 bg-blue-50 p-3 flex items-center gap-4 transition-all border-b border-blue-100">
                                <div className="text-sm font-medium text-blue-700 w-24">Yükleniyor...</div>
                                <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <div className="text-sm font-bold text-blue-700">{uploadProgress}%</div>
                            </div>
                        )}

                        {viewMode === 'list' ? (
                            <div className="space-y-2">
                                {searchResults.map((file) => (
                                    <div key={file.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg group border border-transparent hover:border-gray-200 transition-all">
                                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-4">
                                            {file.type === 'pdf' ? <FileText size={20} /> : <File size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                                            <div className="flex text-xs text-gray-500 mt-0.5 gap-3">
                                                <span>{file.date}</span>
                                                <span>{file.size}</span>
                                                {/* <span>{file.category}</span> */}
                                            </div>
                                        </div>
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                            <Button variant="ghost" size="icon">
                                                <Download size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600">
                                                <Trash2 size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {searchResults.map((file) => (
                                    <div key={file.id} className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-white">
                                        <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            {file.type === 'pdf' ? <FileText size={32} /> : <File size={32} />}
                                        </div>
                                        <h4 className="font-medium text-gray-900 text-sm truncate" title={file.name}>{file.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{file.size}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchResults.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-gray-900 font-medium">Dosya bulunamadı</h3>
                                <p className="text-gray-500 text-sm mt-1">Farklı bir arama terimi deneyin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
