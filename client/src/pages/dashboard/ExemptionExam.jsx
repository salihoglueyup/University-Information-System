import { useState } from 'react';

// Components

// Mock Data
import { examApplications } from '../../data/mockData';

export default function ExemptionExam() {
    const [selectedExam, setSelectedExam] = useState('');
    const [isApplied, setIsApplied] = useState(false);

    const availableExams = examApplications.filter(e => e.type === 'Muafiyet Sınavı');

    const handleApply = (e) => {
        e.preventDefault();
        setIsApplied(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FileCheck className="text-blue-600" /> Muafiyet Sınavı Başvuru
                    </h1>
                    <p className="text-slate-500 text-sm">Yabancı dil ve diğer muafiyet sınavları için başvuru ekranı</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Application Form */}
                <Card className="lg:col-span-2 p-6">
                    {!isApplied ? (
                        <form onSubmit={handleApply} className="space-y-6">
                            <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Başvuru Formu</h3>

                            <Select
                                label="Sınav Türü Seçiniz"
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                options={[
                                    { value: '', label: 'Seçiniz...' },
                                    ...availableExams.map(e => ({ value: e.id, label: e.name }))
                                ]}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Öğrenci No" value="B211200051" disabled />
                                <Input label="Ad Soyad" value="Eyüp Zal" disabled />
                            </div>

                            <Alert variant="info">
                                Başvurunuz onaylandıktan sonra sınav yeri ve saati "Sınav Programım" sayfasında görüntülenecektir.
                            </Alert>

                            <div className="flex justify-end">
                                <Button variant="primary" type="submit" disabled={!selectedExam}>
                                    Başvuruyu Tamamla
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Başvurunuz Alındı!</h3>
                            <p className="text-slate-500 max-w-md">
                                Muafiyet sınavı başvurunuz başarıyla sistemimize iletilmiştir. Başvuru durumunu bu sayfadan takip edebilirsiniz.
                            </p>
                            <Button variant="outline" onClick={() => setIsApplied(false)}>Yeni Başvuru</Button>
                        </div>
                    )}
                </Card>

                {/* Active Applications List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 px-1">Aktif Sınav Takvimi</h3>
                    {availableExams.map((exam) => (
                        <Card key={exam.id} className="border-l-4 border-l-blue-500 bg-slate-50 hover:bg-white transition-colors">
                            <h4 className="font-bold text-slate-700 text-sm mb-2">{exam.name}</h4>
                            <div className="space-y-2 text-xs text-slate-500">
                                <div className="flex justify-between">
                                    <span>Sınav Tarihi:</span>
                                    <span className="font-semibold text-slate-700">{exam.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Son Başvuru:</span>
                                    <span className="font-semibold text-red-600">{exam.deadline}</span>
                                </div>
                                <div className="mt-2 text-right">
                                    <Badge variant="success" className="text-[10px]">{exam.status}</Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { CheckCircle2, FileCheck } from 'lucide-react';
import { Alert, Badge, Button, Card, Input, Select } from '../../components/ui';
