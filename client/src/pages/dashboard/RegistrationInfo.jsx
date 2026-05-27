import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { getUser } from '../../utils/authStorage';
// Components

export default function RegistrationInfo() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const storedUser = getUser() || {};
                const username = storedUser.username || storedUser.id;
                if (!username) return;
                const res = await axiosInstance.get('/students/${username}/360');

                if (res.ok) {
                    const data = res.data;
                    setUser({
                        ...data,
                        avatar: data.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name || "Öğrenci") + "&background=6366f1&color=fff",
                        studentId: data.id || "Bilinmiyor"
                    });
                }
            } catch (error) {
                console.error("Error fetching student registration info:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 text-slate-500">
                <p>Öğrenci bilgileri yüklenemedi.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                    <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-100" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
                    <p className="text-slate-500 font-medium">{user.studentId}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                        <Badge variant="success">{user.status}</Badge>
                        <Badge variant="secondary">{user.department}</Badge>
                    </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center min-w-[150px]">
                    <span className="block text-2xl font-bold text-indigo-600">{user.gpa}</span>
                    <span className="text-xs text-slate-500">Genel Not Ortalaması</span>
                </div>
            </div>

            <Tabs
                activeTab={activeTab}
                onChange={setActiveTab}
                tabs={[
                    { id: 'personal', label: 'Kimlik & İletişim' },
                    { id: 'academic', label: 'Akademik Bilgiler' },
                    { id: 'education', label: 'Eğitim Geçmişi' }
                ]}
            />

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <Card className="p-0 overflow-hidden">
                        <h3 className="font-bold text-slate-800 p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <Fingerprint size={18} className="text-indigo-500" /> Kimlik Bilgileri
                        </h3>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase">TC Kimlik No</span>
                                    <span className="text-slate-800 font-medium">{user.tcNo}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase">Uyruk</span>
                                    <span className="text-slate-800 font-medium">{user.nationality}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase">Doğum Tarihi</span>
                                    <span className="text-slate-800 font-medium">{user.birthDate}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase">Doğum Yeri</span>
                                    <span className="text-slate-800 font-medium">{user.birthPlace}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase">Cinsiyet</span>
                                    <span className="text-slate-800 font-medium">{user.gender}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden">
                        <h3 className="font-bold text-slate-800 p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <Phone size={18} className="text-emerald-500" /> İletişim Bilgileri
                        </h3>
                        <div className="p-4 space-y-4">
                            <div>
                                <span className="text-xs text-slate-400 block uppercase">Cep Telefonu</span>
                                <span className="text-slate-800 font-medium">{user.phone}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block uppercase">Kurumsal E-Posta</span>
                                <span className="text-slate-800 font-medium">{user.email}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block uppercase">Kişisel E-Posta</span>
                                <span className="text-slate-800 font-medium">{user.personalEmail}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block uppercase mb-1">Adres</span>
                                <div className="flex gap-2">
                                    <MapPin size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-800 text-sm">{user.address}</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <span className="text-xs text-red-400 block uppercase font-bold">Acil Durum Kişisi</span>
                                <span className="text-slate-800 text-sm font-medium">{user.emergencyContact}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Academic Info Tab */}
            {activeTab === 'academic' && (
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <Card className="p-0 overflow-hidden">
                        <h3 className="font-bold text-slate-800 p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <BookOpen size={18} className="text-blue-500" /> Program Bilgileri
                        </h3>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">Fakülte</span>
                                <span className="font-medium text-slate-800 text-right">{user.faculty}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">Bölüm</span>
                                <span className="font-medium text-slate-800 text-right">{user.department}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">Öğretim Dili</span>
                                <span className="font-medium text-slate-800 text-right">{user.programLanguage}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">Eğitim Türü</span>
                                <span className="font-medium text-slate-800 text-right">{user.educationType}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500 text-sm">Derece</span>
                                <span className="font-medium text-slate-800 text-right">{user.degreeLevel}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden">
                        <h3 className="font-bold text-slate-800 p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <CalendarDays size={18} className="text-orange-500" /> Kayıt Detayları
                        </h3>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <span className="text-slate-500 text-sm">Giriş Türü</span>
                                <span className="font-bold text-slate-800">{user.registrationType}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <span className="text-slate-500 text-sm">Kayıt Tarihi</span>
                                <span className="font-bold text-slate-800">{user.registrationDate}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                <span className="text-slate-500 text-sm">Danışman</span>
                                <span className="font-bold text-slate-800">{user.advisor}</span>
                            </div>
                            <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg">
                                <span className="text-indigo-600 text-sm font-medium">Burs Bilgisi</span>
                                <span className="font-bold text-indigo-800">{user.scholarship}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Education History Tab */}
            {activeTab === 'education' && (
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <Card className="p-0 overflow-hidden">
                        <h3 className="font-bold text-slate-800 p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <GraduationCap size={18} className="text-purple-500" /> Önceki Mezuniyet
                        </h3>
                        <div className="p-4 space-y-4">
                            <div className="mb-4">
                                <span className="text-xs text-slate-400 block uppercase">Lise Adı</span>
                                <span className="text-lg font-bold text-slate-800">{user.highSchool}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase">Mezuniyet Yılı</span>
                                    <span className="text-slate-800 font-medium">{user.graduationYear}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase">Diploma Notu</span>
                                    <span className="text-slate-800 font-medium">{user.diplomaGrade}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden">
                        <h3 className="font-bold text-slate-800 p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <Award size={18} className="text-amber-500" /> Sınav Bilgileri (YKS)
                        </h3>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-slate-400 block uppercase">Sınav Yılı</span>
                                    <span className="text-slate-800 font-medium">{user.examYear}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs text-slate-400 block uppercase">Yerleştirme Puanı</span>
                                    <span className="text-xl font-bold text-amber-600">{user.examScore}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs text-slate-400 block uppercase">Başarı Sıralaması</span>
                                    <span className="text-lg font-bold text-slate-800">{user.placementRank}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <Alert variant="info" title="Bilgi Güncelleme Talebi">
                Kişisel bilgilerinizde (adres, telefon vb.) değişiklik olması durumunda, Öğrenci Bilgi Sistemi (OBS) üzerinden güncelleme yapabilir veya Öğrenci İşleri Daire Başkanlığına başvurabilirsiniz.
            </Alert>
        </motion.div>
    );
}
import { motion } from 'framer-motion';
import { Award, BookOpen, CalendarDays, Fingerprint, GraduationCap, MapPin, Phone } from 'lucide-react';
import { Alert, Badge, Card, Tabs } from '../../components/ui';
