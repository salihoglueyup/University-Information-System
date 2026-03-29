
// Components

// Mock Data
import { radioSchedule } from '../../data/mockData';

export default function RadioTV() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Radio className="text-rose-600" /> IAÜ Radyo & TV
                    </h1>
                    <p className="text-slate-500 text-sm">Üniversite radyosu canlı yayını ve TV prodüksiyonları</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Player Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900 border-none text-white overflow-hidden relative min-h-[300px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-rose-900 opacity-80"></div>
                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 animate-pulse cursor-pointer hover:bg-white/20 transition-colors">
                                <Play size={40} className="ml-1" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">CANLI YAYIN</h2>
                                <p className="text-rose-200">Şu Anda: Kampüsün Sesi</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                ON AIR
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <Tv size={20} className="text-rose-600" /> Son Video İçerikler
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="aspect-video bg-slate-100 rounded-lg relative group cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                        <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Schedule Sidebar */}
                <Card className="p-0 overflow-hidden h-fit">
                    <div className="bg-rose-500 p-4 text-white text-center">
                        <h3 className="font-bold flex items-center justify-center gap-2">
                            <Mic2 size={18} /> Yayın Akışı
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {radioSchedule.map((item, idx) => (
                            <div key={idx} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
                                <span className="font-mono font-bold text-rose-500">{item.time}</span>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{item.program}</p>
                                    <p className="text-xs text-slate-500">{item.host}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
