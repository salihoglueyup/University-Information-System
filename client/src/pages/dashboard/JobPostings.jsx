import { useState } from 'react';
import { ArrowRight, Briefcase, Building, Calendar, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge, Button, Card } from '../../components/ui';
import { useJobPostings } from '../../hooks/queries/useJobPostings';

const TYPES = ['Tüm İlanlar', 'Staj', 'Yarı Zamanlı', 'Tam Zamanlı'];

export default function JobPostings() {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('Tüm İlanlar');
    const { data: jobs = [], isLoading } = useJobPostings();

    const term = search.trim().toLowerCase();
    const filtered = jobs.filter(job => {
        const matchesType = type === 'Tüm İlanlar' || job.type === type;
        const matchesSearch = !term ||
            (job.title || '').toLowerCase().includes(term) ||
            (job.company || '').toLowerCase().includes(term);
        return matchesType && matchesSearch;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase className="text-indigo-600" /> İş ve Staj İlanları
                    </h1>
                    <p className="text-slate-500 text-sm">Hayalindeki kariyere bir adım daha yaklaş</p>
                </div>
                <Button variant="primary" icon={ArrowRight}>CV Oluştur</Button>
            </div>

            {/* Search Filter */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Pozisyon, şirket veya anahtar kelime..."
                            className="w-full pl-10 h-10 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm px-3 md:w-48"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </Card>

            <div className="grid gap-4">
                {isLoading ? (
                    <p className="text-slate-400 text-sm">Yükleniyor...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-slate-400 text-sm">Kriterlere uygun ilan bulunamadı.</p>
                ) : filtered.map((job) => (
                    <Card key={job.id} className="p-6 hover:shadow-md transition-shadow group cursor-pointer">
                        <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl p-2 flex items-center justify-center shadow-sm">
                                {job.image
                                    ? <img src={job.image} alt={job.company} className="w-full h-full object-contain" />
                                    : <Building className="text-slate-300" size={28} />}
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <Building size={14} /> {job.company || '—'}
                                        </div>
                                    </div>
                                    <Badge variant={job.type === 'Staj' ? 'info' : 'success'}>{job.type}</Badge>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-3 border-t border-slate-50 pt-3">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location || '—'}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> Son Başvuru: {job.deadline || '—'}</span>
                                </div>
                            </div>

                            <div className="self-center mt-4 md:mt-0">
                                <Button variant="outline" className="w-full md:w-auto">Detaylar</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
