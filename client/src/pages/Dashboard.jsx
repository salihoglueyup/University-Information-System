import { useState } from 'react';
import { getUserRole } from '../utils/authStorage';
import AdminDashboard from './dashboard/AdminDashboard';
import AcademicDashboard from './dashboard/AcademicDashboard';
import StudentDashboard from './dashboard/StudentDashboard';

export default function Dashboard() {
    const [userRole] = useState(() => getUserRole());

    if (userRole === 'admin') {
        return <AdminDashboard />;
    }

    if (userRole === 'academic') {
        return <AcademicDashboard />;
    }

    // Default to Student Dashboard
    return <StudentDashboard />;
}
