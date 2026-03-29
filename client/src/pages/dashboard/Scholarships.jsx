import { TrendingUp } from 'lucide-react';

// Components

// Mock Data
import { scholarships } from '../../data/mockData';

export default function Scholarships() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Award className="text-amber-500" /> Burs ve İndirimlerim
                    </h1>
                    <p className="text-slate-500 text-sm">Sahip olduğunuz burslar ve burs başvuruları</p>
                </div>
                <Button variant="outline" icon={TrendingUp}>Burs Olanaklarını İncele</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map((scholarship) => (
                    <Card key={scholarship.id} className="p-6 relative overflow-hidden border-l-4 border-l-amber-500">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Award size={80} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-bold text-slate-800 text-lg mb-1">{scholarship.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{scholarship.type}</p>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Tutar / Oran</span>
                                    <span className="font-bold text-amber-600">{scholarship.amount}</span>
                                </div>
                                {scholarship.paymentDate && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Ödeme Günü</span>
                                        <span className="font-medium">{scholarship.paymentDate}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100 mt-2">
                                    <span className="text-slate-500">Durum</span>
                                    <Badge variant={scholarship.status === 'Aktif' ? 'success' : 'warning'}>
                                        {scholarship.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                <Card className="p-6 flex flex-col justify-center items-center text-center bg-slate-50 border-dashed border-2 border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-sm">
                        <HelpCircle size={24} />
                    </div>
                    <h3 className="font-bold text-slate-700">Yeni Burs Başvurusu</h3>
                    <p className="text-xs text-slate-500 mb-4 px-4">
                        KYK, Vakıf ve Özel burs başvurularını buradan takip edebilirsiniz.
                    </p>
                    <Button variant="secondary" size="sm">Başvuru Yap</Button>
                </Card>
            </div>
        </motion.div>
    );
}
