import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { getUser } from '../../utils/authStorage';

// Widgets
import StatsWidget from './widgets/StatsWidget';
import ScheduleWidget from './widgets/ScheduleWidget';
import AssignmentsWidget from './widgets/AssignmentsWidget';
import AnnouncementsWidget from './widgets/AnnouncementsWidget';

export default function StudentDashboard() {
    const localUser = getUser() || { name: 'Ogrenci', id: '' };
    const identifier = localUser.username || localUser.id;

    // Use TanStack Query to fetch profile and cache it automatically
    const { data: studentData, isLoading, isError } = useQuery({
        queryKey: ['studentProfile', identifier],
        queryFn: async () => {
            const res = await axiosInstance.get(`/students/${identifier}/360`);
            return res.data;
        },
        enabled: !!identifier, // Only fetch if we have an identifier
        staleTime: 5 * 60 * 1000, // Cache for 5 mins
        retry: 1
    });

    // Merge cached data with local user fallback
    const user = studentData ? {
        ...localUser,
        ...studentData,
        semester: studentData.gpaHistory?.length ? studentData.gpaHistory.length + 1 : 5,
        completedCredits: studentData.totalCredits || 0,
        totalCreditsRequired: 240
    } : localUser;

    // Show loading only if data hasn't arrived AND no error (or on initial fetch)
    // If data arrived, render it even if React Query state is still updating
    if (!studentData && isLoading && !isError) {
        return <div className="p-8 flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }
    
    // If error occurred after exhausting retries, show error but still render with fallback
    if (isError && !studentData) {
        console.warn('Failed to fetch student profile, using fallback');
    }
    
    return (
        <div className="space-y-6 pb-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Hoş Geldin, {user.name.split(' ')[0]} 👋</h1>
                    <p className="text-blue-100 text-lg">Bugün akademik hedeflerine bir adım daha yaklaşmak için harika bir gün!</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
                <div className="absolute right-20 bottom-0 h-32 w-32 bg-amber-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Quick Stats Grid */}
            <StatsWidget user={user} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Left Column (Assignments & Schedule) */}
                <div className="space-y-6 lg:col-span-1 xl:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="h-full">
                            <ScheduleWidget />
                        </div>
                        <div className="h-full">
                            <AssignmentsWidget />
                        </div>
                    </div>
                </div>

                {/* Right Column (Announcements) */}
                <div className="lg:col-span-1">
                    <AnnouncementsWidget />
                </div>
            </div>
        </div>
    );
}
