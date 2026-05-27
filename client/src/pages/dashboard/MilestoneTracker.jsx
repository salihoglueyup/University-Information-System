import { useParams, useNavigate } from 'react-router-dom';

import { thesisMilestones } from '../../data/mockData';

export default function MilestoneTracker() {
    const { id } = useParams(); // Thesis/Student ID
    const navigate = useNavigate();

    // In a real app, fetch based on id. 
    // using '1' as default for demo since mock data has key '1'
    const data = thesisMilestones[id] || thesisMilestones['1'];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Tamamlandı': return <CheckCircle size={20} className="text-green-500" />;
            case 'Devam Ediyor': return <Clock size={20} className="text-blue-500" />;
            case 'Bekliyor': return <Circle size={20} className="text-gray-300" />;
            case 'Gecikmeli': return <AlertCircle size={20} className="text-red-500" />;
            default: return <Circle size={20} className="text-gray-300" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="pl-0"
                    onClick={() => navigate('/dashboard/thesis')}
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Tez Listesine Dön
                </Button>
            </div>

            <div className="bg-gradient-to-r from-indigo-900 to-blue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-200 text-sm mb-2">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                Lisans Tezi
                            </span>
                            <span>•</span>
                            <span>{data.student}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2 leading-tight">{data.project}</h1>
                        <div className="flex items-center gap-4 text-sm opacity-80">
                            <span className="flex items-center gap-1"><Calendar size={14} /> Başlangıç: {data.startDate}</span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> Bitiş: {data.endDate}</span>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 min-w-[150px] text-center">
                        <div className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Genel İlerleme</div>
                        <div className="text-3xl font-bold">
                            %{Math.round((data.milestones.filter(m => m.status === 'Tamamlandı').length / data.milestones.length) * 100)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Proje Aşamaları (Milestones)">
                        <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            {data.milestones.map((milestone) => (
                                <div key={milestone.id} className="relative pl-8">
                                    <div className="absolute left-0 top-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm z-10">
                                        {getStatusIcon(milestone.status)}
                                    </div>

                                    <div className={`p-5 rounded-xl border transition-all ${milestone.status === 'Devam Ediyor'
                                        ? 'bg-blue-50 border-blue-200 shadow-md transform scale-[1.02]'
                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                                            <div>
                                                <h3 className={`font-bold text-lg ${milestone.status === 'Tamamlandı' ? 'text-gray-900' :
                                                    milestone.status === 'Devam Ediyor' ? 'text-blue-700' : 'text-gray-500'
                                                    }`}>
                                                    {milestone.title}
                                                </h3>
                                                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <Calendar size={14} /> {milestone.date}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {milestone.grade && (
                                                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold">
                                                        <Award size={16} />
                                                        {milestone.grade} Puan
                                                    </div>
                                                )}
                                                <Badge variant={
                                                    milestone.status === 'Tamamlandı' ? 'success' :
                                                        milestone.status === 'Devam Ediyor' ? 'primary' :
                                                            milestone.status === 'Gecikmeli' ? 'danger' : 'neutral'
                                                }>
                                                    {milestone.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        {milestone.feedback && (
                                            <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100 text-sm italic text-gray-600 flex gap-2">
                                                <MessageSquare size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                                                "{milestone.feedback}"
                                            </div>
                                        )}

                                        <div className="flex justify-end mt-4 pt-3 border-t border-gray-100/50 gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                            <Button size="xs" variant="outline">Düzenle</Button>
                                            <Button size="xs" variant="ghost">Dosyalar</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Hızlı İşlemler">
                        <div className="space-y-3">
                            <Button className="w-full justify-start" variant="outline">
                                <FileText size={18} className="mr-2 text-gray-500" />
                                Değerlendirme Gir
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <MessageSquare size={18} className="mr-2 text-gray-500" />
                                Geri Bildirim Yolla
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Calendar size={18} className="mr-2 text-gray-500" />
                                Toplantı Planla
                            </Button>
                        </div>
                    </Card>

                    <Card title="Dosya Deposu">
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-bold text-xs">
                                        PDF
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate text-gray-700">Tez_Taslak_v{i}.pdf</div>
                                        <div className="text-xs text-gray-400">1{i} MB • 12.03.2026</div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400">
                                        <ChevronRight size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-2 text-gray-500">
                            Tüm Dosyaları Gör
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
import { AlertCircle, ArrowLeft, Award, Calendar, CheckCircle, ChevronRight, Circle, Clock, FileText, MessageSquare } from 'lucide-react';
import { Badge, Button, Card } from '../../components/ui';
