import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSystemSettings, useUpdateSystemSettings } from '../../hooks/queries/useSystemSettings';

export default function SystemSettings() {
    const { data } = useSystemSettings();
    const updateSettings = useUpdateSystemSettings();
    const [settings, setSettings] = useState({});

    // Seed the editable form state from the server settings.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (data) setSettings(data);
    }, [data]);

    const isSaving = updateSettings.isPending;

    const handleSave = () => {
        updateSettings.mutate(
            {
                activeSemester: settings.activeSemester,
                registrationOpen: settings.registrationOpen,
                allowGradeEntry: settings.allowGradeEntry,
                maintenanceMode: settings.maintenanceMode
            },
            {
                onSuccess: () => toast.success('Ayarlar başarıyla kaydedildi!'),
                onError: () => toast.error('Ayarlar kaydedilemedi.')
            }
        );
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                            <Settings size={24} />
                        </div>
                        Sistem Ayarları
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Üniversite genelindeki sistem yapılandırmalarını yönetin.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Academic Configuration */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Server size={20} className="text-blue-500" />
                        Akademik Yapılandırma
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aktif Dönem</label>
                            <select
                                value={settings.activeSemester}
                                onChange={(e) => handleChange('activeSemester', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            >
                                <option value="2023-2024 Güz">2023-2024 Güz</option>
                                <option value="2023-2024 Bahar">2023-2024 Bahar</option>
                                <option value="2023-2024 Yaz">2023-2024 Yaz</option>
                            </select>
                            <p className="text-xs text-gray-400 mt-1">Tüm öğrenci ve akademisyenlerin gördüğü varsayılan dönemdir.</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <h4 className="font-bold text-gray-800">Ders Kayıtları</h4>
                                <p className="text-xs text-gray-500">Öğrencilerin ders seçimi yapmasına izin ver.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.registrationOpen}
                                    onChange={(e) => handleChange('registrationOpen', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <h4 className="font-bold text-gray-800">Not Girişi</h4>
                                <p className="text-xs text-gray-500">Akademisyenlerin not girmesine izin ver.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.allowGradeEntry}
                                    onChange={(e) => handleChange('allowGradeEntry', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* System Status & Maintenance */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-red-500" />
                        Güvenlik ve Bakım
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                            <div>
                                <h4 className="font-bold text-red-800 flex items-center gap-2">
                                    <Power size={16} /> Bakım Modu
                                </h4>
                                <p className="text-xs text-red-600">
                                    Aktif edildiğinde sadece yöneticiler sisteme giriş yapabilir.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-gray-800">Sistem Sürümü</h4>
                                <p className="text-xs text-gray-500">Mevcut çalışan versiyon.</p>
                            </div>
                            <span className="px-3 py-1 bg-gray-200 rounded-lg text-sm font-mono font-bold text-gray-700">
                                v{settings.systemVersion}
                            </span>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-gray-800">Son Yedekleme</h4>
                                <p className="text-xs text-gray-500">Otomatik veritabanı yedeği.</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm font-medium text-gray-800">{settings.lastBackup}</span>
                                <button className="text-xs text-blue-600 font-bold hover:underline">Şimdi Yedekle</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Power, RefreshCw, Save, Server, Settings, Shield } from 'lucide-react';
