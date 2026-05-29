
// Components

// Mock Data
import { events } from '../../data/mockData';

export default function Events() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="text-pink-600" /> Etkinlik Takvimi
                    </h1>
                    <p className="text-slate-500 text-sm">Üniversitedeki güncel etkinlikler, konferanslar ve festivaller</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden p-0 group hover:shadow-lg transition-shadow">
                        <div className="h-48 overflow-hidden relative">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <Badge variant="primary" className="absolute top-4 right-4 shadow-sm">{event.type}</Badge>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-2">{event.title}</h3>
                            <div className="space-y-2 text-sm text-slate-500 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-pink-500" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-pink-500" />
                                    <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-pink-500" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">Detaylar & Kayıt</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Badge, Button, Card } from '../../components/ui';
