import { useState } from 'react';
import { Save, Plus } from 'lucide-react';

// Components

export default function CvForm() {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <UserSquare2 className="text-sky-600" /> Online CV Oluştur
                    </h1>
                    <p className="text-slate-500 text-sm">Kariyer Merkezi veri tabanı için CV bilgilerinizi güncelleyin</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Önizle</Button>
                    <Button variant="primary" size="sm" icon={Save}>Kaydet</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <Card className="h-fit p-2 lg:col-span-1">
                    <nav className="flex flex-col space-y-1">
                        {[
                            { id: 'personal', label: 'Kişisel Bilgiler' },
                            { id: 'education', label: 'Eğitim Bilgileri' },
                            { id: 'experience', label: 'İş & Staj Deneyimi' },
                            { id: 'skills', label: 'Yetenekler & Sertifikalar' },
                            { id: 'projects', label: 'Projeler' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-sky-50 text-sky-700'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </Card>

                {/* Form Content */}
                <Card className="lg:col-span-3 p-6">
                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Kişisel Bilgiler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Ad" value="Eyüp" disabled />
                                <Input label="Soyad" value="Zal" disabled />
                                <Input label="E-Posta" value="eyupzal@aydin.edu.tr" disabled />
                                <Input label="Telefon" placeholder="05XX XXX XX XX" />
                                <Input label="Doğum Tarihi" type="date" />
                                <Select label="Cinsiyet" options={[{ value: 'e', label: 'Erkek' }, { value: 'k', label: 'Kadın' }]} />
                                <div className="md:col-span-2">
                                    <Textarea label="Kısa Özgeçmiş (Özet)" rows={4} placeholder="Kendinizden kısaca bahsedin..." />
                                </div>
                                <div className="md:col-span-2">
                                    <Input label="Linkedin Profil URL" placeholder="https://linkedin.com/in/..." />
                                </div>
                                <div className="md:col-span-2">
                                    <Input label="Github / Portfolyo URL" placeholder="https://github.com/..." />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-lg font-bold text-slate-800">İş & Staj Deneyimi</h3>
                                <Button variant="ghost" size="sm" icon={Plus} className="text-sky-600">Ekle</Button>
                            </div>

                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                                <p>Henüz iş deneyimi eklenmemiş.</p>
                                <Button variant="outline" size="sm" className="mt-4">Deneyim Ekle</Button>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {['education', 'skills', 'projects'].includes(activeTab) && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h3 className="text-lg font-bold text-slate-800 capitalize">{activeTab}</h3>
                                <Button variant="ghost" size="sm" icon={Plus} className="text-sky-600">Ekle</Button>
                            </div>
                            <p className="text-slate-500 text-sm">Bu bölüm yapım aşamasındadır.</p>
                        </div>
                    )}
                </Card>
            </div>
        </motion.div>
    );
}
