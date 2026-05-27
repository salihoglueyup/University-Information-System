const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Student = require('./models/Student');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('MongoDB Connected');

        const username = process.env.SEED_USERNAME || 'salihoglueyup';
        const passwordPlain = process.env.SEED_PASSWORD || 'ChangeMe!123';

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordPlain, salt);

        // Check if user exists
        let user = await User.findOne({ username });
        if (user) {
            console.log('User already exists, updating password...');
            user.password = hashedPassword;
            user.fullName = 'Eyüp Salihoğlu';
            user.role = 'student';
            await user.save();
        } else {
            console.log('Creating new user...');
            user = new User({
                username,
                password: hashedPassword,
                role: 'student',
                fullName: 'Eyüp Salihoğlu'
            });
            await user.save();
        }

        // Check if student exists
        let student = await Student.findOne({ id: username });
        if (student) {
            console.log('Student record already exists.');
        } else {
            console.log('Creating student record...');
            student = new Student({
                id: username,
                name: 'Eyüp Salihoğlu',
                faculty: 'Mühendislik Fakültesi',
                department: 'Yazılım Mühendisliği',
                gpa: '3.50',
                semester: 4,
                status: 'Aktif',
                email: 'salihoglueyup@stu.aydin.edu.tr'
            });
            await student.save();
        }

        console.log('User and Student successfully created/updated.');
        process.exit();
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
