import { AlertTriangle, BookX, CreditCard, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Alert, Button, Card } from '../../components/ui';
import { useLibraryFines, usePayFine } from '../../hooks/queries/useLibraryFines';

export default function LibraryFines() {
    const { data: fines = [] } = useLibraryFines();
    const payFine = usePayFine();

    const unpaid = fines.filter(f => f.status !== 'Ödendi');
    const paid = fines.filter(f => f.status === 'Ödendi');

    const handlePay = (id) => {
        payFine.mutate(id, {
            onSuccess: () => toast.success('Ödeme alındı.'),
            onError: () => toast.error('Ödeme yapılamadı.')
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
                        <BookX className="text-red-600" /> Kütüphane Borçları
                    </h1>
                    <p className="text-slate-500 text-sm">Gecikmiş kitap iadeleri ve cezalar</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" /> Ödenmemiş Cezalar
                    </h3>

                    {unpaid.length > 0 ? (
                        <div className="space-y-4">
                            {unpaid.map((fine) => (
                                <div key={fine.id} className="border border-red-100 bg-red-50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-16 bg-slate-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                                            <div className="w-full h-full bg-slate-300"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{fine.book}</h4>
                                            <div className="text-sm text-red-700 mt-1">
                                                <span className="font-bold">Ceza Tutarı: {fine.fine}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                İade Tarihi: {fine.returnDate || '—'} (Son Gün: {fine.dueDate || '—'})
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="danger" icon={CreditCard} disabled={payFine.isPending} onClick={() => handlePay(fine.id)}>
                                        Ödeme Yap
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                                <BookX size={32} />
                            </div>
                            <h3 className="font-bold text-slate-700">Borcunuz Bulunmamaktadır</h3>
                            <p className="text-slate-500 text-sm mt-1">Teşekkür ederiz.</p>
                        </div>
                    )}
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <History className="text-slate-400" /> Geçmiş Ödemeler
                        </h3>
                        {paid.length > 0 ? (
                            <div className="space-y-2">
                                {paid.map((fine) => (
                                    <div key={fine.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
                                        <span className="font-medium text-slate-700 truncate mr-2">{fine.book}</span>
                                        <span className="text-emerald-600 font-bold whitespace-nowrap">{fine.fine}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                                Kayıt bulunamadı.
                            </div>
                        )}
                    </Card>

                    <Alert variant="info" title="Ceza Hesaplaması">
                        Geciken her gün için <strong>1.50 ₺</strong> ceza uygulanır. 30 günü geçen gecikmelerde kitap bedeli tahsil edilir.
                    </Alert>
                </div>
            </div>
        </motion.div>
    );
}
