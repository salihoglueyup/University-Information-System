import { useState } from 'react';
import { FileQuestion, LifeBuoy, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Badge, Button, Card } from '../../components/ui';
import { useSupportTickets, useCreateTicket } from '../../hooks/queries/useSupport';

const CATEGORIES = ['Öğrenci İşleri', 'Bilgi İşlem (Teknik)', 'Mali İşler', 'Kütüphane', 'Diğer'];
const EMPTY_FORM = { category: CATEGORIES[0], subject: '', message: '' };

export default function Support() {
    const [form, setForm] = useState(EMPTY_FORM);
    const { data: tickets = [], isLoading } = useSupportTickets();
    const createTicket = useCreateTicket();

    const handleField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.subject.trim() || !form.message.trim()) {
            toast.warning('Lütfen konu ve mesaj alanlarını doldurun.');
            return;
        }
        createTicket.mutate(form, {
            onSuccess: () => {
                toast.success('Talebiniz oluşturuldu.');
                setForm(EMPTY_FORM);
            },
            onError: (err) => toast.error(err?.response?.data?.message || 'Talep oluşturulamadı.')
        });
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
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                                <select
                                    value={form.category}
                                    onChange={handleField('category')}
                                    className="w-full h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all text-sm px-3"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Konu</label>
                                <input
                                    type="text"
                                    value={form.subject}
                                    onChange={handleField('subject')}
                                    className="w-full h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all text-sm px-3"
                                    placeholder="Örn: Ders kaydı hatası"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mesajınız</label>
                            <textarea
                                value={form.message}
                                onChange={handleField('message')}
                                className="w-full h-32 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all text-sm p-3 resize-none"
                                placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" variant="primary" icon={Send} disabled={createTicket.isPending} className="bg-sky-600 hover:bg-sky-700 border-transparent text-white">
                                {createTicket.isPending ? 'Gönderiliyor...' : 'Gönder'}
                            </Button>
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
                            {isLoading ? (
                                <p className="text-slate-400 text-sm">Yükleniyor...</p>
                            ) : tickets.length === 0 ? (
                                <p className="text-slate-400 text-sm">Henüz talebiniz yok.</p>
                            ) : tickets.map((ticket) => (
                                <div key={ticket.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-700 text-sm">#{String(ticket.id).slice(-6)}</span>
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
