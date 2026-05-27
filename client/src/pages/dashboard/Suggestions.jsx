import { useState } from 'react';
import { MessageSquarePlus, Send, ThumbsUp } from 'lucide-react';

// Components

export default function Suggestions() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
                    <MessageSquarePlus className="text-purple-600" size={32} /> Öneri & Şikayet
                </h1>
                <p className="text-slate-500">
                    Üniversitemizi daha iyi bir yer haline getirmek için fikirleriniz bizim için değerli.
                </p>
            </div>

            {submitted ? (
                <Card className="p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ThumbsUp size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Teşekkürler!</h2>
                    <p className="text-slate-600 max-w-md mx-auto">
                        Geri bildiriminiz başarıyla tarafımıza ulaştı. İlgili birimler tarafından değerlendirilip en kısa sürede dönüş yapılacaktır.
                    </p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>Yeni Bildirim Yap</Button>
                </Card>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 p-8">
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Konu Başlığı"
                                    options={[
                                        { value: 'academic', label: 'Akademik İşler' },
                                        { value: 'campus', label: 'Kampüs Hizmetleri' },
                                        { value: 'cafeteria', label: 'Yemekhane' },
                                        { value: 'it', label: 'Bilgi İşlem / Teknik' },
                                        { value: 'other', label: 'Diğer' }
                                    ]}
                                />
                                <Select
                                    label="Bildirim Türü"
                                    options={[
                                        { value: 'suggestion', label: 'Öneri' },
                                        { value: 'complaint', label: 'Şikayet' },
                                        { value: 'thank', label: 'Teşekkür' }
                                    ]}
                                />
                            </div>

                            <Input label="Konu Özeti" placeholder="Kısaca belirtiniz..." />

                            <Textarea
                                label="Detaylı Açıklama"
                                rows={6}
                                placeholder="Lütfen görüşlerinizi detaylı bir şekilde açıklayınız..."
                            />

                            <div className="pt-4 flex justify-end">
                                <Button variant="primary" size="lg" icon={Send} type="submit">Gönder</Button>
                            </div>
                        </form>
                    </Card>

                    <div className="space-y-6">
                        <Card className="bg-purple-600 text-white border-none p-6">
                            <h3 className="font-bold text-lg mb-4">Çözüm Süreci</h3>
                            <ul className="space-y-4 text-sm text-purple-100">
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">1</div>
                                    <span>Bildiriminiz ilgili daire başkanlığına iletilir.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">2</div>
                                    <span>Konu incelenir ve gerekirse sizinle iletişime geçilir.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">3</div>
                                    <span>Sonuç hakkında e-posta ile bilgilendirilirsiniz.</span>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Button, Card, Input, Select } from '../../components/ui';
