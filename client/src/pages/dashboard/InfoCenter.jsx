import { ExternalLink } from 'lucide-react';

// Mock Data
import { infoCenterResources } from '../../data/mockData';

export default function InfoCenter() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Library size={200} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-bold mb-4">Bilgi Merkezi & Kütüphane</h1>
                    <p className="text-indigo-200 mb-8">7/24 erişilebilir milyonlarca elektronik kaynak, e-kitap ve akademik makale.</p>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Katalog tarama (Kitap, Makale, Dergi...)"
                                className="w-full pl-10 h-12 rounded-xl border-0 !bg-white/10 !text-white placeholder:text-indigo-300 focus:!bg-white/20 focus:ring-2 focus:ring-indigo-400 transition-all"
                            />
                        </div>
                        <Button variant="primary" className="h-12 px-8 bg-indigo-500 hover:bg-indigo-400 text-white border-transparent">Ara</Button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Database className="text-emerald-600" /> Popüler Veritabanları
                    </h3>
                    <div className="space-y-3">
                        {infoCenterResources.map((res) => (
                            <div key={res.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                                <div>
                                    <h4 className="font-bold text-slate-700">{res.name}</h4>
                                    <span className="text-xs text-slate-500">{res.type}</span>
                                </div>
                                <Button variant="ghost" size="sm" icon={ExternalLink} />
                            </div>
                        ))}
                    </div>
                    <Button variant="secondary" className="w-full mt-4">Tümünü Gör</Button>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Globe className="text-blue-600" /> Kampüs Dışı Erişim
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Kampüs dışından veritabanlarına erişmek için Proxy ayarlarını yapmanız veya VPN kullanmanız gerekmektedir.
                    </p>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Lock size={16} className="text-blue-600" />
                            <span className="font-bold text-blue-800 text-sm">Proxy Ayarları</span>
                        </div>
                        <div className="text-xs text-blue-700">
                            <strong>Adres:</strong> proxy.aydin.edu.tr <br />
                            <strong>Port:</strong> 8080
                        </div>
                    </div>
                    <Button variant="outline" className="w-full">Kurulum Rehberi</Button>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <BookOpen className="text-purple-600" /> E-Kitap Koleksiyonu
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-2 rounded-lg text-center cursor-pointer hover:bg-slate-100">
                            <div className="h-24 bg-slate-200 rounded mb-2 w-full"></div>
                            <span className="text-xs font-bold text-slate-600">Mühendislik</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg text-center cursor-pointer hover:bg-slate-100">
                            <div className="h-24 bg-slate-200 rounded mb-2 w-full"></div>
                            <span className="text-xs font-bold text-slate-600">Tıp</span>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
