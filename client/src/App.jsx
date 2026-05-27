import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import { SocketProvider } from './context/SocketContext';
import { getUserRole, isAuthenticated, clearAuthSession } from './utils/authStorage';
import CorporateLogin from './pages/CorporateLogin';

// Layouts
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const DocumentVerification = lazy(() => import('./pages/DocumentVerification'));

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Research Assistant Pages
const Proctoring = lazy(() => import('./pages/dashboard/Proctoring'));
const Labs = lazy(() => import('./pages/dashboard/Labs'));
const DepartmentTasks = lazy(() => import('./pages/dashboard/DepartmentTasks'));

// Instructor Pages
const Advisees = lazy(() => import('./pages/dashboard/Advisees'));
const Thesis = lazy(() => import('./pages/dashboard/Thesis'));
const Grading = lazy(() => import('./pages/dashboard/Grading'));

// Admin Pages
const Users = lazy(() => import('./pages/dashboard/Users'));
const Curriculum = lazy(() => import('./pages/dashboard/Curriculum'));
const CourseAssignments = lazy(() => import('./pages/dashboard/CourseAssignments'));
const Logs = lazy(() => import('./pages/dashboard/Logs'));
const SystemSettings = lazy(() => import('./pages/dashboard/SystemSettings'));
const AcademicReports = lazy(() => import('./pages/dashboard/AcademicReports'));
const Analytics = lazy(() => import('./pages/dashboard/Analytics'));
const Academics = lazy(() => import('./pages/dashboard/Academics'));
const FinancialReports = lazy(() => import('./pages/dashboard/FinancialReports'));
const Publications = lazy(() => import('./pages/dashboard/Publications'));
const LeaveManagement = lazy(() => import('./pages/dashboard/LeaveManagement'));
const Syllabus = lazy(() => import('./pages/dashboard/Syllabus'));
const OfficeHours = lazy(() => import('./pages/dashboard/OfficeHours'));
const QuestionBank = lazy(() => import('./pages/dashboard/QuestionBank'));
const InstructorCourses = lazy(() => import('./pages/dashboard/InstructorCourses'));
const ThesisSupport = lazy(() => import('./pages/academic/ThesisSupport'));
const AcademicProgress = lazy(() => import('./pages/academic/AcademicProgress'));
const AppointmentScheduler = lazy(() => import('./pages/dashboard/AppointmentScheduler'));
const MissingPage = lazy(() => import('./pages/dashboard/MissingPage'));
const StudentAffairs = lazy(() => import('./pages/dashboard/StudentAffairs'));
const Announcements = lazy(() => import('./pages/dashboard/Announcements'));
const Stats = lazy(() => import('./pages/dashboard/Stats'));
const LibraryDb = lazy(() => import('./pages/dashboard/LibraryDb'));
const RoomBooking = lazy(() => import('./pages/dashboard/RoomBooking'));
const GradingSupport = lazy(() => import('./pages/dashboard/GradingSupport'));
const Trainings = lazy(() => import('./pages/dashboard/Trainings'));
const StudentLists = lazy(() => import('./pages/dashboard/StudentLists'));
const ExamApplications = lazy(() => import('./pages/dashboard/ExamApplications'));
const Backup = lazy(() => import('./pages/dashboard/Backup'));

