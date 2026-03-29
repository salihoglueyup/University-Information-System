import { FileText, Plus } from 'lucide-react';

const examApplications = [
    {
        id: "ENV-2026-001",
        studentName: "Mert Yılmaz",
        type: "Mazeret Sınavı",
        course: "Bilgisayar Ağları",
        reason: "Sağlık Raporu (3 Gün)",
        date: "12.03.2026",
        status: "Bekliyor"
    },
    {
        id: "ENV-2026-002",
        studentName: "Zeynep Kaya",
        type: "Tek Ders Sınavı",
        course: "İşletim Sistemleri",
        reason: "Mezuniyet Şartı",
        date: "10.03.2026",
        status: "Onaylandı"
    },
    {
        id: "ENV-2026-003",
        studentName: "Ali Veli",
        type: "Ek Sınav",
        course: "Veri Yapıları",
        reason: "Azami Süre Sonu",
        date: "05.03.2026",
        status: "Reddedildi"
    }
];

export default function ExamApplications() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Sınav Başvuruları"
                description="Mazeret, tek ders ve ek sınav başvurularınızı inceleyin veya yeni başvuru yapın."
                icon={FileText}
                action={<Button icon={Plus}>Yeni Başvuru</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="p-4 bg-white border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Toplam Başvuru</p>
                        <h3 className="text-2xl font-bold text-gray-800">12</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <FileText size={20} />
                    </div>
                </Card>
                <Card className="p-4 bg-white border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Onaylanan</p>
                        <h3 className="text-2xl font-bold text-green-600">8</h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <CheckCircle size={20} />
                    </div>
                </Card>
                <Card className="p-4 bg-white border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Bekleyen</p>
                        <h3 className="text-2xl font-bold text-amber-600">3</h3>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                        <Clock size={20} />
                    </div>
                </Card>
            </div>

            <Card title="Başvuru Geçmişi">
                <div className="space-y-4">
                    {examApplications.map(app => (
                        <div key={app.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <div className={`p-3 text-white rounded-lg ${app.type === 'Mazeret Sınavı' ? 'bg-purple-500' :
                                        app.type === 'Tek Ders Sınavı' ? 'bg-blue-500' : 'bg-red-500'
                                    }`}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        {app.course}
                                        <Badge size="sm" variant={
                                            app.status === 'Onaylandı' ? 'success' :
                                                app.status === 'Bekliyor' ? 'warning' : 'danger'
                                        }>
                                            {app.status}
                                        </Badge>
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-1 text-sm text-gray-500">
                                        <span className="font-medium text-gray-700">{app.type}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>Gerekçe: {app.reason}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 gap-2">
                                <span className="text-sm font-bold text-gray-500">{app.date}</span>
                                <Button variant="ghost" size="sm">Evrakları Gör</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
