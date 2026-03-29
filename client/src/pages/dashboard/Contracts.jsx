
// Components

// Mock Data
import { contracts } from '../../data/mockData';

export default function Contracts() {
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
                        {contracts.map((contract) => (
                            <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{contract.name}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono">{contract.date}</td>
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
                                    <Button variant="outline" size="sm">Görüntüle</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </motion.div>
    );
}
