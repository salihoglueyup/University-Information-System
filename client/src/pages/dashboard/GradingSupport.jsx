import { useRef, useState } from 'react';
import { PenTool } from 'lucide-react';
import * as XLSX from 'xlsx';

// Mock Data
const initialGradingTasks = [
    { id: 1, course: "Yazılım Mimarisi (YZM302)", assessment: "Vize", date: "2026-03-15", status: "Bekliyor", unread: 45, draftData: null },
    { id: 2, course: "Veritabanı Yönetim Sistemleri (YZM202)", assessment: "Proje 1", date: "2026-03-20", status: "Taslak", unread: 12, draftData: [{ OgrenciNo: '20220101', Isim: 'Ahmet Yılmaz', Not: 85 }] },
    { id: 3, course: "Web Programlama (YZM304)", assessment: "Ödev 2", date: "2026-02-28", status: "Yayınlandı", unread: 0, draftData: null },
];

export default function GradingSupport() {
    const [tasks, setTasks] = useState(initialGradingTasks);
    const fileInputRef = useRef(null);

    // Mock students for the template
    const templateData = [
        { OgrenciNo: "20220101", Isim: "Ahmet Yılmaz", Not: "" },
        { OgrenciNo: "20220102", Isim: "Ayşe Kaya", Not: "" },
        { OgrenciNo: "20220103", Isim: "Mehmet Demir", Not: "" },
    ];

    const generateExcelTemplate = (courseName) => {
        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Not Listesi");
        XLSX.writeFile(workbook, `${courseName}_Not_Sablonu.xlsx`);
    };

    const handleFileUpload = (e, taskId) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            console.log("Imported Grades for Task", taskId, ":", json);
            alert(`${json.length} öğrenci notu sisteme 'Taslak' olarak aktarıldı. Yayınlamayı unutmayın!`);

            // Update state to 'Taslak' (Draft) instead of 'Tamamlandı'
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Taslak', unread: 0, draftData: json } : t));
        };
        reader.readAsArrayBuffer(file);
    };

    const handlePublish = (taskId) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Yayınlandı', draftData: null } : t));
        alert('Notlar başarıyla öğrencilere yayınlandı ve dekanlığa iletildi!');
    };
    const columns = [
        { field: 'course', headerName: 'Ders', flex: 2 },
        { field: 'assessment', headerName: 'Değerlendirme', flex: 1 },
        { field: 'date', headerName: 'Tarih', flex: 1 },
        {
            field: 'status',
            headerName: 'Durum',
            flex: 1,
            renderCell: (row) => (
                <Badge variant={
                    row.status === 'Yayınlandı' ? 'success' :
                        row.status === 'Taslak' ? 'warning' : 'secondary'
                }>
                    {row.status}
                </Badge>
            )
        },
        { field: 'unread', headerName: 'Okunmamış', flex: 1, align: 'center' },
        {
            field: 'actions',
            headerName: 'İşlemler',
            flex: 2,
            align: 'right',
            renderCell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {row.status !== 'Yayınlandı' && (
                        <>
                            <button
                                onClick={() => generateExcelTemplate(row.course)}
                                className="px-3 py-1.5 flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 font-medium rounded-lg transition-colors text-xs"
                                title="Boş Şablon İndir"
                            >
                                <Download size={14} /> Şablon
                            </button>
                            <button
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.setAttribute('data-target-id', row.id);
                                        fileInputRef.current.click();
                                    }
                                }}
                                className="px-3 py-1.5 flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg transition-colors text-xs"
                                title="Notları Yükle"
                            >
                                <Upload size={14} /> Yükle
                            </button>
                        </>
                    )}
                    {row.status === 'Taslak' && (
                        <button
                            onClick={() => handlePublish(row.id)}
                            className="px-3 py-1.5 flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded-lg transition-colors text-xs ml-2"
                            title="Notları Öğrencilere Aç"
                        >
                            <CheckCircle size={14} /> Yayınla
                        </button>
                    )}
                    {row.status === 'Yayınlandı' && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle size={14} /> Dekanlığa İletildi
                        </span>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls"
                onChange={(e) => {
                    const taskId = parseInt(fileInputRef.current.getAttribute('data-target-id'), 10);
                    handleFileUpload(e, taskId);
                    e.target.value = null; // reset input
                }}
            />
            <PageHeader
                title="Notlandırma Desteği"
                description="Sorumlu olduğunuz derslerdeki sınav ve ödevleri notlandırın."
                icon={PenTool}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white flex items-center p-4 gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Bekleyen Kağıtlar</p>
                        <h3 className="text-2xl font-bold text-gray-800">57</h3>
                    </div>
                </Card>
                <Card className="bg-white flex items-center p-4 gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tamamlanan</p>
                        <h3 className="text-2xl font-bold text-gray-800">124</h3>
                    </div>
                </Card>
                <Card className="bg-white flex items-center p-4 gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <PenTool size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Aktif Notlandırmalar</p>
                        <h3 className="text-2xl font-bold text-gray-800">2</h3>
                    </div>
                </Card>
            </div>

            <Card title="Bekleyen Notlandırma Görevleri">
                <div className="flex items-center gap-2 px-6 py-4 bg-orange-50 border-b border-orange-100 text-orange-700 text-sm">
                    <FileSpreadsheet size={16} />
                    Sınıf notlarını Excel şablonu ile tek seferde sisteme aktarabilirsiniz.
                </div>
                <DataGrid
                    rows={tasks}
                    columns={columns}
                />
            </Card>
        </div>
    );
}
