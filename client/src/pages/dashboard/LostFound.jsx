import { HelpCircle } from 'lucide-react';

// Components

// Mock Data
import { lostFoundItems } from '../../data/mockData';

export default function LostFound() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <HelpCircle className="text-amber-600" /> Kayıp & Buluntu Eşya
                    </h1>
                    <p className="text-slate-500 text-sm">Kampüs içinde kaybedilen veya bulunan eşyaların takibi</p>
                </div>
                <Button variant="primary" icon={HelpCircle}>Kayıp İlanı Ver</Button>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-800 mb-2">Eşyanızı mı kaybettiniz?</h3>
                    <p className="text-amber-700 text-sm">
                        Bulunan eşyalar güvenlik birimine teslim edilmektedir. Aşağıdaki listeden kontrol edebilir veya yeni bir kayıp ilanı oluşturabilirsiniz.
                    </p>
                </div>
                <div className="w-full md:w-auto flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Input placeholder="Eşya, renk veya yer ara..." className="pl-10 bg-white" />
                        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                    <Button variant="secondary">Ara</Button>
                </div>
            </div>

            <Tabs tabs={[{ id: 'found', label: 'Bulunan Eşyalar' }, { id: 'lost', label: 'Kayıp İlanları' }]}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {lostFoundItems.map((item) => (
                        <Card key={item.id} className="p-4 flex gap-4 hover:shadow-md transition-shadow">
                            <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                <img src={item.image} alt={item.item} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.item}</h4>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                        <MapPin size={12} />
                                        <span>{item.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                        <CalendarDays size={12} />
                                        <span>{item.date}</span>
                                    </div>
                                </div>

                                <Badge variant={item.status.includes('Bulundu') ? 'success' : 'warning'} className="w-fit mt-2">
                                    {item.status}
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            </Tabs>
        </motion.div>
    );
}
