import { useState } from 'react';
import { Users, Search, Filter, Download } from 'lucide-react';

// Mock Data
const studentData = [
    { id: "B211200055", name: "Ali Yılmaz", department: "Bilgisayar Mühendisliği", year: "3. Sınıf", gpa: 3.15, status: "Aktif" },
    { id: "B221200102", name: "Ayşe Kaya", department: "Yazılım Mühendisliği", year: "2. Sınıf", gpa: 2.80, status: "Aktif" },
    { id: "B201200341", name: "Mehmet Demir", department: "Yapay Zeka Mühendisliği", year: "4. Sınıf", gpa: 3.90, status: "Onur Öğrencisi" },
    { id: "B231200012", name: "Fatma Şahin", department: "Bilgisayar Mühendisliği", year: "1. Sınıf", gpa: 0.00, status: "Kayıt Dondurdu" },
    { id: "B211200088", name: "Emre Can", department: "Bilişim Sistemleri", year: "3. Sınıf", gpa: 2.45, status: "Aktif" },
];

export default function StudentLists() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = studentData.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { field: 'id', headerName: 'Öğrenci No', flex: 1 },
        { field: 'name', headerName: 'Ad Soyad', flex: 2 },
        { field: 'department', headerName: 'Bölüm', flex: 2 },
        { field: 'year', headerName: 'Sınıf', flex: 1 },
        { field: 'gpa', headerName: 'GNO', flex: 1 },
        {
            field: 'status',
            headerName: 'Durum',
            flex: 1,
            renderCell: (row) => (
                <Badge variant={
                    row.status === 'Aktif' ? 'success' :
                        row.status === 'Onur Öğrencisi' ? 'primary' : 'danger'
                }>
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
                <Button size="sm" variant="ghost">Profil</Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Öğrenci Listeleri"
                description="Danışmanlık veya dersinize kayıtlı öğrencileri arayın ve filtreleyin."
                icon={Users}
            />

            <Card>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <Input
                            placeholder="Öğrenci no, ad, soyad veya bölüm ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" icon={Filter}>Filtrele</Button>
                        <Button variant="secondary" icon={Download}>Dışa Aktar</Button>
                    </div>
                </div>

                <DataGrid
                    rows={filteredStudents}
                    columns={columns}
                />
            </Card>
        </div>
    );
}
import { Badge, Button, Card, DataGrid, Input, PageHeader } from '../../components/ui';
