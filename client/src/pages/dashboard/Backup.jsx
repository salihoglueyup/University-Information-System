import { AlertTriangle, Archive, Database, Download, RefreshCw, UploadCloud } from 'lucide-react';

const backupLogs = [
    { id: 1, name: "ubis_db_backup_2026_03_01.sql.gz", size: "450 MB", date: "01.03.2026 03:00", type: "Otomatik (Tam)", status: "Başarılı" },
    { id: 2, name: "ubis_db_backup_2026_02_28.sql.gz", size: "448 MB", date: "28.02.2026 03:00", type: "Otomatik (Tam)", status: "Başarılı" },
    { id: 3, name: "ubis_db_backup_2026_02_27_manual.sql.gz", size: "445 MB", date: "27.02.2026 14:30", type: "Manuel", status: "Başarılı" },
    { id: 4, name: "ubis_db_backup_2026_02_26.sql.gz", size: "0 MB", date: "26.02.2026 03:00", type: "Otomatik (Tam)", status: "Hata" },
];

export default function Backup() {
    const columns = [
        { field: 'name', headerName: 'Dosya Adı', flex: 2 },
        { field: 'size', headerName: 'Boyut', flex: 1 },
        { field: 'type', headerName: 'Tipi', flex: 1 },
        { field: 'date', headerName: 'Tarih', flex: 1 },
        {
            field: 'status',
            headerName: 'Durum',
            flex: 1,
            renderCell: (row) => (
                <Badge variant={row.status === 'Başarılı' ? 'success' : 'danger'}>
                    {row.status}
                </Badge>
            )
        },
        {
            field: 'actions',
            headerName: 'İşlem',
            flex: 1,
            align: 'right',
            renderCell: () => (
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost"><Download size={16} /></Button>
                    <Button size="icon" variant="ghost" className="text-amber-600"><UploadCloud size={16} /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sistem Yedekleri (Backups)"
                description="Veritabanı ve sistem dosyalarının yedeklerini yönetin."
                icon={Database}
            />

            {/* Stats & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-5 flex flex-col justify-center items-center text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg relative overflow-hidden">
                    <Archive size={40} className="mb-2 opacity-80" />
                    <h3 className="text-sm font-medium opacity-90">Toplam Depolanan Yedek</h3>
                    <p className="text-3xl font-bold mt-1">1.2 TB</p>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </Card>

                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Database size={28} />
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-blue-700">Şimdi Yedekle</span>
                    </Card>
                    <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group">
                        <div className="p-4 bg-amber-50 text-amber-600 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <UploadCloud size={28} />
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-amber-700">Yedekten Dön</span>
                    </Card>
                    <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all group">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <RefreshCw size={28} />
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-indigo-700">Senkronizasyon</span>
                    </Card>
                </div>
            </div>

            {/* Alert */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
                <AlertTriangle className="shrink-0 mt-0.5 text-amber-500" />
                <div>
                    <h4 className="font-bold mb-1">Otomatik Yedekleme Aktif</h4>
                    <p className="text-sm">Sistem her gece saat 03:00'te tam veritabanı yedeğini (Full Backup) alır ve AWS S3 sunucularına aktarır.</p>
                </div>
            </div>

            {/* Backup Table */}
            <Card title="Son Yedekleme Günlükleri">
                <DataGrid
                    rows={backupLogs}
                    columns={columns}
                />
            </Card>
        </div>
    );
}
import { Badge, Button, Card, DataGrid, PageHeader } from '../../components/ui';
