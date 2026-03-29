
// Components

// Mock Data
import { diningMenu } from '../../data/mockData';

export default function DiningMenu() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Utensils className="text-orange-500" /> Yemekhane Menüsü
                    </h1>
                    <p className="text-slate-500 text-sm">Haftalık yemek listesi ve kalori bilgileri</p>
                </div>
            </div>

            <Alert variant="success" title="Diyetisyen Notu">
                <p className="text-sm">
                    Tüm yemeklerimiz gıda mühendisleri denetiminde, günlük kalori ihtiyacınıza uygun olarak hazırlanmaktadır.
                    Vejetaryen menü seçeneğimiz mevcuttur.
                </p>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {diningMenu.map((menu, idx) => (
                    <Card key={idx} className={`flex flex-col h-full border-t-4 ${idx === 0 ? 'border-t-orange-500 shadow-md ring-2 ring-orange-100' : 'border-t-slate-300'}`}>
                        <div className="text-center p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-lg">{menu.day}</h3>
                            <p className="text-slate-500 text-sm">{menu.date}</p>
                        </div>

                        <div className="p-4 flex-1 space-y-3">
                            <div className="bg-orange-50 p-2 rounded-lg text-center">
                                <span className="text-sm text-orange-800 font-bold">{menu.soup}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg text-center">
                                <span className="text-base text-slate-800 font-bold block">{menu.main}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg text-center">
                                <span className="text-sm text-slate-700">{menu.side}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg text-center">
                                <span className="text-sm text-slate-700">{menu.extra}</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                            <Badge variant="ghost" className="text-slate-500">
                                <Flame size={12} className="mr-1 text-red-500" /> {menu.calories} kCal
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-medium">
                    <Leaf size={16} />
                    <span>Vejetaryen menü için lütfen yemekhane görevlisine bilgi veriniz.</span>
                </div>
            </div>
        </motion.div>
    );
}
