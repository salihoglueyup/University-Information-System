import { useState } from 'react';
import { CheckCircle, Clock, Download, FileText, Search, XCircle } from 'lucide-react';

const MOCK_REQUESTS = [
    { id: 'REQ-1024', student: 'Ahmet Yılmaz', no: '20231045', type: 'Öğrenci Belgesi', date: '2024-03-15', status: 'pending' },
    { id: 'REQ-1025', student: 'Ayşe Demir', no: '20224012', type: 'Transkript (Türkçe)', date: '2024-03-14', status: 'approved' },
    { id: 'REQ-1026', student: 'Mehmet Kaya', no: '20215099', type: 'Askerlik Durum Belgesi', date: '2024-03-14', status: 'approved' },
    { id: 'REQ-1027', student: 'Zeynep Çelik', no: '20238021', type: 'Transkript (İngilizce)', date: '2024-03-13', status: 'rejected' },
    { id: 'REQ-1028', student: 'Ali Veli', no: '20202055', type: 'Disiplin Durum Belgesi', date: '2024-03-12', status: 'approved' },
];

const StudentAffairs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusConfig = (status) => {
        const configs = {
            pending: { color: 'warning', icon: Clock, label: 'Bekliyor' },
            approved: { color: 'success', icon: CheckCircle, label: 'Onaylandı' },
            rejected: { color: 'danger', icon: XCircle, label: 'Reddedildi' }
        };
        return configs[status] || configs.pending;
    };

    const StatusBadge = ({ status }) => {
        const config = getStatusConfig(status);
        const Icon = config.icon;
        return (
            <Badge variant={config.color} className="flex items-center gap-1 w-fit">
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const filteredRequests = MOCK_REQUESTS.filter(req => {
        const matchesSearch =
            req.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.no.includes(searchTerm) ||
            req.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            header: 'Talep No',
            accessor: 'id',
            cell: (row) => <span className="font-medium text-slate-700">{row.id}</span>
        },
        {
            header: 'Öğrenci',
            accessor: 'student',
            cell: (row) => (
                <div>
                    <div className="font-medium text-slate-900">{row.student}</div>
                    <div className="text-xs text-slate-500">{row.no}</div>
                </div>
            )
        },
        { header: 'Belge Türü', accessor: 'type' },
        { header: 'Tarih', accessor: 'date' },
        {
            header: 'Durum',
            accessor: 'status',
            cell: (row) => <StatusBadge status={row.status} />
        },
        {
            header: 'İşlemler',
            accessor: 'actions',
            cell: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50"> İncele </Button>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-50">
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Öğrenci İşleri"
                description="Öğrenci belge talepleri ve resmi evrak işlemlerini yönetin."
                icon={FileText}
                breadcrumbs={[
                    { label: 'Gösterge Paneli', path: '/dashboard' },
                    { label: 'İdari İşler', path: '/dashboard/student-affairs' },
                    { label: 'Öğrenci İşleri' }
                ]}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <div className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-blue-600/80 mb-1">Bekleyen Talepler</div>
                            <div className="text-2xl font-bold text-blue-900">24</div>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
                    <div className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-emerald-600/80 mb-1">Bugün Onaylanan</div>
                            <div className="text-2xl font-bold text-emerald-900">142</div>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200">
                    <div className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-600/80 mb-1">Toplam İşlem (Ay)</div>
                            <div className="text-2xl font-bold text-slate-900">1,284</div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <Card>
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Belge Talepleri</h3>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Öğrenci veya Talep No..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full sm:w-64"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-40"
                            options={[
                                { value: 'all', label: 'Tüm Durumlar' },
                                { value: 'pending', label: 'Bekleyenler' },
                                { value: 'approved', label: 'Onaylananlar' },
                                { value: 'rejected', label: 'Reddedilenler' }
                            ]}
                        />
                    </div>
                </div>

                <div className="p-0 overflow-x-auto">
                    <Table
                        columns={columns}
                        data={filteredRequests}
                        emptyMessage="Arama kriterlerine uygun talep bulunamadı."
                    />
                </div>
                <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
                    <div>Toplam {filteredRequests.length} kayıt gösteriliyor</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Önceki</Button>
                        <Button variant="outline" size="sm">Sonraki</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
import { motion } from 'framer-motion';
import { Badge, Button, Card, Input, PageHeader, Select, Table } from '../../components/ui';

export default StudentAffairs;
