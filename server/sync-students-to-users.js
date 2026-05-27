const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');

// Ortam değişkenlerini yükle
dotenv.config();

async function syncStudentsToUsers() {
    try {
        console.log('MongoDB bağlantısı kuruluyor...');
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/ubis');
        console.log('MongoDB bağlantısı başarılı.');

        console.log('Öğrenciler veritabanından çekiliyor. Bu işlem biraz zaman alabilir...');
        // Tüm öğrencileri yormamak için sadece gerekli olan alanları (.lean() kullanarak hızlıca) çekiyoruz.
        const students = await Student.find({}, 'id name').lean();
        console.log(`Toplam ${students.length} adet öğrenci bulundu.`);

        console.log('Varsayılan şifre (12345Asd) şifreleniyor...');
        const hashedPassword = await bcrypt.hash('12345Asd', 10);

        // Performans için verileri 1000'erli yığınlar (batch) halinde yazacağız: bulkWrite
        let bulkOps = [];
        let count = 0;

        console.log('Kullanıcı senkronizasyonu başlatılıyor...');
        
        for (const student of students) {
            bulkOps.push({
                updateOne: {
                    filter: { username: student.id }, // Kullanıcı adları öğrenci ID'si (Öğrenci No)
                    update: {
                        $setOnInsert: {
                            username: student.id,
                            password: hashedPassword,
                            role: 'student',
                            fullName: student.name
                        }
                    },
                    upsert: true // Eğer bu username yoksa ekle, varsa elleme ($setOnInsert)
                }
            });

            if (bulkOps.length === 1000) {
                await User.bulkWrite(bulkOps, { ordered: false });
                count += 1000;
                console.log(`${count} öğrenci senkronize edildi...`);
                bulkOps = [];
            }
        }

        if (bulkOps.length > 0) {
            await User.bulkWrite(bulkOps, { ordered: false });
            count += bulkOps.length;
            console.log(`${count} öğrenci senkronize edildi...`);
        }

        console.log('\n=======================================');
        console.log('TÜM ÖĞRENCİLERE BAŞARIYLA KULLANICI HESABI OLUŞTURULDU!');
        console.log('Artık öğrenciler kendi [Öğrenci No] ları ve şifreleri [12345Asd] ile giriş yapabilirler.');
        console.log('=======================================\n');
        
        process.exit(0);
    } catch (err) {
        console.error('Senkronizasyon sırasında hata oluştu:', err);
        process.exit(1);
    }
}

syncStudentsToUsers();