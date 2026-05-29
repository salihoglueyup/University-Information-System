import { motion } from 'framer-motion';
import { Check, Clock, FileSignature } from 'lucide-react';
import { toast } from 'react-toastify';
import { Badge, Button, Card } from '../../components/ui';
import { useContracts, useSignContract } from '../../hooks/queries/useContracts';

export default function Contracts() {
    const { data: contracts = [], isLoading } = useContracts();
    const signContract = useSignContract();

    const handleSign = (id) => {
        signContract.mutate(id, {
            onSuccess: () => toast.success('Sözleşme onaylandı.'),
            onError: () => toast.error('Sözleşme onaylanamadı.')
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
                        <FileSignature className="text-indigo-600" /> Sözleşmelerim
                    </h1>
                    <p className="text-slate-500 text-sm">Üniversite ile aranızdaki dijital sözleşme ve taahhütnameler</p>
                </div>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Sözleşme Adı</th>
                            <th className="px-6 py-4">Onay Tarihi</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Yükleniyor...</td></tr>
                        ) : contracts.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Sözleşmeniz bulunmuyor.</td></tr>
                        ) : contracts.map((contract) => (
                            <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{contract.name}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono">{contract.date || '—'}</td>
                                <td className="px-6 py-4">
                                    {contract.status === 'Onaylandı' ? (
                                        <Badge variant="success" className="bg-emerald-100 text-emerald-700">
                                            <Check size={12} className="mr-1" /> Onaylandı
                                        </Badge>
                                    ) : (
                                        <Badge variant="warning">
                                            <Clock size={12} className="mr-1" /> Onay Bekliyor
                                        </Badge>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {contract.status === 'Onaylandı' ? (
                                        <Button variant="outline" size="sm">Görüntüle</Button>
                                    ) : (
                                        <Button variant="primary" size="sm" disabled={signContract.isPending} onClick={() => handleSign(contract.id)}>
                                            Onayla
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </motion.div>
    );
}
