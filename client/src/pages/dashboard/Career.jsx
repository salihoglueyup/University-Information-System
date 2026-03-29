import { ExternalLink } from 'lucide-react';

// Components

// Mock Data
import { jobPostings } from '../../data/mockData';

export default function Career() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase className="text-indigo-600" /> Kariyer Merkezi
                    </h1>
                    <p className="text-slate-500 text-sm">Staj ve iş ilanları, kariyer danışmanlığı ve etkinlikler</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg px-1">Öne Çıkan İlanlar</h3>
                    {jobPostings.map((job) => (
                        <Card key={job.id} className="flex gap-4 p-4 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-center">
                                <img src={job.image} alt={job.company} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                                    <Badge variant="secondary">{job.type}</Badge>
                                </div>
                                <p className="text-slate-500 text-sm mt-1">{job.company} • {job.location}</p>
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                                    <span>Son Başvuru: {job.deadline}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <Button variant="outline" className="w-full">Tüm İlanları Gör</Button>
                </div>

                <div className="space-y-6">
                    <Card className="bg-indigo-600 text-white border-none p-6">
                        <h3 className="font-bold text-lg mb-2">CV Danışmanlığı</h3>
                        <p className="text-indigo-100 text-sm mb-4">
                            Uzmanlarımızla birebir görüşerek CV'nizi ve mülakat tekniklerinizi geliştirin.
                        </p>
                        <Button variant="secondary" className="w-full">Randevu Al</Button>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-lg mb-4 text-slate-800">Mezun Bilgi Sistemi</h3>
                        <p className="text-slate-500 text-sm mb-4">
                            Mezun olduktan sonra da üniversitemizle bağınızı koparmayın.
                        </p>
                        <Button variant="outline" className="w-full justify-between" icon={ExternalLink}>
                            Sisteme Giriş
                        </Button>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
