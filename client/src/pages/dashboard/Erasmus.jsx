import { useState } from 'react';
import { FileText, Globe2, Plane, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Alert, Badge, Button, Card, Modal, Input } from '../../components/ui';
import {
    useErasmusApplications,
    useCreateErasmusApplication,
    useErasmusChoices,
    useCreateErasmusChoice,
} from '../../hooks/queries/useErasmus';

const EMPTY_APP = { year: '', term: '', score: '' };
const EMPTY_CHOICE = { university: '', country: '', quota: '' };

const appBadge = (status) => {
    if (status === 'Başvuru Alındı') return 'info';
    if (status === 'Asil') return 'success';
    if (status === 'Yedek') return 'warning';
    return 'danger';
};

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('tr-TR') : '—');

export default function Erasmus() {
    const [appModal, setAppModal] = useState(false);
    const [choiceModal, setChoiceModal] = useState(false);
    const [appForm, setAppForm] = useState(EMPTY_APP);
    const [choiceForm, setChoiceForm] = useState(EMPTY_CHOICE);

    const { data: applications = [] } = useErasmusApplications();
    const { data: choices = [] } = useErasmusChoices();
    const createApp = useCreateErasmusApplication();
    const createChoice = useCreateErasmusChoice();

    const appField = (k) => (e) => setAppForm(p => ({ ...p, [k]: e.target.value }));
    const choiceField = (k) => (e) => setChoiceForm(p => ({ ...p, [k]: e.target.value }));

    const submitApp = (e) => {
        e.preventDefault();
        if (!appForm.year.trim()) { toast.warning('Dönem yılı gereklidir.'); return; }
        createApp.mutate(appForm, {
            onSuccess: () => { toast.success('Başvurunuz alındı.'); setAppForm(EMPTY_APP); setAppModal(false); },
            onError: (err) => toast.error(err?.response?.data?.message || 'Başvuru gönderilemedi.')
        });
    };

    const submitChoice = (e) => {
        e.preventDefault();
        if (!choiceForm.university.trim()) { toast.warning('Üniversite gereklidir.'); return; }
        createChoice.mutate(choiceForm, {
            onSuccess: () => { toast.success('Tercih eklendi.'); setChoiceForm(EMPTY_CHOICE); setChoiceModal(false); },
            onError: (err) => toast.error(err?.response?.data?.message || 'Tercih eklenemedi.')
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
                        <Globe2 className="text-indigo-600" /> Erasmus & Değişim
                    </h1>
                    <p className="text-slate-500 text-sm">Erasmus+ ve Farabi değişim programı işlemleri</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" icon={FileText}>Belgelerim</Button>
                    <Button variant="primary" icon={Plane} onClick={() => setAppModal(true)}>Yeni Başvuru</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Applications History */}
                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-100">Başvuru Geçmişi</h3>
                    <div className="space-y-4">
                        {applications.length === 0 && <p className="text-slate-400 text-sm">Henüz başvurunuz yok.</p>}
                        {applications.map((app) => (
                            <div key={app.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                            Erasmus+ Öğrenim Hareketliliği
                                        </h4>
                                        <p className="text-sm text-slate-500 mt-1">Dönem: {app.year} {app.term ? `/ ${app.term}` : ''}</p>
                                    </div>
                                    <Badge variant={appBadge(app.status)}>{app.status}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm pt-2 border-t border-slate-200">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500">Erasmus Puanı</span>
                                        <span className="font-bold text-indigo-600 text-lg">{app.score}</span>
                                    </div>
                                    <div className="flex flex-col ml-auto text-right">
                                        <span className="text-xs text-slate-500">Son Güncelleme</span>
                                        <span className="font-medium text-slate-700">{fmtDate(app.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* University Choices */}
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800">Tercih Listesi</h3>
                        <Button size="sm" variant="outline" icon={Plus} onClick={() => setChoiceModal(true)}>Tercih Ekle</Button>
                    </div>

                    <div className="space-y-3">
                        {choices.length === 0 && <p className="text-slate-400 text-sm">Henüz tercih eklemediniz.</p>}
                        {choices.map((choice, idx) => (
                            <div key={choice.id} className="flex gap-4 items-center p-3 bg-white hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors group">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{choice.university}</h4>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Globe2 size={12} /> {choice.country || '—'}
                                        </span>
                                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-auto">Kontenjan: {choice.quota}</Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Alert variant="info" className="mt-6 text-xs">
                        Tercih sıralamanızı başvuru bitiş tarihine kadar güncelleyebilirsiniz. Yerleştirmeler puan üstünlüğüne göre yapılacaktır.
                    </Alert>
                </Card>
            </div>

            <Modal isOpen={appModal} onClose={() => setAppModal(false)} title="Yeni Erasmus Başvurusu">
                <form onSubmit={submitApp} className="space-y-4">
                    <Input label="Dönem Yılı" placeholder="Örn. 2026-2027" value={appForm.year} onChange={appField('year')} required />
                    <Input label="Dönem" placeholder="Örn. Güz" value={appForm.term} onChange={appField('term')} />
                    <Input label="Erasmus Puanı (opsiyonel)" type="number" min="0" max="100" value={appForm.score} onChange={appField('score')} />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setAppModal(false)}>İptal</Button>
                        <Button type="submit" variant="primary" disabled={createApp.isPending}>
                            {createApp.isPending ? 'Gönderiliyor...' : 'Başvur'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={choiceModal} onClose={() => setChoiceModal(false)} title="Tercih Ekle">
                <form onSubmit={submitChoice} className="space-y-4">
                    <Input label="Üniversite" placeholder="Örn. TU München" value={choiceForm.university} onChange={choiceField('university')} required />
                    <Input label="Ülke" placeholder="Örn. Almanya" value={choiceForm.country} onChange={choiceField('country')} />
                    <Input label="Kontenjan (opsiyonel)" type="number" min="0" value={choiceForm.quota} onChange={choiceField('quota')} />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setChoiceModal(false)}>İptal</Button>
                        <Button type="submit" variant="primary" disabled={createChoice.isPending}>
                            {createChoice.isPending ? 'Ekleniyor...' : 'Ekle'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
}
