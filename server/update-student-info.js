const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('MongoDB Connected for Updating Student Info');

        const user = await User.findOne({ username: 'salihoglueyup' });
        if (!user) {
            console.log('Target user not found.');
            process.exit(1);
        }

        const usernameOrId = user.username || user._id.toString();

        const student = await Student.findOne({ id: usernameOrId });

        if (!student) {
            console.log('Student record not found for user');
            process.exit(1);
        }

        student.tcNo = "12345678901";
        student.nationality = "Türkiye Cumhuriyeti";
        student.birthDate = "15/05/2000";
        student.birthPlace = "Trabzon";
        student.gender = "Erkek";
        student.phone = "+90 532 123 45 67";
        student.email = "eyup.salihoglu@stu.iau.edu.tr";
        student.personalEmail = "salihoglueyup@gmail.com";
        student.address = "Küçükçekmece, İstanbul";
        student.emergencyContact = "Ahmet Salihoğlu - 0533 987 65 43";
        student.programLanguage = "Türkçe";
        student.educationType = "Örgün Öğretim";
        student.degreeLevel = "Lisans";
        student.registrationType = "YKS Yerleştirme";
        student.registrationDate = "05/09/2023";
        student.advisor = "Dr. Öğr. Üyesi Eyüp";
        student.scholarship = "%50 İndirimli";
        student.highSchool = "Trabzon Fen Lisesi";
        student.graduationYear = "2019";
        student.diplomaGrade = "92.50";
        student.examYear = "2023";
        student.examScore = "450.231";
        student.placementRank = "45.123";

        await student.save();

        console.log('Student detailed info successfully updated!');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
