import { AlertCircle, Award, BookOpen, Calendar, CheckCircle, Clock, GraduationCap } from 'lucide-react';
import { academicMilestones } from '../../data/mockData';

export default function AcademicProgress() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Kişisel Akademik Takip"
                description="Doktora/Yüksek Lisans süreçlerinizin ve akademik yayınlarınızın durumu."
                icon={GraduationCap}
            />

            {/* Top Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Progress Card */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-900 text-white border-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="relative z-10 p-2">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <Badge variant="secondary" className="bg-white/10 text-indigo-100 hover:bg-white/20 border-0 mb-3">
                                    {academicMilestones.program}
                                </Badge>
                                <h2 className="text-3xl font-bold mb-1">Aşama: {academicMilestones.stage}</h2>
                                <p className="text-indigo-200 flex items-center gap-2">
                                    <UserIcon size={16} />
                                    Danışman: {academicMilestones.advisor}
                                </p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-indigo-200 text-sm">Tamamlanan Kredi</p>
                                <p className="text-3xl font-bold">{academicMilestones.completedCredits} / {academicMilestones.requiredCredits}</p>
                            </div>
                        </div>

                        {/* Milestones Timeline (Horizontal) */}
                        <div className="flex items-center justify-between text-sm relative">
                            {/* Line */}
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-white/10 -z-10" />

                            {academicMilestones.milestones.slice(0, 5).map((milestone, idx) => {
                                const isCompleted = milestone.status === 'Tamamlandı';

                                return (
                                    <div key={milestone.id} className="flex flex-col items-center gap-3 group cursor-default">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                            milestone.status === 'Yaklaşıyor' ? 'bg-amber-500 border-amber-500 text-white animate-pulse' :
                                                'bg-slate-800 border-slate-600 text-slate-400'
                                            }`}>
                                            {isCompleted ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                        </div>
                                        <div className="text-center">
                                            <p className={`font-semibold ${isCompleted ? 'text-white' : 'text-slate-300'}`}>
                                                {milestone.name}
                                            </p>
                                            <p className="text-xs text-indigo-200/60 mt-0.5">{milestone.date}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                {/* KPI Card */}
                <div className="space-y-4">
                    <Card className="bg-white flex items-center gap-4 p-5 hover:shadow-md transition-all">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Genel Not Ortalaması</p>
                            <h3 className="text-2xl font-bold text-gray-800">{academicMilestones.gpa}</h3>
                        </div>
                    </Card>

                    <Card className="bg-white flex items-center gap-4 p-5 hover:shadow-md transition-all">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Yayın Sayısı</p>
                            <h3 className="text-2xl font-bold text-gray-800">{academicMilestones.publications.length}</h3>
                        </div>
                    </Card>

                    <Card className="bg-white flex items-center gap-4 p-5 hover:shadow-md transition-all">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Kalan Süre</p>
                            <h3 className="text-2xl font-bold text-gray-800">3 Dönem</h3>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Milestones Detail List */}
                <Card title="Süreç Detayları">
                    <div className="space-y-4">
                        {academicMilestones.milestones.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className={`mt-1 p-2 rounded-lg ${item.status === 'Tamamlandı' ? 'bg-green-100 text-green-700' :
                                    item.status === 'Yaklaşıyor' ? 'bg-amber-100 text-amber-700' :
                                        'bg-gray-100 text-gray-500'
                                    }`}>
                                    {item.status === 'Tamamlandı' ? <CheckCircle size={18} /> :
                                        item.status === 'Yaklaşıyor' ? <AlertCircle size={18} /> : <Clock size={18} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                                        <Badge size="sm" variant={
                                            item.status === 'Tamamlandı' ? 'success' :
                                                item.status === 'Yaklaşıyor' ? 'warning' : 'secondary'
                                        }>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {item.date}
                                        </div>
                                        {item.grade && (
                                            <div className="flex items-center gap-1 font-medium text-green-600">
                                                <Award size={12} />
                                                {item.grade}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Publications List */}
                <Card
                    title="Akademik Yayınlar"
                    action={<Button size="xs" variant="ghost">Tümünü Gör</Button>}
                >
                    <div className="space-y-3">
                        {academicMilestones.publications.map((pub) => (
                            <div key={pub.id} className="group border border-gray-100 p-4 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={pub.status === 'Yayınlandı' ? 'success' : 'warning'} className="mb-2">
                                        {pub.status}
                                    </Badge>
                                    {pub.date !== '-' && <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{pub.date}</span>}
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1 leading-tight group-hover:text-indigo-700 transition-colors">
                                    {pub.title}
                                </h4>
                                <p className="text-sm text-gray-500 italic flex items-center gap-2">
                                    <BookOpen size={14} />
                                    {pub.journal}
                                </p>
                            </div>
                        ))}

                        <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 bg-gray-50/50 hover:bg-indigo-50/50">
                            <span className="text-2xl">+</span> Yeni Yayın Ekle
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function UserIcon({ size }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}
import { Badge, Button, Card, PageHeader } from '../../components/ui';
