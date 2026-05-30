import { usePrerequisites } from '../../hooks/queries/usePrerequisites';

export default function Prerequisites() {
    const { data: prerequisites = [] } = usePrerequisites();

    const columns = [
        { header: 'Ders Kodu', accessor: 'code', className: "font-mono font-bold text-slate-700 w-32" },
        { header: 'Ders Adı', accessor: 'name', className: "font-medium" },
        {
            header: 'Ön Koşul(lar)',
            accessor: 'prerequisites',
            render: (items) => (
                <div className="flex flex-col gap-1">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded w-fit">
                            <GitMerge size={14} className="rotate-90" />
                            {item}
                        </div>
                    ))}
                </div>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <GitMerge className="text-orange-500" /> Ders Ön Koşulları
                    </h1>
                    <p className="text-slate-500 text-sm">Alınabilmesi için başarılması gereken öncelikli dersler</p>
                </div>
            </div>

            <Alert variant="info" title="Bilgilendirme">
                <p className="text-sm">
                    Ön koşullu dersleri alabilmeniz için, belirtilen ön koşul derslerini en az (DD) veya (S) notu ile başarmış olmanız gerekmektedir.
                    Bazı dersler için AKTS sınırı veya dönem şartı da bulunabilir.
                </p>
            </Alert>

            <Card className="border-none shadow-sm overflow-hidden">
                <Table
                    headers={columns}
                    data={prerequisites}
                    className="w-full"
                />
            </Card>

            <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <Info className="text-orange-600 mt-0.5" />
                <div>
                    <h4 className="font-bold text-orange-800 text-sm">Zincir Ders Uyarısı</h4>
                    <p className="text-orange-700 text-xs mt-1 leading-relaxed">
                        Yazılım Mühendisliği bölümünde; <b>Algoritma I → Algoritma II → Veri Yapıları</b> dersleri birbirine zincirleme bağlıdır.
                        Bu zincirin ilk halkasından kalmanız durumunda, takip eden dönemlerdeki dersleri alamazsınız ve mezuniyetiniz uzayabilir.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { GitMerge, Info } from 'lucide-react';
import { Alert, Card, Table } from '../../components/ui';
