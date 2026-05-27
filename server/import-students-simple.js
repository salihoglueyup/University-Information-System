// Simplified Student Bulk Import Script
// Creates test students directly in database
// Usage: node import-students-simple.js [--dry-run] [--count 100]

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Student = require('./models/Student');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const countIndex = args.indexOf('--count');
const count = countIndex !== -1 ? parseInt(args[countIndex + 1]) : 100;

console.log('UBIS Student Bulk Import');
console.log('Count:', count);
console.log('Dry Run:', isDryRun ? 'YES' : 'NO');

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'ChangeMe!123';

// Sample data for generation
const faculties = ['Engineering', 'Business', 'Arts', 'Science', 'Education'];
const departments = [
  'Computer Engineering', 'Electronics', 'Machine Engineering',
  'Business Administration', 'Economics', 'Marketing',
  'Literature', 'History', 'Philosophy',
  'Physics', 'Chemistry', 'Biology',
  'Physical Education', 'Primary Education', 'Special Education'
];

const firstNames = ['Ali', 'Mehmet', 'Fatma', 'Ayşe', 'Zeynep', 'Mustafa', 'Hasan',  'Emine', 'Elif', 'Merve'];
const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Aydın', 'Özdemir', 'Arslan', 'Doğan'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateStudentId(index) {
  const year = randomInt(20, 25);
  const dept = randomInt(100, 999);
  const idx = index.toString().padStart(3, '0');
  return 'B' + year + dept + idx;
}

async function createTestData() {
  const users = [];
  const students = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const studentId = generateStudentId(i);
    const department = randomItem(departments);
    const faculty = randomItem(faculties);

    // User record
    users.push({
      username: studentId,
      password: 'hash_will_be_added',
      role: 'student',
      fullName: firstName + ' ' + lastName
    });

    // Student record
    students.push({
      id: studentId,
      name: firstName + ' ' + lastName,
      faculty: faculty,
      department: department,
      gpa: (Math.random() * 2 + 2).toFixed(2),
      semester: randomInt(1, 8),
      status: 'Aktif Ogrenci',
      email: (firstName.toLowerCase() + lastName.toLowerCase() + '@stu.aydin.edu.tr'),
      tcNo: "",
      nationality: 'T.C.',
      birthDate: '1999-01-01',
      birthPlace: 'Istanbul',
      gender: Math.random() > 0.5 ? 'M' : 'F',
      phone: '0555' + randomInt(10000000, 99999999),
      personalEmail: (firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@gmail.com'),
      address: 'Istanbul',
      emergencyContact: 'Veli - 0532 555 0000',
      programLanguage: 'Turkce',
      educationType: 'Orgun Ogretim',
      degreeLevel: 'Lisans',
      registrationType: 'Normal',
      registrationDate: new Date().toISOString().split('T')[0],
      advisor: 'Dr. Ogr. Uyesi TBD',
      scholarship: 'Burssuz'
    });
  }

  return { users, students };
}

async function hashPasswords(users) {
  for (const user of users) {
    user.password = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
  }
  return users;
}

async function main() {
  try {
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/ubis');
    console.log('Connected!');

    console.log('\nGenerating test data...');
    const { users, students } = await createTestData();
    console.log('Generated:', users.length, 'users and', students.length, 'students');

    if (isDryRun) {
      console.log('\n[DRY-RUN MODE - No data will be written]');
      console.log('Sample user:', users[0]);
      console.log('Sample student:', students[0]);
      console.log('\nDry-run completed successfully!');
      process.exit(0);
    }

    console.log('\nHashing passwords...');
    await hashPasswords(users);

    console.log('Inserting users...');
    const insertedUsers = await User.insertMany(users, { ordered: false }).catch(err => {
      if (err.code === 11000) {
        console.warn('Note: Some users already exist (duplicate usernames)');
        return err.insertedDocs || [];
      }
      throw err;
    });
    const usersCreated = Array.isArray(insertedUsers) ? insertedUsers.length : users.length;
    console.log('Users inserted:', usersCreated);

    // Create user map for linking
    const userMap = new Map();
    for (const user of insertedUsers) {
      userMap.set(user.username, user._id);
    }

    // Also fetch existing users to get their IDs
    const existingUsers = await User.find({ username: { $in: users.map(u => u.username) } });
    for (const user of existingUsers) {
      userMap.set(user.username, user._id);
    }

    // Link students to users
    for (let i = 0; i < students.length; i++) {
      const username = users[i].username;
      if (userMap.has(username)) {
        students[i].userId = userMap.get(username);
      }
    }

    console.log('Inserting students...');
    const insertedStudents = await Student.insertMany(students, { ordered: false }).catch(err => {
      if (err.code === 11000) {
        console.warn('Note: Some students already exist (duplicate IDs)');
        return err.insertedDocs || [];
      }
      throw err;
    });
    const studentsCreated = Array.isArray(insertedStudents) ? insertedStudents.length : students.length;
    console.log('Students inserted:', studentsCreated);

    // Statistics
    console.log('\n' + '='.repeat(50));
    console.log('IMPORT COMPLETED');
    console.log('='.repeat(50));
    console.log('Users created:', usersCreated);
    console.log('Students created:', studentsCreated);
    console.log('Linked records:', Math.min(usersCreated, studentsCreated));
    console.log('\nLOGIN CREDENTIALS:');
    console.log('  Username: Student ID (e.g.', users[0].username + ')');
    console.log('  Password: [set via SEED_PASSWORD env var]');

  } catch (error) {
    console.error('\nERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
