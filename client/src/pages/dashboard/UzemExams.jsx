import { AlertTriangle, Clock, PlayCircle, Wifi } from 'lucide-react';

// Components

// Mock Data
import { uzemExams } from '../../data/mockData';

export default function UzemExams() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Wifi className="text-purple-600" /> UZEM (Online) Sınavlar
                    </h1>
                    <p className="text-slate-500 text-sm">Uzaktan Eğitim Merkezi üzerinden yapılan sınavlar</p>
                </div>
            </div>

            <Alert variant="warning" title="Önemli Sınav Kuralları">
                <ul className="list-disc pl-4 text-xs space-y-1">
                    <li>Sınav süresi başladığında "Sınava Başla" butonu aktif olacaktır.</li>
                    <li>İnternet bağlantı kopukluğunda sınav süreniz işlemeye devam eder.</li>
                    <li>Sınav sırasında başka bir tarayıcı sekmesi açmak kopya muamelesi görmenize sebep olabilir.</li>
                </ul>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {uzemExams.map((exam) => (
                    <Card key={exam.id} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <Badge variant="secondary" className="mb-1">{exam.code}</Badge>
                                <h3 className="font-bold text-slate-800">{exam.name}</h3>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-slate-400 uppercase">{exam.type}</span>
                                <span className="font-mono text-sm font-semibold">{exam.date.split(' ')[0]}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-600 mb-6">
                            <div className="flex items-center gap-1.5">
                                <Clock size={16} className="text-purple-500" />
                                <span>Saat: <b>{exam.date.split(' ')[1]}</b></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <AlertTriangle size={16} className="text-orange-500" />
                                <span>Süre: <b>{exam.duration}</b></span>
                            </div>
                        </div>

                        <Button
                            variant={exam.status === 'Aktif' ? 'primary' : 'disabled'}
                            className="w-full justify-center"
                            disabled={exam.status !== 'Aktif'}
                            icon={PlayCircle}
                        >
                            {exam.status === 'Aktif' ? 'Sınava Başla' : 'Sınav Saati Bekleniyor'}
                        </Button>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Alert, Badge, Button, Card } from '../../components/ui';
