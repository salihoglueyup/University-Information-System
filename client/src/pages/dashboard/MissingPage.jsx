import { useNavigate } from 'react-router-dom';

export default function MissingPage() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6"
        >
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-6">
                <Construction size={48} />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hazırlık Aşamasında</h1>
            <p className="text-gray-500 max-w-md mb-8">
                Bu sayfa şu anda geliştirme aşamasındadır. En kısa sürede kullanıma açılacaktır.
            </p>

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold transition-all shadow-sm"
            >
                <ArrowLeft size={18} />
                Geri Dön
            </button>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { ArrowLeft, Construction } from 'lucide-react';
