const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Student = require('./models/Student');

// Configuration
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : null;

const BATCH_SIZE = 500;
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'ChangeMe!123';

const stats = {
  processed: 0,
  usersCreated: 0,
  studentsCreated: 0,
  linked: 0,
  errors: 0,
  errorDetails: []
};

console.log('Starting UBIS Student Import Script');
console.log('Dry Run:', isDryRun ? 'YES' : 'NO');
console.log('Limit:', limit ? limit + ' records' : 'ALL');

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/ubis');
    console.log('MongoDB Connected');

    console.log('Scanning for student data files...');
    const studentData = await scanStudentFiles();
    console.log('Found', studentData.length, 'students');

    if (studentData.length === 0) {
      console.log('WARNING: No student data found. Run scripts/generate-students.js first');
      process.exit(0);
    }

    const dataToImport = limit ? studentData.slice(0, limit) : studentData;
    console.log('Processing:', dataToImport.length, 'records');

    await processBatches(dataToImport);

    printReport();

  } catch (error) {
    console.error('ERROR:', error.message);
    console.error(error.stack);
    stats.errors++;
  } finally {
    await mongoose.disconnect();
    process.exit(stats.errors > 0 ? 1 : 0);
  }
}

async function scanStudentFiles() {
  const students = [];
  const dataDir = path.join(__dirname, '../client/src/data/records');

  if (!fs.existsSync(dataDir)) {
    console.warn('Data directory not found:', dataDir);
    return students;
  }

  try {
    const facultiesPath = path.join(dataDir, 'faculties');
    if (!fs.existsSync(facultiesPath)) return students;

    const faculties = fs.readdirSync(facultiesPath);
    
    for (const faculty of faculties) {
      const facultyPath = path.join(facultiesPath, faculty);
      if (!fs.statSync(facultyPath).isDirectory()) continue;
      
      const deptPath = path.join(facultyPath, 'departments');
      if (!fs.existsSync(deptPath)) continue;

      const departments = fs.readdirSync(deptPath);
      
      for (const dept of departments) {
        const deptFullPath = path.join(deptPath, dept);
        if (!fs.statSync(deptFullPath).isDirectory()) continue;

        const studentsPath = path.join(deptFullPath, 'students');
        if (!fs.existsSync(studentsPath)) continue;

        const studentDirs = fs.readdirSync(studentsPath);
        
        for (const studentId of studentDirs) {
          const studentPath = path.join(studentsPath, studentId);
          if (!fs.statSync(studentPath).isDirectory()) continue;

          const profilePath = path.join(studentPath, 'profile.json');
          const academicPath = path.join(studentPath, 'academic.json');

          if (fs.existsSync(profilePath) && fs.existsSync(academicPath)) {
            try {
              const profile = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
              const academic = JSON.parse(fs.readFileSync(academicPath, 'utf-8'));

              students.push({
                profile,
                academic,
                studentId,
                faculty,
                department: dept
              });
            } catch (err) {
              console.warn('Error reading student data for', studentId, ':', err.message);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error scanning directories:', err.message);
  }

  return students;
}

async function processBatches(studentData) {
  for (let i = 0; i < studentData.length; i += BATCH_SIZE) {
    const batch = studentData.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(studentData.length / BATCH_SIZE);

    console.log('Batch', batchNum + '/' + totalBatches, '(' + batch.length + ' records)');
    
    await processBatch(batch);
    
    console.log('  Progress:', Math.min(i + BATCH_SIZE, studentData.length) + '/' + studentData.length);
  }
}

async function processBatch(batchData) {
  const usersToCreate = [];
  const studentsToCreate = [];

  for (const data of batchData) {
    try {
      const profile = data.profile;
      const academic = data.academic;
      const studentId = data.studentId;

      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
      const user = {
        username: profile.id || studentId,
        password: hashedPassword,
        role: 'student',
        fullName: profile.fullName || 'Unknown',
      };
      usersToCreate.push(user);

      const student = {
        id: profile.id || studentId,
        name: profile.fullName || 'Unknown',
        faculty: academic.faculty || data.faculty || 'Unknown',
        department: academic.department || data.department || 'Unknown',
        gpa: academic.gpa || '0.00',
        semester: academic.semester || 1,
        status: profile.status || 'Aktif Ogrenci',
        email: profile.email || '',
        tcNo: profile.tcNo || '',
        nationality: profile.nationality || 'T.C.',
        birthDate: profile.birthDate || '',
        birthPlace: profile.birthPlace || '',
        gender: profile.gender || '',
        phone: profile.phone || '',
        personalEmail: profile.personalEmail || '',
        address: profile.address || '',
        emergencyContact: profile.emergencyContact || '',
        programLanguage: academic.programLanguage || 'Turkce',
        educationType: academic.educationType || 'Orgun Ogretim',
        degreeLevel: academic.degreeLevel || 'Lisans',
        registrationType: 'Normal',
        registrationDate: academic.registrationDate || new Date().toISOString().split('T')[0],
        advisor: academic.advisor || 'Dr. Ogr. Uyesi TBD',
        scholarship: profile.scholarship || 'Burssuz',
      };
      studentsToCreate.push(student);
    } catch (err) {
      stats.errors++;
      stats.errorDetails.push({
        studentId: data.studentId,
        error: err.message
      });
      console.error('Error processing', data.studentId, ':', err.message);
    }
  }

  if (isDryRun) {
    console.log('  [DRY-RUN] Would create', usersToCreate.length, 'users and', studentsToCreate.length, 'students');
    stats.processed += batchData.length;
    return;
  }

  try {
    const insertedUsers = await User.insertMany(usersToCreate, { ordered: false }).catch(err => {
      if (err.code === 11000) {
        console.warn('  WARNING: Some users already exist');
        return err.insertedDocs || [];
      }
      throw err;
    });

    stats.usersCreated += Array.isArray(insertedUsers) ? insertedUsers.length : batchData.length;

    const userMap = new Map();
    if (Array.isArray(insertedUsers)) {
      for (const user of insertedUsers) {
        userMap.set(user.username, user._id);
      }
    }

    const existingUsers = await User.find({ 
      username: { $in: usersToCreate.map(u => u.username) } 
    });
    for (const user of existingUsers) {
      userMap.set(user.username, user._id);
    }

    for (let i = 0; i < studentsToCreate.length; i++) {
      const username = usersToCreate[i].username;
      if (userMap.has(username)) {
        studentsToCreate[i].userId = userMap.get(username);
        stats.linked++;
      }
    }

    const insertedStudents = await Student.insertMany(studentsToCreate, { ordered: false }).catch(err => {
      if (err.code === 11000) {
        console.warn('  WARNING: Some students already exist');
        return err.insertedDocs || [];
      }
      throw err;
    });

    stats.studentsCreated += Array.isArray(insertedStudents) ? insertedStudents.length : batchData.length;
    stats.processed += batchData.length;

  } catch (err) {
    console.error('Batch insert error:', err.message);
    stats.errors += batchData.length;
  }
}

function printReport() {
  console.log();
  console.log('IMPORT REPORT');
  console.log('Processed:', stats.processed);
  console.log('Users Created:', stats.usersCreated);
  console.log('Students Created:', stats.studentsCreated);
  console.log('Linked (User-Student):', stats.linked);
  console.log('Errors:', stats.errors);

  if (stats.errorDetails.length > 0) {
    console.log();
    console.log('ERROR DETAILS (first 10):');
    for (const err of stats.errorDetails.slice(0, 10)) {
      console.log('  -', err.studentId, ':', err.error);
    }
    if (stats.errorDetails.length > 10) {
      console.log('  ... and', stats.errorDetails.length - 10, 'more');
    }
  }

  console.log();
  console.log('LOGIN CREDENTIALS:');
  console.log('  Username: Student ID (e.g., B085001)');
  console.log('  Password: [set via SEED_PASSWORD env var]');
}

main().catch(console.error);
