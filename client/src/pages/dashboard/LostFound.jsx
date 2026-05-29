import { useState } from 'react';
import { CalendarDays, HelpCircle, MapPin, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Badge, Button, Card, Input, Tabs, Modal, Select, Textarea } from '../../components/ui';
import { useLostFound, useCreateLostFound } from '../../hooks/queries/useLostFound';

const EMPTY_FORM = { item: '', type: 'lost', category: 'Diğer', location: '', description: '' };

export default function LostFound() {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const { data: items = [], isLoading } = useLostFound();
    const createItem = useCreateLostFound();

    const term = search.trim().toLowerCase();
    const filtered = term
        ? items.filter(i =>
            (i.item || '').toLowerCase().includes(term) ||
            (i.location || '').toLowerCase().includes(term))
        : items;

    const handleField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.item.trim()) {
            toast.warning('Lütfen eşya adını girin.');
            return;
        }
        createItem.mutate(form, {
            onSuccess: () => {
                toast.success('İlanınız oluşturuldu.');
                setForm(EMPTY_FORM);
                setIsModalOpen(false);
            },
            onError: () => toast.error('İlan oluşturulamadı, lütfen tekrar deneyin.')
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
                        <HelpCircle className="text-amber-600" /> Kayıp & Buluntu Eşya
                    </h1>
                    <p className="text-slate-500 text-sm">Kampüs içinde kaybedilen veya bulunan eşyaların takibi</p>
                </div>
                <Button variant="primary" icon={HelpCircle} onClick={() => setIsModalOpen(true)}>İlan Ver</Button>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-800 mb-2">Eşyanızı mı kaybettiniz?</h3>
                    <p className="text-amber-700 text-sm">
                        Bulunan eşyalar güvenlik birimine teslim edilmektedir. Aşağıdaki listeden kontrol edebilir veya yeni bir ilan oluşturabilirsiniz.
                    </p>
                </div>
                <div className="w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <Input
                            placeholder="Eşya veya yer ara..."
                            className="pl-10 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                </div>
            </div>

            <Tabs tabs={[{ id: 'found', label: 'Bulunan Eşyalar' }, { id: 'lost', label: 'Kayıp İlanları' }]}>
                {isLoading ? (
                    <p className="text-slate-400 text-sm mt-6">Yükleniyor...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-slate-400 text-sm mt-6">Henüz kayıt bulunmuyor.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {filtered.map((item) => (
                            <Card key={item.id} className="p-4 flex gap-4 hover:shadow-md transition-shadow">
                                <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                                    {item.image
                                        ? <img src={item.image} alt={item.item} className="w-full h-full object-cover" />
                                        : <HelpCircle className="text-slate-300" size={28} />}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.item}</h4>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                            <MapPin size={12} />
                                            <span>{item.location || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                            <CalendarDays size={12} />
                                            <span>{item.date}</span>
                                        </div>
                                    </div>

                                    <Badge variant={(item.status || '').includes('Bulundu') ? 'success' : 'warning'} className="w-fit mt-2">
                                        {item.status || (item.type === 'found' ? 'Bulundu' : 'Kayıp')}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Tabs>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Kayıp / Buluntu İlanı Ver">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Eşya"
                        placeholder="Örn. Siyah cüzdan"
                        value={form.item}
                        onChange={handleField('item')}
                        required
                    />
                    <Select
                        label="Tür"
                        value={form.type}
                        onChange={handleField('type')}
                        options={[{ value: 'lost', label: 'Kayıp' }, { value: 'found', label: 'Buldum' }]}
                    />
                    <Input
                        label="Konum"
                        placeholder="Örn. B Blok 2. kat"
                        value={form.location}
                        onChange={handleField('location')}
                    />
                    <Textarea
                        label="Açıklama"
                        placeholder="Eşya hakkında detay..."
                        value={form.description}
                        onChange={handleField('description')}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button>
                        <Button type="submit" variant="primary" disabled={createItem.isPending}>
                            {createItem.isPending ? 'Gönderiliyor...' : 'İlanı Oluştur'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
}
