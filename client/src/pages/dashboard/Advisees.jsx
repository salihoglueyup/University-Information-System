import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, FileText, Filter, MessageSquare, Search, User } from 'lucide-react';

// Mock Data for Advisees
const mockAdvisees = [
    { id: '101', name: 'Ahmet Yılmaz', department: 'Yazılım Müh.', gpa: 3.45, status: 'Active', risk: 'Low', semester: 4 },
    { id: '102', name: 'Ayşe Demir', department: 'Yazılım Müh.', gpa: 1.85, status: 'Probation', risk: 'High', semester: 2 },
    { id: '103', name: 'Mehmet Kaya', department: 'Yazılım Müh.', gpa: 2.90, status: 'Active', risk: 'Medium', semester: 6 },
    { id: '104', name: 'Zeynep Çelik', department: 'Yazılım Müh.', gpa: 3.80, status: 'Active', risk: 'Low', semester: 8 },
    { id: '105', name: 'Caner Erkin', department: 'Yazılım Müh.', gpa: 2.10, status: 'Active', risk: 'Medium', semester: 3 },
];

export default function Advisees() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('All');

    const filteredStudents = mockAdvisees.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm);
        const matchesRisk = filterRisk === 'All' || student.risk === filterRisk;
        return matchesSearch && matchesRisk;
    });

    const getRiskBadge = (risk) => {
        switch (risk) {
            case 'High': return <Badge variant="error" icon={AlertTriangle}>Yüksek Risk</Badge>;
            case 'Medium': return <Badge variant="warning" icon={AlertTriangle}>Orta Risk</Badge>;
            case 'Low': return <Badge variant="success" icon={CheckCircle}>Düşük Risk</Badge>;
            default: return <Badge variant="secondary">Bilinmiyor</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Danışmanlık Listesi"
                description="Sorumluluğunuzdaki öğrencilerin akademik durumlarını takip edin."
                actions={
                    <Button variant="outline">
                        <FileText size={18} className="mr-2" />
                        Rapor Al
                    </Button>
                }
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Toplam Öğrenci</p>
                        <p className="text-2xl font-bold text-gray-900">{mockAdvisees.length}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <User size={24} />
                    </div>
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Riskli Öğrenci</p>
                        <p className="text-2xl font-bold text-red-600">
                            {mockAdvisees.filter(s => s.risk === 'High').length}
                        </p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-full">
                        <AlertTriangle size={24} />
                    </div>
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Kayıt Onayı Bekleyen</p>
                        <p className="text-2xl font-bold text-orange-600">3</p>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                        <CheckCircle size={24} />
                    </div>
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Ortalama GPA</p>
                        <p className="text-2xl font-bold text-green-600">2.82</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <FileText size={24} />
                    </div>
                </Card>
            </div>

            {/* List */}
            <Card>
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Öğrenci ara..."
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                        >
                            <option value="All">Tüm Risk Grupları</option>
                            <option value="High">Yüksek Risk</option>
                            <option value="Medium">Orta Risk</option>
                            <option value="Low">Düşük Risk</option>
                        </select>
                        <Button variant="outline" size="icon">
                            <Filter size={18} />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Öğrenci No</th>
                                <th className="p-4">Ad Soyad</th>
                                <th className="p-4">Yarıyıl</th>
                                <th className="p-4">GPA</th>
                                <th className="p-4">Risk Durumu</th>
                                <th className="p-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50 group">
                                    <td className="p-4 font-medium text-gray-900">{student.id}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{student.name}</div>
                                        <div className="text-xs text-gray-500">{student.department}</div>
                                    </td>
                                    <td className="p-4">{student.semester}. Dönem</td>
                                    <td className="p-4 font-bold text-gray-700">{student.gpa}</td>
                                    <td className="p-4">{getRiskBadge(student.risk)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-blue-600">
                                                <MessageSquare size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/dashboard/student-360/${student.id}`)}
                                            >
                                                Profili Gör
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        Kriterlere uygun öğrenci bulunamadı.
                    </div>
                )}
            </Card>
        </div>
    );
}
import { Badge, Button, Card, PageHeader } from '../../components/ui';
