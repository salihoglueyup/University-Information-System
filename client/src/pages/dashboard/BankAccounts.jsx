
import { motion } from 'framer-motion';
export default function BankAccounts() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Banka Hesap Bilgileri</h1>
            <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 text-lg">Bu sayfa yapım aşamasındadır.</p>
                <p className="text-slate-400 text-sm mt-2">Çok yakında hizmetinizde!</p>
            </div>
        </motion.div>
    );
}
