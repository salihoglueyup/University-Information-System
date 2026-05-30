import React, { useRef, useState } from 'react';
import { Download, Info, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
// Components

import { useTranscript } from '../../hooks/queries/useTranscript';
import { useProfile } from '../../hooks/queries/useProfile';
import axiosInstance from '../../api/axiosInstance';
export default function Transcript() {
    const printRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [qrCodeDataUri, setQrCodeDataUri] = useState(null);
    const { data: transcriptData = [] } = useTranscript();
    const { data: currentUser = {} } = useProfile();

    React.useEffect(() => {
        if (!currentUser.id && !currentUser.username) return;

        const createVerification = async () => {
            try {
                // axiosInstance already injects the auth header
                const studentName = currentUser.name || currentUser.fullName || 'Öğrenci';
                const res = await axiosInstance.post('/verifications/create', {
                    studentName: studentName,
                    studentId: currentUser.id || currentUser.tc || 'B0000',
                    documentType: 'Transkript'
                });

                const hash = res.data.hash;
                const verifyUrl = `${window.location.origin}/verify-document/${hash}`;

                const qrUri = await QRCode.toDataURL(verifyUrl, { width: 96, margin: 0 });
                setQrCodeDataUri(qrUri);
            } catch (err) {
                console.error("QR Code oluşturulamadı", err);
            }
        };

        createVerification();
    }, [currentUser.id, currentUser.username, currentUser.name, currentUser.fullName, currentUser.tc]);

    const columns = [
        { header: 'Ders Kodu', accessor: 'code', className: 'font-mono w-28' },
        { header: 'Ders Adı', accessor: 'name', className: 'font-medium text-slate-900' },
        { header: 'Yerel Kredi', accessor: 'credit', className: 'text-center w-24' },
        { header: 'AKTS', accessor: 'ects', className: 'text-center w-24 font-semibold' },
        {
            header: 'Not',
            accessor: 'letter',
            className: 'w-24 text-center',
            render: (letter) => (
                <Badge
                    variant={['AA', 'BA', 'BB'].includes(letter) ? 'success' : ['CB', 'CC'].includes(letter) ? 'warning' : 'danger'}
                    className="w-8 justify-center mx-auto"
                >
                    {letter}
                </Badge>
            )
        },
        { header: 'Puan', accessor: 'final', className: 'text-center font-bold text-slate-600 w-24' },
        {
            header: 'Durum',
            accessor: 'status',
            className: 'text-right w-32',
            render: (status) => (
                <span className={`text-xs font-semibold ${status === 'Geçti' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {status}
                </span>
            )
        }
    ];

    // Group data by semester
    const groupedData = transcriptData.reduce((acc, curr) => {
        const semester = curr.semester;
        if (!acc[semester]) {
            acc[semester] = {
                courses: [],
                termGpa: curr.termGpa,
                cumGpa: curr.cumGpa
            };
        }
        acc[semester].courses.push(curr);
        return acc;
    }, {});

    const sortedSemesters = Object.keys(groupedData).sort((a, b) => b.localeCompare(a));

    const totalCredits = transcriptData.reduce((acc, curr) => acc + curr.credit, 0);
    const totalEcts = transcriptData.reduce((acc, curr) => acc + (curr.ects || 0), 0);

    const handlePrint = () => {
        window.print();
    };

    const exportToPDF = async () => {
        setIsExporting(true);
        try {
            const element = printRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // Calculate how many pages we need
            const ratio = pdfWidth / canvasWidth;
            const totalPdfHeightOfImg = canvasHeight * ratio;
            const pageCount = Math.ceil(totalPdfHeightOfImg / pdfHeight);

            for (let i = 0; i < pageCount; i++) {
                if (i > 0) {
                    pdf.addPage();
                }
                const srcY = -(pdfHeight * i);
                pdf.addImage(imgData, 'PNG', 0, srcY, pdfWidth, totalPdfHeightOfImg);
            }

            pdf.save(`Transkript_${currentUser.username || 'ogrenci'}.pdf`);
        } catch (err) {
            console.error("PDF Export error:", err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Transkript</h1>
                    <p className="text-slate-500 text-sm">Resmi not dökümü görüntüleme</p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>Yazdır</Button>
                    <Button
                        variant="primary"
                        size="sm"
                        icon={isExporting ? undefined : Download}
                        disabled={isExporting}
                        onClick={exportToPDF}
                    >
                        {isExporting ? 'Hazırlanıyor...' : 'PDF İndir'}
                    </Button>
                </div>
            </div>

            <div ref={printRef} className="space-y-8 bg-white p-2">

                {/* Summary Header */}
                <Card className="p-6 bg-slate-900 text-white border-none shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-blue-500/50 shadow-lg shrink-0">
                                {currentUser.gpa}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl">Genel Not Ortalaması</h3>
                                <p className="text-slate-400 text-sm">
                                    Toplam Kredi: {totalCredits} | Toplam AKTS: {totalEcts}
                                </p>
                            </div>
                        </div>
                        {qrCodeDataUri && (
                            <div className="mt-4 md:mt-0 flex flex-col items-center bg-white p-2 text-black rounded-xl">
                                <img src={qrCodeDataUri} alt="QR Doğrulama" className="w-20 h-20" />
                                <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">e-İmzalıdır</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Semesters Loop */}
                <div className="space-y-8">
                    {sortedSemesters.map((semester) => {
                        const { courses, termGpa, cumGpa } = groupedData[semester];
                        return (
                            <div key={semester} className="space-y-4">
                                <div className="flex items-end justify-between border-b-2 border-slate-200 pb-2">
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <span className="w-2 h-8 bg-blue-600 rounded-sm inline-block"></span>
                                        {semester}
                                    </h2>
                                    <Badge variant="secondary">Yarıyıl Sonu</Badge>
                                </div>

                                <Card className="overflow-hidden border-slate-200 shadow-sm">
                                    <Table
                                        headers={columns}
                                        data={courses}
                                        className="w-full"
                                    />
                                    <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row justify-end gap-4 sm:gap-12">
                                        <div className="flex justify-between sm:justify-start w-full sm:w-auto gap-4">
                                            <span className="text-slate-500 font-medium text-sm">Yarıyıl Not Ortalaması (YNO):</span>
                                            <span className="font-bold text-slate-800">{termGpa}</span>
                                        </div>
                                        <div className="flex justify-between sm:justify-start w-full sm:w-auto gap-4">
                                            <span className="text-slate-500 font-medium text-sm">Genel Not Ortalaması (GNO):</span>
                                            <span className="font-bold text-blue-600">{cumGpa}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                </div>

                {/* Information Footer */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col md:flex-row gap-4 items-start text-xs text-slate-600">
                    <Info className="flex-shrink-0 text-slate-400 mt-0.5" size={20} />
                    <div className="space-y-4 w-full">
                        <div>
                            <p className="font-bold text-slate-800 mb-1">Teaching medium is in Turkish - Eğitim dili Türkçedir.</p>
                            <p>Açıklamalar:</p>
                            <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                <li>* İşaretli dönemlerde bulunan dersler, ERASMUS Değişim Programı çerçevesinde yurtdışında alınmıştır.</li>
                                <li>** ERASMUS çerçevesinde alınan derslere ait ders kodu bulunmuyor ise 'ERA' kodu kullanılmıştır.</li>
                                <li>Hesaplamalarda AKTS (ECTS) kredisi kullanılmıştır.</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-bold text-slate-800 mb-1">Not Sistemi ve Dönüşümler</p>
                            <p>Üniversitemizde 4'lük not sistemi uygulanmaktadır. 100'lük not sistemine dönüştürülme işleminde Yükseköğretim Kurulu tarafından belirlenen dönüştürme tablosu esas alınmaktadır.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 font-mono text-[10px]">
                                <span>AA: 4.00</span>
                                <span>BA: 3.50</span>
                                <span>BB: 3.00</span>
                                <span>CB: 2.50</span>
                                <span>CC: 2.00</span>
                                <span>DC: 1.50</span>
                                <span>DD: 1.00</span>
                                <span>FD: 0.50</span>
                                <span>FF: 0.00</span>
                                <span>F: Başarısız</span>
                            </div>
                        </div>

                        <div>
                            <p className="font-bold text-slate-800 mb-1">Kısaltmalar</p>
                            <p className="flex flex-wrap gap-2 text-[10px]">
                                <span><b>M:</b> Muaf</span>
                                <span><b>NA:</b> Devamsız</span>
                                <span><b>E:</b> Değerlendirilmemiş</span>
                                <span><b>I:</b> Eksik</span>
                                <span><b>T:</b> Transfer</span>
                                <span><b>P:</b> Başarılı</span>
                                <span><b>YK:</b> Yerel Kredi</span>
                                <span><b>HN:</b> Harf Notu</span>
                                <span><b>NxKR:</b> Notu x Kredi</span>
                                <span><b>TÜR:</b> Ders Türü</span>
                            </p>
                            <p className="flex flex-wrap gap-2 mt-1 text-[10px]">
                                <span><b>Z:</b> Zorunlu Ders</span>
                                <span><b>S:</b> Bölüm Seçmeli</span>
                                <span><b>F:</b> Fakülte Seçmeli</span>
                                <span><b>G:</b> Üniversite Seçmeli</span>
                                <span><b>Y:</b> Ortalamaya Katılmaz</span>
                                <span><b>R:</b> Tekrar</span>
                            </p>
                        </div>
                    </div>
                </div>

            </div> {/* End of printRef div */}
        </div>
    );
}
import { Badge, Button, Card, Table } from '../../components/ui';
