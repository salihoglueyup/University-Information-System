import { Languages } from 'lucide-react';

// Components

export default function LanguageExam() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Globe className="text-indigo-600" /> 2. Yabancı Dil Sınavı
                    </h1>
                    <p className="text-slate-500 text-sm">Seviye tespit ve kur bitirme sınav sonuçları</p>
                </div>
                <Button variant="primary" icon={Languages}>Seviye Tespit Başvurusu</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-l-4 border-l-indigo-500">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Mevcut Dil Durumu</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="font-medium text-slate-600">Seçilen Dil</span>
                            <span className="font-bold text-indigo-700">İspanyolca</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="font-medium text-slate-600">Gerekli Seviye</span>
                            <span className="font-bold text-slate-800">A2</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                            <span className="font-medium text-slate-600">Tamamlanan Kur</span>
                            <Badge variant="success">A1 Tamamlandı</Badge>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Son Sınav Sonucu</h3>
                    <div className="text-center py-6">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">85</div>
                        <h4 className="font-bold text-slate-700">İspanyolca A1 Final Sınavı</h4>
                        <p className="text-sm text-slate-500 mt-1">Sınav Tarihi: 15.01.2026</p>
                        <div className="mt-4">
                            <Badge variant="success" className="px-4 py-1">BAŞARILI</Badge>
                        </div>
                    </div>
                </Card>
            </div>

            <Alert variant="info" title="Kurallar">
                2. Yabancı Dil derslerinden muaf olabilmek veya bir üst kura geçebilmek için yapılacak seviye tespit sınavlarında
                en az <b>60 puan</b> almanız gerekmektedir.
            </Alert>
        </motion.div>
    );
}
