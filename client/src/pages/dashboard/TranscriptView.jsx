import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, ShieldCheck } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode';
// Components
import axiosInstance from '../../api/axiosInstance';
// Mock Data
const transcriptData = {
    student: {
        name: "Ali Yılmaz",
        id: "B211200055",
        tc: "12345678901",
        birthDate: "01.01.2003",
        program: "Bilgisayar Mühendisliği",
        faculty: "Mühendislik Fakültesi",
        entryDate: "15.09.2021",
        status: "Aktif",
    },
    semesters: [
        {
            name: "2021-2022 Güz",
            gpa: 2.80,
            courses: [
                { code: "MAT101", name: "Matematik I", credit: 4, grade: "CB", ects: 6 },
                { code: "FİZ101", name: "Fizik I", credit: 4, grade: "BB", ects: 6 },
                { code: "BİL101", name: "Bilgisayar Müh. Giriş", credit: 3, grade: "AA", ects: 5 },
                { code: "TÜR101", name: "Türk Dili I", credit: 2, grade: "BA", ects: 2 },
            ]
        },
        {
            name: "2021-2022 Bahar",
            gpa: 3.00,
            courses: [
                { code: "MAT102", name: "Matematik II", credit: 4, grade: "BB", ects: 6 },
                { code: "FİZ102", name: "Fizik II", credit: 4, grade: "CB", ects: 6 },
                { code: "BİL102", name: "Algoritma ve Programlama", credit: 4, grade: "BA", ects: 6 },
                { code: "İNG102", name: "İngilizce II", credit: 2, grade: "AA", ects: 2 },
            ]
        },
        {
            name: "2022-2023 Güz",
            gpa: 3.20,
            courses: [
                { code: "MAT201", name: "Diferansiyel Denklemler", credit: 4, grade: "AA", ects: 6 },
                { code: "BİL201", name: "Veri Yapıları", credit: 4, grade: "BA", ects: 7 },
                { code: "BİL203", name: "Mantık Devreleri", credit: 3, grade: "BB", ects: 5 },
                { code: "MAT203", name: "Olasılık ve İstatistik", credit: 3, grade: "CB", ects: 5 },
            ]
        }
    ],
    summary: {
        totalCredits: 128,
        completedCredits: 85,
        gpa: 3.15,
        totalECTS: 240,
        completedECTS: 155
    }
};

