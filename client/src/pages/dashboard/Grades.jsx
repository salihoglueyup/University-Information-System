import { useEffect } from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// Components


import { useSocket } from '../../context/SocketContext';
import { useGrades } from '../../hooks/useGrades';

export default function Grades() {
    const defaultUser = { gpa: "3.85", completedCredits: "120" };
    const user = JSON.parse(localStorage.getItem('user')) || defaultUser;
    const userId = user?.id || user?.username || 'all';

    const { data: gradesData = { currentSemester: [], history: [], distribution: [] }, isLoading } = useGrades(userId);
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    // Listen to real-time Grade Updates via Socket.io
    useEffect(() => {
        if (!socket) return;

        const handleNewGrade = () => {
            // Invalidate the React Query cache to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['grades', userId] });
        };

        socket.on('new_grade', handleNewGrade);
        return () => socket.off('new_grade', handleNewGrade);
    }, [socket, queryClient, userId]);

    // Columns for the grades table
    const columns = [
        { header: 'Ders Kodu', accessor: 'code', className: 'font-mono text-slate-500' },
        { header: 'Ders Adı', accessor: 'name', className: 'font-medium text-slate-900' },
        { header: 'Kredi', accessor: 'credit', className: 'text-center' },
        { header: 'Vize', accessor: 'midterm', className: 'text-center' },
        { header: 'Final', accessor: 'final', className: 'text-center font-bold' },
        {
            header: 'Harf',
            accessor: 'letter',
            render: (row) => (
                <Badge variant={row.letter === 'FF' ? 'danger' : 'success'} className="w-8 justify-center">
                    {row.letter}
                </Badge>
            )
        },
        {
            header: 'Durum',
            accessor: 'status',
            render: (row) => (
                <span className={`text-xs font-semibold ${row.status === 'Geçti' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {row.status}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Ders Notlarım</h1>
                    <p className="text-slate-500 text-sm">2025-2026 Güz Dönemi</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={Calendar}>Geçmiş Dönemler</Button>
                    <Button variant="primary" size="sm" icon={BookOpen}>Transkript İndir</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Genel Not Ort.</p>
                            <div className="text-3xl font-bold text-slate-800 mt-1">
                                <CountUp end={parseFloat(user.gpa)} duration={2000} decimals={2} />
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Award size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Toplam Kredi</p>
                            <div className="text-3xl font-bold text-slate-800 mt-1">
                                <CountUp end={parseInt(user.completedCredits, 10)} duration={2500} />
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                            <BookOpen size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Dönem Ort.</p>
                            <div className="text-3xl font-bold text-slate-800 mt-1">
                                <CountUp end={3.65} duration={1500} />
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Başarı Sırası</p>
                            <div className="text-3xl font-bold text-slate-800 mt-1">
                                <span className="text-sm align-top text-slate-400">#</span>
                                <CountUp end={5} duration={3000} />
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                            <Award size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs
                tabs={[
                    { id: 'grades', label: 'Dönem Notları' },
                    { id: 'analysis', label: 'Başarı Analizi' },
                    { id: 'transcript', label: 'Transkript Özeti' },
                ]}
                onChange={(id) => console.log(id)}
            >
                {/* Tab: Grades */}
                <div id="grades" className="space-y-6">
                    <Alert variant="info" title="Bilgilendirme">
                        Final sınav sonuçları açıklanmaya başlamıştır. İtiraz süresi sonuçlar açıklandıktan sonra 3 iş günüdür.
                    </Alert>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (

                        <Card title="Ders Listesi ve Notlar" className="overflow-hidden">
                            <Table
                                data={gradesData.currentSemester}
                                headers={columns}
                                className="w-full"
                            />
                        </Card>
                    )}
                </div>

                {/* Tab: Analysis */}
                <div id="analysis" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <Card title="Dönemlere Göre Başarı (GNO Trendi)">
                                <div className="p-4">
                                    <LineChart
                                        data={gradesData.history}
                                        xAxisKey="semester"
                                        lines={[
                                            { key: "gno", color: "#3b82f6", name: "GNO" }
                                        ]}
                                    />
                                </div>
                            </Card>

                            <Card title="Harf Notu Dağılımı">
                                <div className="p-4">
                                    <BarChart
                                        data={gradesData.distribution}
                                        xAxisKey="name"
                                        bars={[
                                            { key: "value", color: "#8b5cf6", name: "Ders Sayısı" }
                                        ]}
                                    />
                                </div>
                            </Card>
                        </>
                    )}
                </div>

                {/* Tab: Transcript */}
                <div id="transcript">
                    <Card className="p-8 text-center bg-slate-50 border-dashed">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Detaylı Transkript</h3>
                            <p className="text-slate-500 mb-6">
                                Tüm eğitim hayatınız boyunca aldığınız dersleri ve notları içeren resmi transkript belgesini görüntülemek için aşağıdaki butonu kullanın.
                            </p>
                            <Button variant="primary">Transkript Görüntüle (PDF)</Button>
                        </div>
                    </Card>
                </div>
            </Tabs>
        </div>
    );
}
