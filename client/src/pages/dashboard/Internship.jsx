import { ArrowUpRight, Briefcase, Building2, CalendarDays, Clock, FileCheck, MapPin } from 'lucide-react';

// Components

// Mock Data
import { internshipData, internshipOffers } from '../../data/mockData';

export default function Internship() {
    const daysProgress = (internshipData.mandatory.completedDays / internshipData.mandatory.totalDays) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase className="text-indigo-600" /> Staj İşlemleri
                    </h1>
                    <p className="text-slate-500 text-sm">Zorunlu staj takibi, defter yükleme ve ilanlar</p>
                </div>
            </div>

            <Tabs tabs={[
                { id: 'status', label: 'Staj Durumum' },
                { id: 'offers', label: 'Staj İlanları' }
            ]}>

                {/* Status Tab */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <Card className="lg:col-span-2 p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-6">Zorunlu Staj Durumu</h3>

                        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-slate-600">Tamamlanan Gün: {internshipData.mandatory.completedDays}</span>
                                <span className="text-indigo-600">Hedef: {internshipData.mandatory.totalDays} Gün</span>
                            </div>
                            <ProgressBar value={daysProgress} max={100} color="bg-indigo-600" height="h-3" />
                            {daysProgress === 0 && (
                                <p className="text-xs text-slate-400 mt-2 text-center">Henüz onaylanmış staj kaydınız bulunmamaktadır.</p>
                            )}
                        </div>

                        <h4 className="font-bold text-slate-700 mb-4">Gerekli Belgeler</h4>
                        <div className="space-y-3">
                            {(internshipData.documents || []).map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <FileCheck className={doc.status === 'Onaylandı' ? "text-emerald-500" : "text-slate-300"} size={20} />
                                        <span className="text-sm font-medium text-slate-700">{doc.name}</span>
                                    </div>
                                    <Badge variant={doc.status === 'Onaylandı' ? 'success' : 'secondary'}>{doc.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Staj Geçmişi</h3>
                            <div className="space-y-4">
                                {(internshipData.history || []).map((item) => (
                                    <div key={item.id} className="bg-slate-50 p-4 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-5">
                                            <Briefcase size={60} />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="font-bold text-indigo-900">{item.company}</h4>
                                            <span className="text-xs text-indigo-500 font-bold uppercase tracking-wider">{item.type}</span>

                                            <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                                                <CalendarDays size={14} />
                                                {item.dates} ({item.days} Gün)
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-slate-200">
                                                <Badge variant="success" className="w-full justify-center">Tamamlandı</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Offers Tab */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {internshipOffers.map((offer) => (
                        <Card key={offer.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                    <Building2 size={24} />
                                </div>
                                <Badge variant="secondary">Staj</Badge>
                            </div>

                            <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{offer.title}</h3>
                            <p className="text-slate-500 font-medium mb-4">{offer.company}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin size={16} /> {offer.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock size={16} /> Son Başvuru: <span className="text-slate-800 font-medium">{offer.deadline}</span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all" icon={ArrowUpRight}>İlana Git</Button>
                        </Card>
                    ))}

                    <Card className="p-6 border-dashed border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-sm">
                            <Briefcase size={24} />
                        </div>
                        <h3 className="font-bold text-slate-700">Daha Fazla İlan</h3>
                        <p className="text-xs text-slate-500 mb-4 px-4">
                            Kariyer Merkezi portalındaki tüm staj ilanlarını görüntülemek için tıklayın.
                        </p>
                        <Button variant="secondary" size="sm">Tümünü Gör</Button>
                    </Card>
                </div>

            </Tabs>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card, ProgressBar, Tabs } from '../../components/ui';
