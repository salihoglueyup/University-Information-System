import { useState, useEffect } from 'react';

// Components
import axiosInstance from '../../api/axiosInstance';

export default function Library() {
    const [libraryBooks, setLibraryBooks] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBorrowing, setIsBorrowing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [borrowedRes, catalogRes] = await Promise.all([
                    axiosInstance.get('/library/borrowed'),
                    axiosInstance.get('/library/catalog')
                ]);

                setLibraryBooks(borrowedRes.data || []);
                setCatalog(catalogRes.data || []);
            } catch (err) {
                console.error('Kütüphane verileri çekilemedi', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBorrow = async (bookId) => {
        if (isBorrowing) return;
        setIsBorrowing(true);
        try {
            const res = await axiosInstance.post('/library/borrow', { bookId });
            const data = res.data;

            if (data) {
                alert(`"${data.title}" başarıyla ödünç alındı.`);
                setLibraryBooks((prev) => [...prev, data]);
                // Reduce available count in catalog
                setCatalog((prev) => prev.map((b) => {
                    const currentId = b.id || b._id;
                    if (currentId === bookId) {
                        return { ...b, available: Math.max((b.available || 0) - 1, 0) };
                    }
                    return b;
                }));
            } else {
                alert(`Hata: ${data?.message || 'İşlem tamamlanamadı'}`);
            }
        } catch (err) {
            console.error("Ödünç alma hatası:", err);
            alert("Bir hata oluştu.");
        } finally {
            setIsBorrowing(false);
        }
    };

    const filteredCatalog = catalog.filter((book) => {
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        const title = (book.title || '').toLowerCase();
        const author = (book.author || '').toLowerCase();
        const isbn = String(book.isbn || '').toLowerCase();
        return title.includes(query) || author.includes(query) || isbn.includes(query);
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Book className="text-indigo-600" /> Kütüphane
                    </h1>
                    <p className="text-slate-500 text-sm">Kitap arama, ödünç alınanlar ve çalışma saatleri</p>
                </div>
            </div>

            {/* Search Section */}
            <Card className="bg-indigo-600 border-none text-white p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <h2 className="text-2xl font-bold">Ne okumak istersin?</h2>
                    <div className="flex gap-2">
                        <div className="relative flex-1 text-slate-800">
                            <Input
                                placeholder="Kitap adı, yazar veya ISBN arayın..."
                                className="h-12 pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        </div>
                        <Button variant="secondary" className="h-12 px-8" onClick={() => {}}>Ara</Button>
                    </div>
                    <div className="flex justify-center gap-4 text-sm text-indigo-100">
                        <span>Popüler:</span>
                        <span className="underline cursor-pointer hover:text-white">Python</span>
                        <span className="underline cursor-pointer hover:text-white">Yapay Zeka</span>
                        <span className="underline cursor-pointer hover:text-white">Tarih</span>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2 p-6 space-y-4">
                    <h3 className="font-bold text-slate-800">Uzerinizdeki Kitaplar</h3>

                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : libraryBooks.length === 0 ? (
                        <div className="text-center text-slate-500 py-6">Uzerinizde kitap bulunmamaktadir.</div>
                    ) : (
                        libraryBooks.map((book) => {
                            const dueDate = new Date(book.dueDate);
                            const today = new Date();
                            const diffTime = today - dueDate;
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const isOverdue = diffDays > 0;
                            const fineAmount = isOverdue ? diffDays * 5 : 0;

                            return (
                                <div key={book._id || book.id} className={`flex gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow ${isOverdue ? 'bg-red-50 border-red-200' : ''}`}>
                                    <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded shadow-sm" />
                                    <div className="flex-1">
                                        <h4 className={`font-bold ${isOverdue ? 'text-red-800' : 'text-slate-800'}`}>{book.title}</h4>
                                        <p className="text-sm text-slate-500 mb-2">{book.author}</p>
                                        <div className="flex items-center gap-4 text-xs flex-wrap">
                                            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-700 bg-red-100' : 'text-slate-600 bg-slate-100'} px-2 py-1 rounded`}>
                                                <CalendarDays size={14} />
                                                <span>Son Tarih: <b>{book.dueDate}</b></span>
                                            </div>
                                            <Badge variant={isOverdue ? 'danger' : book.status === 'Suresi Yaklasiyor' ? 'warning' : 'primary'}>
                                                {isOverdue ? 'Gecikti' : book.status}
                                            </Badge>
                                            {isOverdue && (
                                                <div className="text-red-600 font-bold">Ceza: {fineAmount} TL</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </Card>

                <Card className="p-6 space-y-4">
                    <h3 className="font-bold text-slate-800">Katalog</h3>
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {filteredCatalog.length === 0 ? (
                            <p className="text-sm text-slate-500">Aramaya uygun kitap bulunamadi.</p>
                        ) : (
                            filteredCatalog.map((book) => {
                                const bookId = book._id || book.id;
                                const isAvailable = (book.available ?? 0) > 0;

                                return (
                                    <div key={bookId} className="border border-slate-200 rounded-lg p-3">
                                        <div className="font-semibold text-slate-800">{book.title}</div>
                                        <div className="text-xs text-slate-500 mb-2">{book.author}</div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge variant={isAvailable ? 'success' : 'danger'}>
                                                {isAvailable ? `Musait: ${book.available}` : 'Musait degil'}
                                            </Badge>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={!isAvailable || isBorrowing}
                                                onClick={() => handleBorrow(bookId)}
                                            >
                                                Odunc Al
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>

                <Card className="xl:col-span-3 p-6 h-fit bg-slate-50 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-100 rounded-full opacity-50 blur-xl"></div>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 relative z-10">
                        <Clock size={18} className="text-indigo-600" /> Calisma Saatleri
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">Hafta Ici</span>
                            <span className="font-bold text-slate-800">08:30 - 22:00</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">Cumartesi</span>
                            <span className="font-bold text-slate-800">09:00 - 17:00</span>
                        </li>
                        <li className="flex justify-between pb-2">
                            <span className="text-slate-500">Pazar</span>
                            <span className="font-bold text-slate-800">Kapali</span>
                        </li>
                    </ul>
                </Card>
            </div>
        </motion.div>
    );
}
