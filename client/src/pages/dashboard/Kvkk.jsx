
// Components

import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';
import { Button, Card } from '../../components/ui';
export default function Kvkk() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-600" /> KVKK Aydınlatma Metni
                    </h1>
                    <p className="text-slate-500 text-sm">Kişisel verilerinizin korunması ve işlenmesi hakkında bilgilendirme</p>
                </div>
            </div>

            <Card className="p-8 max-w-4xl mx-auto">
                <div className="prose prose-slate max-w-none">
                    <h3 className="text-center font-bold text-xl mb-6">İSTANBUL AYDIN ÜNİVERSİTESİ<br />KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ HAKKINDA AYDINLATMA METNİ</h3>

                    <p>
                        İstanbul Aydın Üniversitesi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla,
                        kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında; hukuka ve dürüstlük kurallarına uygun bir şekilde işleyebilecek,
                        kaydedebilecek, saklayabilecek, sınıflandırabilecek, güncelleyebilecek ve mevzuatın izin verdiği hallerde üçüncü kişilere açıklayabilecek/devredebileceğiz.
                    </p>

                    <h4>1. Kişisel Verilerin İşlenme Amacı</h4>
                    <p>
                        Kişisel verileriniz, Üniversitemiz tarafından sunulan eğitim ve öğretim hizmetlerinin yerine getirilmesi, akademik ve idari süreçlerin yürütülmesi,
                        kampüs güvenliğinin sağlanması, yasal yükümlülüklerin yerine getirilmesi gibi amaçlarla işlenmektedir.
                    </p>

                    <h4>2. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h4>
                    <p>
                        Kişisel verileriniz, Üniversitemiz web sitesi, mobil uygulamalar, öğrenci işleri büroları, güvenlik kameraları ve diğer fiziki/dijital kanallar aracılığıyla;
                        kanunlarda açıkça öngörülmesi, sözleşmenin ifası, veri sorumlusunun hukuki yükümlülüğü sebeplerine dayanılarak toplanmaktadır.
                    </p>

                    <h4>3. Kişisel Verilerin Aktarılması</h4>
                    <p>
                        Toplanan kişisel verileriniz; YÖK, SGK gibi kanunen yetkili kamu kurumlarına, iş birliği yapılan eğitim kurumlarına ve tedarikçilerimize,
                        KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar çerçevesinde aktarılabilecektir.
                    </p>

                    <h4>4. Haklarınız</h4>
                    <p>
                        KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
                        haklarına sahipsiniz.
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100 w-full justify-center">
                        <Lock size={18} />
                        <span className="font-semibold text-sm">Bu metni 01.09.2025 tarihinde okudunuz ve onayladınız.</span>
                    </div>
                    <Button variant="outline">PDF Olarak İndir</Button>
                </div>
            </Card>
        </motion.div>
    );
}