export default function TranscriptView() {
    const navigate = useNavigate();
    const componentRef = useRef(null);
    const [qrCodeDataUri, setQrCodeDataUri] = useState(null);

    useEffect(() => {
        const createVerification = async () => {
            try {
                const res = await axiosInstance.post('/verifications/create', {
                    studentName: transcriptData.student.name,
                    studentId: transcriptData.student.id,
                    documentType: 'Transkript'
                });

                const hash = res.data.hash;
                const verifyUrl = `${window.location.origin}/verify-document/${hash}`;

                // Generate QR Code
                const qrUri = await QRCode.toDataURL(verifyUrl, { width: 128, margin: 0 });
                setQrCodeDataUri(qrUri);
            } catch (err) {
                console.error('Doğrulama kodu oluşturulamadı', err);
            }
        };

        createVerification();
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page { size: auto; margin: 20mm; }
            @media print { body { -webkit-print-color-adjust: exact; } }
        `
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>Geri</Button>
                    <h1 className="text-lg font-bold text-slate-800">Resmi Transkript Görüntüleme</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Printer} onClick={handlePrint}>Yazdır</Button>
                    <Button variant="primary" icon={Download}>PDF İndir</Button>
                </div>
            </div>

            {/* Transcript Document */}
            <div className="bg-white shadow-lg mx-auto print:shadow-none print:w-full" style={{ width: '210mm', minHeight: '297mm' }}>
                <div ref={componentRef} className="p-12 flex flex-col h-full relative">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
                        <img src="/logo.png" className="w-[80%]" alt="" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between border-b-2 border-black pb-6 mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                U
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-black uppercase tracking-wider">UBIS Üniversitesi</h2>
                                <p className="text-sm text-gray-600 font-medium uppercase">Öğrenci İşleri Daire Başkanlığı</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xl font-bold text-black uppercase tracking-widest border-2 border-black px-4 py-1 inline-block">Transkript</h3>
                            <p className="text-xs text-gray-500 mt-2">Belge No: TR-2026-849201</p>
                            <p className="text-xs text-gray-500">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-8 text-sm relative z-10">
                        <div className="grid grid-cols-3">
                            <span className="font-bold text-gray-900">Adı Soyadı:</span>
                            <span className="col-span-2 text-gray-700">{transcriptData.student.name}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="font-bold text-gray-900">Öğrenci No:</span>
                            <span className="col-span-2 text-gray-700">{transcriptData.student.id}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="font-bold text-gray-900">T.C. Kimlik:</span>
                            <span className="col-span-2 text-gray-700">{transcriptData.student.tc}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="font-bold text-gray-900">Doğum Tarihi:</span>
                            <span className="col-span-2 text-gray-700">{transcriptData.student.birthDate}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="font-bold text-gray-900">Fakülte:</span>
                            <span className="col-span-2 text-gray-700">{transcriptData.student.faculty}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="font-bold text-gray-900">Program:</span>
                            <span className="col-span-2 text-gray-700">{transcriptData.student.program}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="font-bold text-gray-900">Giriş Tarihi:</span>
                            <span className="col-span-2 text-gray-700">{transcriptData.student.entryDate}</span>
                        </div>
                    </div>

                    {/* Tables */}
                    <div className="space-y-6 relative z-10">
                        {transcriptData.semesters.map((semester, idx) => (
                            <div key={idx}>
                                <div className="bg-gray-100 px-4 py-1 font-bold text-sm border-y border-black flex justify-between">
                                    <span>{semester.name}</span>
                                    <span>Dönem Ortalaması: {semester.gpa.toFixed(2)}</span>
                                </div>
                                <table className="w-full text-xs text-left">
                                    <thead className="border-b border-gray-300">
                                        <tr>
                                            <th className="py-1 px-4 w-24">Kod</th>
                                            <th className="py-1 px-4">Ders Adı</th>
                                            <th className="py-1 px-4 w-16 text-center">Kredi</th>
                                            <th className="py-1 px-4 w-16 text-center">AKTS</th>
                                            <th className="py-1 px-4 w-16 text-center">Not</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {semester.courses.map((course, cIdx) => (
                                            <tr key={cIdx} className="border-b border-gray-100">
                                                <td className="py-1 px-4 font-mono text-gray-600">{course.code}</td>
                                                <td className="py-1 px-4">{course.name}</td>
                                                <td className="py-1 px-4 text-center">{course.credit}</td>
                                                <td className="py-1 px-4 text-center">{course.ects}</td>
                                                <td className="py-1 px-4 text-center font-bold">{course.grade}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>

                    {/* Footer Summary */}
                    <div className="mt-auto pt-8 border-t-2 border-black relative z-10">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-sm mb-2 underline">Not Sistemi Açıklaması</h4>
                                <p className="text-[10px] text-gray-500 leading-tight">
                                    AA: 4.00 (Mükemmel), BA: 3.50 (Pekiyi), BB: 3.00 (İyi), CB: 2.50 (Orta), CC: 2.00 (Geçer),
                                    DC: 1.50 (Koşullu Geçer), DD: 1.00 (Koşullu Geçer), FF: 0.00 (Başarısız).
                                    Mezuniyet için en az 2.00 GANO gerekmektedir.
                                </p>
                            </div>
                            <div className="border border-black p-4 text-sm bg-gray-50">
                                <div className="flex justify-between mb-1">
                                    <span>Toplam Kredi:</span>
                                    <span className="font-bold">{transcriptData.summary.totalCredits} / {transcriptData.summary.completedCredits}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span>Toplam AKTS:</span>
                                    <span className="font-bold">{transcriptData.summary.totalECTS} / {transcriptData.summary.completedECTS}</span>
                                </div>
                                <div className="flex justify-between text-lg border-t border-black mt-2 pt-2">
                                    <span className="font-bold">Genel Akademik Not Ortalaması:</span>
                                    <span className="font-bold">{transcriptData.summary.gpa}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-between items-end">
                            <div className="text-center">
                                <div className="w-32 h-32 border border-gray-300 rounded mb-2 flex flex-col items-center justify-center text-xs text-gray-400 bg-white">
                                    {qrCodeDataUri ? (
                                        <img src={qrCodeDataUri} alt="QR Code" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <span>QR Yükleniyor...</span>
                                    )}
                                </div>
                                <p className="text-[10px] uppercase font-bold">e-İmzalıdır</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold mb-12">Öğrenci İşleri Daire Başkanı</p>
                                <div className="w-48 border-b border-black"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-slate-400 pb-8">
                <ShieldCheck size={14} className="inline mr-1" />
                Bu belge bilgilendirme amaçlıdır. Resmi işlemlerde ıslak imzalı veya e-imzalı nüsha geçerlidir.
            </div>
        </div>
    );
}
import { Button } from '../../components/ui';
