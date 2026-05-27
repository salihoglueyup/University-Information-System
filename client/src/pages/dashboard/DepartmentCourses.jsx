
// Components

// Mock Data
import { departmentCourses } from '../../data/mockData';

export default function DepartmentCourses() {
    const columns = [
        { label: 'Ders Kodu', key: 'code', sortable: true, className: "font-mono font-medium text-blue-600 w-32" },
        { label: 'Ders Adı', key: 'name', sortable: true, className: "font-medium text-slate-900" },
        { label: 'Kredi', key: 'credit', sortable: true, className: "text-center w-24" },
        { label: 'AKTS', key: 'ects', sortable: true, className: "text-center w-24 font-bold" },
        { label: 'Yarıyıl', key: 'semester', sortable: true, className: "text-center w-24" },
        {
            label: 'Tür',
            key: 'type',
            sortable: true,
            className: "w-32 text-center",
            render: (type) => (
                <Badge variant={type === 'Zorunlu' ? 'secondary' : 'warning'} className="justify-center">
                    {type}
                </Badge>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="text-purple-600" /> Bölüm Dersleri
                    </h1>
                    <p className="text-slate-500 text-sm">Yazılım Mühendisliği müfredatında yer alan tüm dersler</p>
                </div>
            </div>

            <Card className="border-none shadow-sm space-y-4">
                <DataGrid
                    columns={columns}
                    data={departmentCourses}
                    sortable
                    filterable
                    pagination
                    rowsPerPage={10}
                />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4 bg-purple-50 border-purple-100">
                    <h3 className="text-purple-800 font-bold text-lg">240</h3>
                    <p className="text-purple-600 text-sm">Mezuniyet İçin Gerekli AKTS</p>
                </Card>
                <Card className="p-4 bg-blue-50 border-blue-100">
                    <h3 className="text-blue-800 font-bold text-lg">52</h3>
                    <p className="text-blue-600 text-sm">Toplam Ders Sayısı</p>
                </Card>
                <Card className="p-4 bg-emerald-50 border-emerald-100">
                    <h3 className="text-emerald-800 font-bold text-lg">8</h3>
                    <p className="text-emerald-600 text-sm">Toplam Yarıyıl</p>
                </Card>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Badge, Card, DataGrid } from '../../components/ui';
