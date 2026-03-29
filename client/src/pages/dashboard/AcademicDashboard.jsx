import { useState } from 'react';
import { motion } from 'framer-motion';
import AnnouncementsWidget from './widgets/AnnouncementsWidget';
import AdvisingWidget from './widgets/AdvisingWidget';
import DepartmentTasksWidget from './widgets/DepartmentTasksWidget';
import FacultyStatsWidget from './widgets/FacultyStatsWidget';
import GradingWidget from './widgets/GradingWidget';
import LabDutiesWidget from './widgets/LabDutiesWidget';
import ProctoringWidget from './widgets/ProctoringWidget';
import QuickActions from './widgets/QuickActions';
import TeachingScheduleWidget from './widgets/TeachingScheduleWidget';
import ThesisWidget from './widgets/ThesisWidget';

// ... (Widget definitions remain unchanged) ...

const CalendarFallbackWidget = () => {
    const today = new Date();
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Bugun</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
                {today.toLocaleDateString('tr-TR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </p>
            <p className="mt-2 text-xs text-slate-500">Detayli takvim gosterimi yakinda bu alanda listelenecek.</p>
        </div>
    );
};

export default function AcademicDashboard() {
    const [user] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : {};
        } catch {
            return {};
        }
    });

    const academicTitle = user.academicTitle || 'LECTURER'; // Fallback

    // Helper to determine widget visibility based on hierarchy
    const canSeeAdvising = ['ASST_PROF', 'ASSOC_PROF', 'PROFESSOR', 'DEAN'].includes(academicTitle);
    const isDean = academicTitle === 'DEAN';
    const isResearchAssistant = academicTitle === 'RES_ASST';
    const isInstructor = ['PROFESSOR', 'ASSOC_PROF', 'ASST_PROF', 'LECTURER'].includes(academicTitle);


    return (
        <div className="space-y-6 pb-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden"
            >
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Hoş Geldiniz, <span className="text-blue-700">{user.name}</span>
                        </h1>
                        <p className="text-gray-500">
                            {user.title || 'Akademisyen'} Paneli • <span className="font-medium text-gray-700">{user.department || 'Bilgisayar Mühendisliği'}</span>
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Akademik Dönem</p>
                            <p className="text-sm font-bold text-gray-700">2025-2026 Bahar</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Dynamic Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1: Priority Stats / Main Function */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Dean gets Faculty Stats at top */}
                    {isDean && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <FacultyStatsWidget />
                        </motion.div>
                    )}

                    {/* Quick Actions Bar */}
                    <QuickActions role={user.role} title={academicTitle} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TeachingScheduleWidget />

                        {canSeeAdvising && <AdvisingWidget />}

                        {isResearchAssistant && (
                            <>
                                <ProctoringWidget />
                                <LabDutiesWidget />
                                <DepartmentTasksWidget />
                            </>
                        )}

                        {isInstructor && (
                            <>
                                <ThesisWidget />
                                <GradingWidget />
                            </>
                        )}
                    </div>
                </div>

                {/* Column 2: Announcements & Calendar */}
                <div className="space-y-6">
                    <AnnouncementsWidget />
                    {/* Simplified Calendar Widget Reuse */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 px-2">Takvim</h3>
                        <CalendarFallbackWidget />
                    </div>
                </div>
            </div>
        </div>
    );
}