const Emails = lazy(() => import('./pages/dashboard/Emails'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const EnrolledCourses = lazy(() => import('./pages/dashboard/EnrolledCourses'));
const CourseDetail = lazy(() => import('./pages/dashboard/CourseDetail'));
const SyllabusEditor = lazy(() => import('./pages/dashboard/SyllabusEditor'));
const ResourceHub = lazy(() => import('./pages/dashboard/ResourceHub'));
const GradingGrid = lazy(() => import('./pages/dashboard/GradingGrid'));
const ProctoringScheduler = lazy(() => import('./pages/dashboard/ProctoringScheduler'));
const ExamResultView = lazy(() => import('./pages/dashboard/ExamResultView'));
const ThesisKanban = lazy(() => import('./pages/dashboard/ThesisKanban'));
const MilestoneTracker = lazy(() => import('./pages/dashboard/MilestoneTracker'));
const Student360 = lazy(() => import('./pages/dashboard/Student360'));
const AcademicProfile = lazy(() => import('./pages/dashboard/AcademicProfile'));
const TranscriptView = lazy(() => import('./pages/dashboard/TranscriptView'));
const Departments = lazy(() => import('./pages/dashboard/Departments'));
const Schedule = lazy(() => import('./pages/dashboard/Schedule'));
const DepartmentSchedule = lazy(() => import('./pages/dashboard/DepartmentSchedule'));
const Attendance = lazy(() => import('./pages/dashboard/Attendance'));
const Grades = lazy(() => import('./pages/dashboard/Grades'));
const Assignments = lazy(() => import('./pages/dashboard/Assignments'));
const DepartmentCourses = lazy(() => import('./pages/dashboard/DepartmentCourses'));
const OnlineCourses = lazy(() => import('./pages/dashboard/OnlineCourses'));
const Transcript = lazy(() => import('./pages/dashboard/Transcript'));
const Prerequisites = lazy(() => import('./pages/dashboard/Prerequisites'));
const UzemExams = lazy(() => import('./pages/dashboard/UzemExams'));
const ExemptionExam = lazy(() => import('./pages/dashboard/ExemptionExam'));
const LanguageExam = lazy(() => import('./pages/dashboard/LanguageExam'));
const ElectronicExams = lazy(() => import('./pages/dashboard/ElectronicExams'));
const SingleCourseExam = lazy(() => import('./pages/dashboard/SingleCourseExam'));
const ExamSchedule = lazy(() => import('./pages/dashboard/ExamSchedule'));
const ExamResults = lazy(() => import('./pages/dashboard/ExamResults'));
const Surveys = lazy(() => import('./pages/dashboard/Surveys'));
const Documents = lazy(() => import('./pages/dashboard/Documents'));
const Contracts = lazy(() => import('./pages/dashboard/Contracts'));
const CvForm = lazy(() => import('./pages/dashboard/CvForm'));
const Kvkk = lazy(() => import('./pages/dashboard/Kvkk'));
const DiningMenu = lazy(() => import('./pages/dashboard/DiningMenu'));
const Library = lazy(() => import('./pages/dashboard/Library'));
const ShuttleSchedule = lazy(() => import('./pages/dashboard/ShuttleSchedule'));
const StudentClubs = lazy(() => import('./pages/dashboard/StudentClubs'));
const HealthCenter = lazy(() => import('./pages/dashboard/HealthCenter'));
const Events = lazy(() => import('./pages/dashboard/Events'));
const Sports = lazy(() => import('./pages/dashboard/Sports'));
const RadioTv = lazy(() => import('./pages/dashboard/RadioTv'));
const Career = lazy(() => import('./pages/dashboard/Career'));
const LostFound = lazy(() => import('./pages/dashboard/LostFound'));
const Suggestions = lazy(() => import('./pages/dashboard/Suggestions'));
const RegistrationInfo = lazy(() => import('./pages/dashboard/RegistrationInfo'));
const CourseRegistration = lazy(() => import('./pages/dashboard/CourseRegistration'));
const Internship = lazy(() => import('./pages/dashboard/Internship'));
const Yum = lazy(() => import('./pages/dashboard/Yum'));
const Finance = lazy(() => import('./pages/dashboard/Finance'));
const Payments = lazy(() => import('./pages/dashboard/Payments'));
const Scholarships = lazy(() => import('./pages/dashboard/Scholarships'));
const BankAccounts = lazy(() => import('./pages/dashboard/BankAccounts'));
const Dormitory = lazy(() => import('./pages/dashboard/Dormitory'));
const PartTimeWork = lazy(() => import('./pages/dashboard/PartTimeWork'));
const Graduation = lazy(() => import('./pages/dashboard/Graduation'));
const AccessCard = lazy(() => import('./pages/dashboard/AccessCard'));
const Moodle = lazy(() => import('./pages/dashboard/Moodle'));
const SocialTranscript = lazy(() => import('./pages/dashboard/SocialTranscript'));
const EducationInfo = lazy(() => import('./pages/dashboard/EducationInfo'));
const AcademicCalendar = lazy(() => import('./pages/dashboard/AcademicCalendar'));
const CampusMap = lazy(() => import('./pages/dashboard/CampusMap'));
const InfoCenter = lazy(() => import('./pages/dashboard/InfoCenter'));
const SemCourses = lazy(() => import('./pages/dashboard/SemCourses'));
const JobPostings = lazy(() => import('./pages/dashboard/JobPostings'));
const Alumni = lazy(() => import('./pages/dashboard/Alumni'));
const DigitalID = lazy(() => import('./pages/dashboard/DigitalID'));

const Loading = () => {
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowRecovery(true), 8000);
    return () => clearTimeout(timeout);
  }, []);

  if (!showRecovery) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Sayfa beklenenden uzun surdu</h2>
        <p className="text-sm text-slate-600">
          Yukleme islemi takilmis olabilir. Guvenli sekilde tekrar giris yapabilirsiniz.
        </p>
        <button
          type="button"
          onClick={() => {
            clearAuthSession();
            window.location.href = '/login';
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Giris ekranina don
        </button>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const role = getUserRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<CorporateLogin />} />
              <Route path="/verify-document/:hash" element={<DocumentVerification />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="emails" element={<Emails />} />
                <Route path="settings" element={<Settings />} />
                <Route path="enrolled-courses" element={<EnrolledCourses />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="department-schedule" element={<DepartmentSchedule />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="grades" element={<Grades />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="department-courses" element={<DepartmentCourses />} />
                <Route path="online-courses" element={<OnlineCourses />} />
                <Route path="transcript" element={<Transcript />} />
                <Route path="prerequisites" element={<Prerequisites />} />
                <Route path="uzem-exams" element={<UzemExams />} />
                <Route path="exemption-exam" element={<ExemptionExam />} />
                <Route path="language-exam" element={<LanguageExam />} />
                <Route path="electronic-exams" element={<ElectronicExams />} />
                <Route path="single-course-exam" element={<SingleCourseExam />} />
                <Route path="exam-schedule" element={<ExamSchedule />} />
                <Route path="exam-results" element={<ExamResults />} />
                <Route path="surveys" element={<Surveys />} />
                <Route path="documents" element={<Documents />} />
                <Route path="contracts" element={<Contracts />} />
                <Route path="cv-form" element={<CvForm />} />
                <Route path="kvkk" element={<Kvkk />} />
                <Route path="dining-menu" element={<DiningMenu />} />
                <Route path="library" element={<Library />} />
                <Route path="shuttle-schedule" element={<ShuttleSchedule />} />
                <Route path="student-clubs" element={<StudentClubs />} />
                <Route path="health-center" element={<HealthCenter />} />
                <Route path="events" element={<Events />} />
                <Route path="sports" element={<Sports />} />
                <Route path="radio-tv" element={<RadioTv />} />
                <Route path="career" element={<Career />} />
                <Route path="lost-found" element={<LostFound />} />
                <Route path="suggestions" element={<Suggestions />} />
                <Route path="registration-info" element={<RegistrationInfo />} />
                <Route path="course-registration" element={<CourseRegistration />} />
                <Route path="internship" element={<Internship />} />
                <Route path="yum" element={<Yum />} />
                <Route path="finance" element={<Finance />} />
                <Route path="payments" element={<Payments />} />
                <Route path="scholarships" element={<Scholarships />} />
                <Route path="bank-accounts" element={<BankAccounts />} />
                <Route path="dormitory" element={<Dormitory />} />
                <Route path="part-time-work" element={<PartTimeWork />} />
                <Route path="graduation" element={<Graduation />} />
                <Route path="access-card" element={<AccessCard />} />
                <Route path="moodle" element={<Moodle />} />
                <Route path="social-transcript" element={<SocialTranscript />} />
                <Route path="education-info" element={<EducationInfo />} />
                <Route path="academic-calendar" element={<AcademicCalendar />} />
                <Route path="campus-map" element={<CampusMap />} />
                <Route path="info-center" element={<InfoCenter />} />
                <Route path="sem-courses" element={<SemCourses />} />
                <Route path="job-postings" element={<JobPostings />} />
                <Route path="alumni" element={<Alumni />} />
                <Route path="digital-id" element={<DigitalID />} />
                <Route path="proctoring" element={<RoleRoute allowedRoles={['admin', 'academic']}><Proctoring /></RoleRoute>} />
                <Route path="labs" element={<RoleRoute allowedRoles={['admin', 'academic']}><Labs /></RoleRoute>} />
                <Route path="dept-tasks" element={<RoleRoute allowedRoles={['admin', 'academic']}><DepartmentTasks /></RoleRoute>} />
                <Route path="advisees" element={<RoleRoute allowedRoles={['admin', 'academic']}><Advisees /></RoleRoute>} />
                <Route path="thesis" element={<RoleRoute allowedRoles={['admin', 'academic']}><Thesis /></RoleRoute>} />
                <Route path="grading" element={<RoleRoute allowedRoles={['admin', 'academic']}><Grading /></RoleRoute>} />
                <Route path="users" element={<RoleRoute allowedRoles={['admin']}><Users /></RoleRoute>} />
                <Route path="departments" element={<RoleRoute allowedRoles={['admin']}><Departments /></RoleRoute>} />
                <Route path="curriculum" element={<RoleRoute allowedRoles={['admin']}><Curriculum /></RoleRoute>} />
                <Route path="course-assignments" element={<RoleRoute allowedRoles={['admin']}><CourseAssignments /></RoleRoute>} />
                <Route path="logs" element={<RoleRoute allowedRoles={['admin']}><Logs /></RoleRoute>} />
                <Route path="system-settings" element={<RoleRoute allowedRoles={['admin']}><SystemSettings /></RoleRoute>} />
                <Route path="academic-reports" element={<RoleRoute allowedRoles={['admin']}><AcademicReports /></RoleRoute>} />
                <Route path="analytics" element={<RoleRoute allowedRoles={['admin']}><Analytics /></RoleRoute>} />
                <Route path="academics" element={<RoleRoute allowedRoles={['admin']}><Academics /></RoleRoute>} />
                <Route path="financial-reports" element={<RoleRoute allowedRoles={['admin']}><FinancialReports /></RoleRoute>} />
                <Route path="publications" element={<RoleRoute allowedRoles={['admin', 'academic']}><Publications /></RoleRoute>} />
                <Route path="leave-management" element={<RoleRoute allowedRoles={['admin', 'academic']}><LeaveManagement /></RoleRoute>} />
                <Route path="syllabus" element={<RoleRoute allowedRoles={['admin', 'academic']}><Syllabus /></RoleRoute>} />
                <Route path="office-hours" element={<RoleRoute allowedRoles={['admin', 'academic']}><OfficeHours /></RoleRoute>} />
                <Route path="question-bank" element={<RoleRoute allowedRoles={['admin', 'academic']}><QuestionBank /></RoleRoute>} />
                <Route path="teaching-courses" element={<RoleRoute allowedRoles={['admin', 'academic']}><InstructorCourses /></RoleRoute>} />
                <Route path="course/:courseId" element={<CourseDetail />} />
                <Route path="syllabus-editor/:courseId" element={<SyllabusEditor />} />
                <Route path="resource-hub/:courseId" element={<ResourceHub />} />
                <Route path="grading/:courseId/:assessmentId" element={<RoleRoute allowedRoles={['admin', 'academic']}><GradingGrid /></RoleRoute>} />
                <Route path="proctoring-scheduler" element={<RoleRoute allowedRoles={['admin', 'academic']}><ProctoringScheduler /></RoleRoute>} />
                <Route path="exam-result/:resultId" element={<ExamResultView />} />
                <Route path="student-360/:studentId" element={<RoleRoute allowedRoles={['admin', 'academic']}><Student360 /></RoleRoute>} />
                <Route path="thesis-kanban" element={<RoleRoute allowedRoles={['admin', 'academic']}><ThesisKanban /></RoleRoute>} />
                <Route path="milestone-tracker/:id" element={<MilestoneTracker />} />
                <Route path="transcript-view/:studentId" element={<RoleRoute allowedRoles={['admin', 'academic']}><TranscriptView /></RoleRoute>} />


                <Route path="profile" element={<AcademicProfile />} />
                <Route path="staff/:staffId" element={<AcademicProfile />} />

                {/* Research Assistant Routes */}
                <Route path="thesis-support" element={<RoleRoute allowedRoles={['admin', 'academic']}><ThesisSupport /></RoleRoute>} />
                <Route path="academic-progress" element={<RoleRoute allowedRoles={['admin', 'academic']}><AcademicProgress /></RoleRoute>} />
                <Route path="grading-support" element={<RoleRoute allowedRoles={['admin', 'academic']}><GradingSupport /></RoleRoute>} />
                <Route path="trainings" element={<RoleRoute allowedRoles={['admin', 'academic']}><Trainings /></RoleRoute>} />

                {/* Placeholders for pending features */}
                {/* Placeholders for pending features */}
                <Route path="student-lists" element={<RoleRoute allowedRoles={['admin', 'academic']}><StudentLists /></RoleRoute>} />
                <Route path="exam-applications" element={<ExamApplications />} />
                <Route path="stats" element={<Stats />} />
                <Route path="student-affairs" element={<RoleRoute allowedRoles={['admin']}><StudentAffairs /></RoleRoute>} />
                <Route path="backup" element={<RoleRoute allowedRoles={['admin']}><Backup /></RoleRoute>} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="library-db" element={<LibraryDb />} />
                <Route path="room-booking" element={<RoomBooking />} />
                <Route path="appointments" element={<AppointmentScheduler />} />


              </Route>

              {/* 404 Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
          <PwaInstallPrompt />
        </ErrorBoundary>
      </Router>
    </SocketProvider>
  );
};

export default App;
