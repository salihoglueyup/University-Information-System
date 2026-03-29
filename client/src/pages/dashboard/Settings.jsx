import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

// Components
import { Tabs, Card, Avatar, Button, Input, Switch } from '../../components/ui';
import { ThemeCustomizer } from '../../components/ui/theme/ThemeCustomizer';

import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

// Mock Data
import { currentUser } from '../../data/mockData';

export default function Settings() {
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        announcements: true,
        grades: true
    });

    const [qrCodeData, setQrCodeData] = useState(null);
    const [twoFactorToken, setTwoFactorToken] = useState("");
    const [is2FAEnabled, setIs2FAEnabled] = useState(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        return !!u.isTwoFactorEnabled;
    });

    const handleGenerate2FA = async () => {
        try {
            const res = await axiosInstance.post('/auth/2fa/generate');
            setQrCodeData(res.data.qrCode);
            toast.info("Google Authenticator uygulamasından QR kodu okutunuz.");
        } catch {
            toast.error("QR Kod oluşturulamadı.");
        }
    };

    const handleVerify2FA = async () => {
        if(twoFactorToken.length !== 6) return toast.warning("OTP kodu 6 haneli olmalıdır.");
        try {
            const res = await axiosInstance.post('/auth/2fa/verify', { token: twoFactorToken });
            setIs2FAEnabled(true);
            setQrCodeData(null);
            
            // Update local user 
            const u = JSON.parse(localStorage.getItem('user') || '{}');
            u.isTwoFactorEnabled = true;
            localStorage.setItem('user', JSON.stringify(u));
            localStorage.setItem('token', res.data.accessToken);

            toast.success("İki Aşamalı Doğrulama (2FA) başarıyla aktif edildi!");
        } catch {
            toast.error("Hatalı kod girdiniz. Tekrar deneyin.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            <h1 className="text-2xl font-bold text-slate-800">Hesap Ayarları</h1>

            <Tabs
                tabs={[
                    { id: 'profile', label: 'Profil Bilgileri' },
                    { id: 'security', label: 'Güvenlik & Şifre' },
                    { id: 'notifications', label: 'Bildirimler' },
                    { id: 'appearance', label: 'Görünüm' },
                ]}
            >
                {/* Profile Tab */}
                <div id="profile" className="space-y-6">
                    <Card title="Kişisel Bilgiler">
                        <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar src={currentUser.avatar} alt={currentUser.name} size="lg" className="w-32 h-32 text-2xl" />
                                <Button variant="outline" size="sm">Fotoğraf Değiştir</Button>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <Input label="Ad Soyad" defaultValue={currentUser.name} disabled />
                                <Input label="Öğrenci Numarası" defaultValue={currentUser.studentId} disabled />
                                <Input label="E-Posta" defaultValue={currentUser.email} disabled />
                                <Input label="Telefon" defaultValue="+90 555 123 45 67" />
                                <Input label="Fakülte" defaultValue={currentUser.faculty} disabled />
                                <Input label="Bölüm" defaultValue={currentUser.department} disabled />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                            <Button variant="primary">Değişiklikleri Kaydet</Button>
                        </div>
                    </Card>
                </div>

                {/* Security Tab */}
                <div id="security" className="space-y-6">
                    <Card title="Şifre Değiştir">
                        <div className="p-6 space-y-4 max-w-md">
                            <Input type="password" label="Mevcut Şifre" icon={Lock} />
                            <Input type="password" label="Yeni Şifre" icon={Lock} />
                            <Input type="password" label="Yeni Şifre (Tekrar)" icon={Lock} />
                            <Button variant="primary">Şifreyi Güncelle</Button>
                        </div>
                    </Card>

                    <Card title="İki Adımlı Doğrulama (Google Authenticator)">
                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-slate-800">Hesap Güvenliğini Artırın</h4>
                                    <p className="text-sm text-slate-500">Giriş yaparken Authenticator uygulamanızdan kod istenir.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${is2FAEnabled ? 'text-green-600' : 'text-red-500'}`}>
                                        {is2FAEnabled ? 'Açık' : 'Kapalı'}
                                    </span>
                                    {!is2FAEnabled && (
                                        <Button variant="primary" size="sm" onClick={handleGenerate2FA}>
                                            Aktif Et
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {qrCodeData && !is2FAEnabled && (
                                <div className="mt-4 p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex flex-col items-center gap-4">
                                    <p className="text-sm text-slate-700 font-medium text-center">
                                        Lütfen aşağıdaki QR kodu Google Authenticator'a okutun ve oluşturulan 6 haneli kodu girin.
                                    </p>
                                    <img src={qrCodeData} alt="2FA QR Code" className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm" />
                                    
                                    <div className="flex gap-2 w-full max-w-xs mt-2">
                                        <input 
                                            type="text" 
                                            maxLength="6"
                                            value={twoFactorToken}
                                            onChange={e => setTwoFactorToken(e.target.value.replace(/\D/g, ''))}
                                            placeholder="000000"
                                            className="flex-1 text-center tracking-[0.25em] font-bold py-2 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        <Button variant="primary" onClick={handleVerify2FA}>Onayla</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Notifications Tab */}
                <div id="notifications" className="space-y-6">
                    <Card title="Bildirim Tercihleri">
                        <div className="divide-y divide-slate-100">
                            {[
                                { key: 'email', label: 'E-Posta Bildirimleri', desc: 'Önemli duyurular için e-posta al.' },
                                { key: 'sms', label: 'SMS Bildirimleri', desc: 'Acil durumlar için SMS al.' },
                                { key: 'grades', label: 'Not Açıklanma Bildirimi', desc: 'Notlar girildiğinde anında haberdar ol.' },
                                { key: 'announcements', label: 'Duyurular', desc: 'Genel ve fakülte duyurularını al.' },
                            ].map((item) => (
                                <div key={item.key} className="p-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-slate-800">{item.label}</h4>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                    <Switch
                                        checked={notifications[item.key]}
                                        onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Appearance Tab */}
                <div id="appearance">
                    <Card title="Arayüz Ayarları">
                        <div className="p-6 flex justify-center">
                            <ThemeCustomizer className="shadow-none border-none w-full max-w-sm" />
                        </div>
                    </Card>
                </div>
            </Tabs>
        </motion.div>
    );
}
