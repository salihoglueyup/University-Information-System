import { useState } from 'react';
import { Library as LibraryIcon } from 'lucide-react';

const MOCK_BOOKS = [
    { id: 'B-1001', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', year: '2008', category: 'Bilgisayar Müh.', status: 'available', isbn: '978-0132350884' },
    { id: 'B-1002', title: 'Calculus: Early Transcendentals', author: 'James Stewart', year: '2015', category: 'Matematik', status: 'borrowed', isbn: '978-1285741550' },
    { id: 'B-1003', title: 'Design of Everyday Things', author: 'Don Norman', year: '2013', category: 'Tasarım', status: 'available', isbn: '978-0465050659' },
    { id: 'B-1004', title: 'Sapiens: Hayvanlardan Tanrılara İnsan Türünün Kısa Bir Tarihi', author: 'Yuval Noah Harari', year: '2015', category: 'Tarih', status: 'available', isbn: '978-6052205561' },
    { id: 'B-1005', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', year: '2009', category: 'Bilgisayar Müh.', status: 'borrowed', isbn: '978-0262033848' },
];

const LibraryDb = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredBooks = MOCK_BOOKS.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.includes(searchTerm);

        const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const categories = [
        { value: 'all', label: 'Tüm Kategoriler' },
        { value: 'Bilgisayar Müh.', label: 'Bilgisayar Müh.' },
        { value: 'Matematik', label: 'Matematik' },
        { value: 'Tasarım', label: 'Tasarım' },
        { value: 'Tarih', label: 'Tarih' },
    ];

    const columns = [
        {
            header: 'Kitap Adı',
            accessor: 'title',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-14 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0">
                        <Book className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900 line-clamp-1">{row.title}</div>
                        <div className="text-xs text-slate-500">{row.author} • {row.year}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Kategori',
            accessor: 'category',
            cell: (row) => (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {row.category}
                </Badge>
            )
        },
        {
            header: 'ISBN',
            accessor: 'isbn',
            cell: (row) => <span className="text-sm font-mono text-slate-600">{row.isbn}</span>
        },
        {
            header: 'Durum',
            accessor: 'status',
            cell: (row) => (
                <Badge
                    variant={row.status === 'available' ? 'success' : 'warning'}
                    className="flex items-center gap-1 w-fit"
                >
                    {row.status === 'available' ? 'Rafta' : 'Ödünç Verildi'}
                </Badge>
            )
        },
        {
            header: 'İşlemler',
            accessor: 'actions',
            cell: (row) => (
                <Button
                    variant={row.status === 'available' ? 'primary' : 'outline'}
                    size="sm"
                    disabled={row.status !== 'available'}
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                    {row.status === 'available' ? <Bookmark className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4" />}
                    {row.status === 'available' ? 'Ayırt' : 'Sırada'}
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Kütüphane Veritabanı"
                description="Merkez kütüphane kataloğunda arama yapın ve kaynakları ayırtın."
                icon={LibraryIcon}
                breadcrumbs={[
                    { label: 'Gösterge Paneli', path: '/dashboard' },
                    { label: 'Kampüs Yaşamı', path: '/dashboard/library-db' },
                    { label: 'Kütüphane' }
                ]}
            />

            <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <h2 className="text-2xl font-bold text-indigo-900">Merkez Kütüphane Kataloğu</h2>
                    <p className="text-indigo-600/80 max-w-2xl">
                        Milyonlarca basılı ve elektronik kaynağa tek bir noktadan erişin. Gelişmiş arama ile aradığınız kitaba saniyeler içinde ulaşın.
                    </p>

                    <div className="w-full max-w-3xl mt-6">
                        <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                options={categories}
                                className="w-full sm:w-48 border-0 bg-slate-50"
                            />
                            <div className="h-full w-px bg-slate-200 hidden sm:block"></div>
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Kitap adı, yazar veya ISBN ile arayın..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 outline-none"
                                />
                            </div>
                            <Button className="h-11 px-8">Ara</Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Arama Sonuçları</h3>
                    <Badge variant="blue" className="px-3 py-1 text-sm">
                        {filteredBooks.length} Sonuç
                    </Badge>
                </div>

                <div className="p-0 overflow-x-auto">
                    <Table
                        columns={columns}
                        data={filteredBooks}
                        emptyMessage="Aradığınız kriterlere uygun kitap bulunamadı. Lütfen farklı kelimelerle tekrar deneyin."
                    />
                </div>
            </Card>
        </div>
    );
};

export default LibraryDb;
