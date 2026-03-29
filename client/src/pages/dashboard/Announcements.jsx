import { useState, useEffect } from 'react';
import { Megaphone, Calendar, FileText, AlertCircle, Plus } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { getUser } from '../../utils/authStorage';

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Admin Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategory, setNewCategory] = useState('genel');
    const [newPriority, setNewPriority] = useState('normal');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock role check (Ideally from Auth Context)
    const userRole = getUser()?.role || 'student';

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.get('/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error("Duyurular getirilemedi", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAnnouncement = async () => {
        if (!newTitle.trim() || !newContent.trim()) {
            alert('Lütfen başlık ve içeriği doldurun.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Need to handle token if backend requires it. Assuming axios config or just passing it if protected.
            await axiosInstance.post('/announcements', {
                title: newTitle,
                text: newContent,
                category: newCategory,
                priority: newPriority,
                author: getUser()?.name || 'Sistem Yöneticisi'
            });

            // Reset form & refresh list
            setNewTitle('');
            setNewContent('');
            setNewCategory('genel');
            setNewPriority('normal');
            setIsAddModalOpen(false);
            await fetchAnnouncements();

        } catch (error) {
            console.error('Duyuru eklenirken hata:', error);
            alert("Duyuru oluşturulamadı.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { id: 'all', label: 'Tümü' },
        { id: 'genel', label: 'Genel' },
        { id: 'fakulte', label: 'Fakülte' },
        { id: 'ders', label: 'Ders/Etkinlik' }
    ];

    const getCategoryConfig = (category) => {
        const configs = {
            academic: { color: 'blue', icon: FileText, label: 'Akademik' },
            administrative: { color: 'amber', icon: AlertCircle, label: 'İdari' },
            events: { color: 'emerald', icon: Calendar, label: 'Etkinlik' },
            genel: { color: 'blue', icon: Megaphone, label: 'Genel' },
            fakulte: { color: 'amber', icon: FileText, label: 'Fakülte' },
            ders: { color: 'emerald', icon: Calendar, label: 'Ders' }
        };
        // Normalize categories for styling
        const normalized = category?.toLowerCase() || 'genel';
        return configs[normalized] || configs.genel;
    };

    const filteredAnnouncements = announcements.filter(ann => {
        const matchesTab = activeTab === 'all' || (ann.category?.toLowerCase() || ann.type?.toLowerCase()) === activeTab;
        const searchTarget = (ann.title + ' ' + ann.text).toLowerCase();
        const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="Duyurular & Haberler"
                    description="Üniversite genelindeki tüm güncel duyuru ve etkinliklerden haberdar olun."
                    icon={Megaphone}
                />
                {(userRole === 'admin' || userRole === 'academic') && (
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                        icon={Plus}
                    >
                        Yeni Duyuru
                    </Button>
                )}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg overflow-x-auto w-full md:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === cat.id
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Duyrularda ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
            </div>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map((announcement, index) => {
                        const styleConfig = getCategoryConfig(announcement.category || announcement.type);
                        const Icon = styleConfig.icon;
                        const borderClass = announcement.priority === 'high'
                            ? 'border-l-red-500'
                            : announcement.priority === 'urgent'
                                ? 'border-l-purple-500'
                                : `border-l-${styleConfig.color}-500`;

                        return (
                            <motion.div
                                key={announcement._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Card className={`h-full border-l-4 overflow-hidden relative group hover:shadow-md transition-shadow cursor-pointer ${borderClass}`}>
                                    {(announcement.priority === 'high' || announcement.priority === 'urgent') && (
                                        <div className={`absolute top-0 right-0 ${announcement.priority === 'urgent' ? 'bg-purple-500' : 'bg-red-500'} text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl tracking-wider z-10`}>
                                            {announcement.priority === 'urgent' ? 'Acil' : 'Önemli'}
                                        </div>
                                    )}
                                    <div className="p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full bg-${styleConfig.color}-100 dark:bg-${styleConfig.color}-900/30 flex items-center justify-center text-${styleConfig.color}-600 dark:text-${styleConfig.color}-400`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                    {styleConfig.label}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(announcement.createdAt || announcement.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {announcement.title}
                                        </h3>

                                        {/* RENDER HTML CONTENT SAFELY */}
                                        <div
                                            className="text-slate-600 dark:text-slate-400 mb-6 flex-grow line-clamp-3 leading-relaxed text-sm prose prose-sm dark:prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: announcement.text || announcement.content }}
                                        />

                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {announcement.author}
                                            </span>
                                            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 -mr-2">
                                                Devamını Oku <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">Duyuru Bulunamadı</h3>
                        <p className="text-slate-500 dark:text-slate-400">Seçtiğiniz kriterlere uygun duyuru veya haber bulunmuyor.</p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => { setSearchTerm(''); setActiveTab('all'); }}
                        >
                            Filtreleri Temizle
                        </Button>
                    </div>
                )}
            </div>

            {/* CREATE ANNOUNCEMENT MODAL */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Megaphone className="text-blue-500" /> Yeni Duyuru Oluştur
                                </h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                                            <select
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200"
                                            >
                                                <option value="genel">Genel</option>
                                                <option value="fakulte">Fakülte</option>
                                                <option value="ders">Ders / Etkinlik</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Öncelik</label>
                                            <select
                                                value={newPriority}
                                                onChange={(e) => setNewPriority(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-700 dark:text-slate-200"
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="high">Önemli</option>
                                                <option value="urgent">Acil</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duyuru Başlığı</label>
                                        <Input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Örn: 2024 Bahar Dönemi Vize Takvimi"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">İçerik (Zengin Metin)</label>
                                        <RichTextEditor
                                            value={newContent}
                                            onChange={setNewContent}
                                            placeholder="Duyuru metnini buraya yazın..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    İptal
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleCreateAnnouncement}
                                    isLoading={isSubmitting}
                                    className="px-8"
                                >
                                    Yayınla
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
