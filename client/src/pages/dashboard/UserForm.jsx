import { useState } from 'react';
import { Building, Mail, Power, Save, Shield, User, X } from 'lucide-react';

// Components

const createDefaultFormData = () => ({
    name: '',
    surname: '',
    email: '',
    role: 'STUDENT',
    department: '',
    status: 'Active'
});

const normalizeInitialData = (initialData) => initialData ? { ...createDefaultFormData(), ...initialData } : createDefaultFormData();

function UserFormContent({ onClose, initialData, onSave }) {
    const [formData, setFormData] = useState(() => normalizeInitialData(initialData));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">
                        {initialData ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Oluştur'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Ad</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Soyad</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.surname}
                                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">E-posta Adresi</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Rol</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="STUDENT">Öğrenci</option>
                                    <option value="PROFESSOR">Profesör</option>
                                    <option value="ASSOC_PROF">Doçent</option>
                                    <option value="ASST_PROF">Dr. Öğr. Üyesi</option>
                                    <option value="res_asst">Arş. Gör.</option>
                                    <option value="ADMIN">Yönetici</option>
                                    <option value="STAFF">Personel</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Durum</label>
                            <div className="relative">
                                <Power className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Aktif</option>
                                    <option value="Inactive">Pasif</option>
                                    <option value="Suspended">Askıya Alınmış</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Departman / Bölüm</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Seçiniz</option>
                                <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
                                <option value="Endüstri Mühendisliği">Endüstri Mühendisliği</option>
                                <option value="Makine Mühendisliği">Makine Mühendisliği</option>
                                <option value="Mimarlık">Mimarlık</option>
                                <option value="İşletme">İşletme</option>
                                <option value="Hukuk">Hukuk</option>
                                <option value='Bilgi İşlem'>Bilgi İşlem</option>
                                <option value='Öğrenci İşleri'>Öğrenci İşleri</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="ghost" onClick={onClose} type="button">İptal</Button>
                        <Button variant="primary" icon={Save} type="submit">Kaydet</Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function UserForm({ isOpen, onClose, initialData = null, onSave }) {
    if (!isOpen) return null;

    const formKey = initialData?.id || initialData?._id || 'new';

    return (
        <AnimatePresence>
            <UserFormContent key={formKey} onClose={onClose} initialData={initialData} onSave={onSave} />
        </AnimatePresence>
    );
}
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui';
