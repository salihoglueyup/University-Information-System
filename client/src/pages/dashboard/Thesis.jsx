
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen
} from 'lucide-react';
import { thesisStudents } from '../../data/mockData';

export default function Thesis() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTheses = thesisStudents.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tez ve Proje Yönetimi"
                description="Yönettiğiniz lisans ve yüksek lisans tez çalışmalarının takibi."
                icon={BookOpen}
                action={
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/dashboard/thesis-kanban')}
                        >
                            <Kanban size={18} className="mr-2" />
                            Kanban Görünümü
                        </Button>
                        <Button variant="primary">
                            <Plus size={18} className="mr-2" />
                            Yeni Tez Önerisi
                        </Button>
                    </div>
                }
            />

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                    <div className="text-indigo-600 font-bold text-lg mb-1">Toplam Tez</div>
                    <div className="text-3xl font-bold text-gray-900">{thesisStudents.length}</div>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                    <div className="text-green-600 font-bold text-lg mb-1">Tamamlanan</div>
                    <div className="text-3xl font-bold text-gray-900">12</div>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
                    <div className="text-amber-600 font-bold text-lg mb-1">Devam Eden</div>
                    <div className="text-3xl font-bold text-gray-900">{thesisStudents.length}</div>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
                    <div className="text-red-600 font-bold text-lg mb-1">Gecikenler</div>
                    <div className="text-3xl font-bold text-gray-900">1</div>
                </Card>
            </div>

            <Card className="overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Öğrenci veya Proje Ara..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4 text-left">Proje Başlığı</th>
                                <th className="px-6 py-4 text-left">Öğrenci</th>
                                <th className="px-6 py-4 text-center">İlerleme</th>
                                <th className="px-6 py-4 text-center">Son Tarih</th>
                                <th className="px-6 py-4 text-center">Durum</th>
                                <th className="px-6 py-4 text-center">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTheses.map((thesis) => (
                                <tr key={thesis.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {thesis.projectTitle}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                {thesis.name.charAt(0)}
                                            </div>
                                            <span className="text-sm text-gray-700">{thesis.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2 w-24">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${thesis.progress}% ` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-600">%{thesis.progress}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                                        {thesis.deadline}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={
                                            thesis.status.includes('Gecikmeli') ? 'danger' :
                                                thesis.status.includes('Tamam') ? 'success' : 'warning'
                                        }>
                                            {thesis.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => navigate(`/ dashboard / milestone - tracker / ${thesis.id} `)}
                                        >
                                            Detay <ChevronRight size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
