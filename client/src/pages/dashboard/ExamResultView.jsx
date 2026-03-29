import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ReferenceLine } from 'recharts';
import Card from '../../components/ui/layout/Card';
import Button from '../../components/ui/navigation/Button';

export default function ExamResultView() {
    const navigate = useNavigate();

    // Mock Data
    const examData = {
        title: "Yazılım Mühendisliğine Giriş - Vize",
        date: "15 Kasım 2025",
        studentScore: 85,
        classAverage: 68,
        highest: 95,
        lowest: 35,
        distribution: [
            { range: '0-20', count: 2 },
            { range: '21-40', count: 5 },
            { range: '41-60', count: 12 },
            { range: '61-80', count: 18 },
            { range: '81-100', count: 8 },
        ]
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Button
                variant="ghost"
                size="sm"
                className="w-fit text-gray-500 pl-0 hover:bg-transparent hover:text-gray-800"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={16} className="mr-2" />
                Geri Dön
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{examData.title}</h1>
                    <p className="text-gray-500">{examData.date}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Share2 size={16} className="mr-2" />
                        Paylaş
                    </Button>
                    <Button variant="outline">
                        <Download size={16} className="mr-2" />
                        Sonuç Belgesi
                    </Button>
                </div>
            </div>

            {/* Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award size={120} />
                    </div>
                    <div className="relative z-10 text-center py-8">
                        <div className="text-blue-100 font-medium mb-2">Puanınız</div>
                        <div className="text-7xl font-bold mb-4">{examData.studentScore}</div>
                        <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            <TrendingUp size={14} />
                            <span>Ortalamanın Üstünde (+{examData.studentScore - examData.classAverage})</span>
                        </div>
                    </div>
                </Card>

                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="p-4 text-center">
                            <div className="text-gray-500 text-sm mb-1">Sınıf Ortalaması</div>
                            <div className="text-2xl font-bold text-gray-800">{examData.classAverage}</div>
                        </Card>
                        <Card className="p-4 text-center">
                            <div className="text-gray-500 text-sm mb-1">En Yüksek</div>
                            <div className="text-2xl font-bold text-green-600">{examData.highest}</div>
                        </Card>
                        <Card className="p-4 text-center">
                            <div className="text-gray-500 text-sm mb-1">En Düşük</div>
                            <div className="text-2xl font-bold text-red-600">{examData.lowest}</div>
                        </Card>
                    </div>

                    <Card className="p-2 flex items-start gap-3 bg-yellow-50 border-yellow-100">
                        <AlertCircle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h4 className="font-bold text-yellow-800 text-sm">Geri Bildirim</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Analiz sonuçlarına göre "Algoritmalar" konusunda çok iyisiniz fakat "Veri Yapıları" sorularında bazı eksikleriniz var. İlgili konuyu tekrar etmeniz önerilir.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Distribution Chart */}
            <Card title="Sınıf Dağılımı" className="p-6">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={examData.distribution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            <ReferenceLine x="61-80" stroke="red" strokeDasharray="3 3" label="Siz" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
