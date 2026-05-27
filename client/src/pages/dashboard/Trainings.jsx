import { BookOpen, CheckCircle, Clock, PlayCircle, Video } from 'lucide-react';

// Mock Data
const trainingsList = [
    {
        id: 1,
        title: "İş Sağlığı ve Güvenliği Temel Eğitimi",
        category: "Zorunlu",
        duration: "4 Saat",
        progress: 100,
        status: "Tamamlandı",
        date: "10.01.2026",
    },
    {
        id: 2,
        title: "Kişisel Verilerin Korunması (KVKK)",
        category: "Zorunlu",
        duration: "2 Saat",
        progress: 45,
        status: "Devam Ediyor",
        date: "Son Tarih: 15.03.2026",
    },
    {
        id: 3,
        title: "Akademik İletişim Becerileri",
        category: "Seçmeli",
        duration: "6 Saat",
        progress: 0,
        status: "Başlamadı",
        date: "-",
    },
    {
        id: 4,
        title: "Yangın Söndürme ve Tahliye",
        category: "Uygulamalı",
        duration: "3 Saat",
        progress: 0,
        status: "Başlamadı",
        date: "-",
    }
];

export default function Trainings() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Eğitimler"
                description="Zorunlu ve isteğe bağlı kurum içi eğitimlerinizi buradan takip edebilirsiniz."
                icon={Video}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Training Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-900 to-blue-800 text-white p-6 rounded-3xl relative overflow-hidden h-full flex flex-col justify-center">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        <div className="relative z-10 text-center">
                            <BookOpen size={48} className="mx-auto mb-4 text-blue-300" />
                            <h3 className="text-xl font-bold mb-2">Eğitim Durumunuz</h3>
                            <div className="flex justify-center items-end gap-2 mb-4">
                                <span className="text-4xl font-bold text-white">1/4</span>
                                <span className="text-blue-200 mb-1">Tamamlandı</span>
                            </div>
                            <div className="w-full bg-blue-950/50 rounded-full h-3 max-w-xs mx-auto overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-400 to-cyan-300 h-3 rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Training List */}
                <div className="lg:col-span-2 space-y-4">
                    {trainingsList.map((training) => (
                        <Card key={training.id} className="p-4 hover:shadow-md transition-shadow group">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                {/* Icon/Thumbnail */}
                                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center
                                    ${training.status === 'Tamamlandı' ? 'bg-green-100 text-green-600' :
                                        training.status === 'Devam Ediyor' ? 'bg-amber-100 text-amber-600' :
                                            'bg-slate-100 text-slate-500'}`}
                                >
                                    {training.status === 'Tamamlandı' ? <CheckCircle size={32} /> :
                                        training.category === 'Uygulamalı' ? <Clock size={32} /> : <PlayCircle size={32} />}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <Badge variant={
                                            training.category === 'Zorunlu' ? 'danger' :
                                                training.category === 'Seçmeli' ? 'primary' : 'warning'
                                        } size="sm">{training.category}</Badge>
                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Clock size={12} /> {training.duration}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                        {training.title}
                                    </h4>

                                    {/* Progress Bar */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${training.status === 'Tamamlandı' ? 'bg-green-500' :
                                                        training.status === 'Devam Ediyor' ? 'bg-amber-500' : 'bg-transparent'
                                                    }`}
                                                style={{ width: `${training.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 w-8">{training.progress}%</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0 flex flex-col items-end gap-2">
                                    {training.status === 'Tamamlandı' ? (
                                        <div className="text-sm font-bold text-green-600 flex items-center gap-1">
                                            <CheckCircle size={16} /> Bitti ({training.date})
                                        </div>
                                    ) : (
                                        <Button variant={training.status === 'Devam Ediyor' ? 'primary' : 'outline'} className="w-full sm:w-auto">
                                            {training.status === 'Devam Ediyor' ? 'Devam Et' : 'Başla'}
                                        </Button>
                                    )}
                                    {training.status !== 'Tamamlandı' && <div className="text-xs text-gray-500">{training.date}</div>}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
import { Badge, Button, Card, PageHeader } from '../../components/ui';
