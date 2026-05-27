import { FileQuestion, LifeBuoy, MessageCircle, Send } from 'lucide-react';

// Mock Data
import { supportTickets } from '../../data/mockData';

export default function Support() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <LifeBuoy className="text-sky-600" /> Yardım ve Destek
                    </h1>
                    <p className="text-slate-500 text-sm">Sorun bildirin, taleplerinizi takip edin</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* New Ticket Form */}
                <Card className="lg:col-span-2 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <MessageCircle className="text-sky-500" /> Yeni Talep Oluştur
                    </h3>
                    <form className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                                <select className="w-full h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all text-sm px-3">
                                    <option>Öğrenci İşleri</option>
                                    <option>Bilgi İşlem (Teknik)</option>
                                    <option>Mali İşler</option>
                                    <option>Kütüphane</option>
                                    <option>Diğer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Konu</label>
                                <input type="text" className="w-full h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all text-sm px-3" placeholder="Örn: Ders kaydı hatası" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mesajınız</label>
                            <textarea className="w-full h-32 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all text-sm p-3 resize-none" placeholder="Sorununuzu detaylı bir şekilde açıklayın..."></textarea>
                        </div>

                        <div className="flex justify-end">
                            <Button variant="primary" icon={Send} className="bg-sky-600 hover:bg-sky-700 border-transparent text-white">Gönder</Button>
                        </div>
                    </form>
                </Card>

                {/* My Tickets */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FileQuestion className="text-slate-400" /> Taleplerim
                        </h3>
                        <div className="space-y-3">
                            {supportTickets.map((ticket) => (
                                <div key={ticket.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-700 text-sm">#{ticket.id}</span>
                                        <Badge variant={ticket.status === 'Çözüldü' ? 'success' : 'warning'}>{ticket.status}</Badge>
                                    </div>
                                    <h4 className="font-medium text-slate-800 text-sm mb-1">{ticket.subject}</h4>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>{ticket.category}</span>
                                        <span>{ticket.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-800 text-slate-300">
                        <h3 className="font-bold text-white mb-2">Sıkça Sorulan Sorular</h3>
                        <ul className="space-y-2 text-sm list-disc pl-4">
                            <li>Parolamı nasıl sıfırlarım?</li>
                            <li>Ders kaydı ne zaman başlıyor?</li>
                            <li>Transkript nasıl alabilirim?</li>
                        </ul>
                        <Button variant="outline" className="w-full mt-4 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-700">Tümünü Gör</Button>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Badge, Button, Card } from '../../components/ui';
