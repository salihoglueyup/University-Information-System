import { ExternalLink } from 'lucide-react';

// Components

// Mock Data
import { virtualTourImages } from '../../data/mockData';

export default function VirtualTour() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <View className="text-sky-600" /> Sanal Tur (360°)
                    </h1>
                    <p className="text-slate-500 text-sm">Kampüsü oturduğunuz yerden keşfedin</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {virtualTourImages.map((spot) => (
                    <Card key={spot.id} className="p-0 overflow-hidden group cursor-pointer relative">
                        <div className="aspect-[4/3] overflow-hidden">
                            <img
                                src={spot.url}
                                alt={spot.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                        <div className="p-4 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="font-bold text-white text-lg">{spot.title}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="bg-sky-50 border border-sky-100 p-8 text-center mt-8">
                <h2 className="text-2xl font-bold text-sky-900 mb-2">VR Deneyimi</h2>
                <p className="text-sky-700 max-w-lg mx-auto mb-6">
                    Daha sürükleyici bir deneyim için VR gözlüğünüzü takın ve kampüsümüzü sanal gerçeklik modunda gezin.
                </p>
                <Button variant="primary" icon={ExternalLink}>Tam Ekran Başlat</Button>
            </Card>
        </motion.div>
    );
}
