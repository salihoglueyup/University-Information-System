import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Menu, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSocket } from '../context/SocketContext';
import { getUser } from '../utils/authStorage';
import Sidebar from '../components/layout/Sidebar';
import UbisAiAssistant from '../components/ui/UbisAiAssistant';

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    // Using global socket context replacing duplicate inline connection
    const { notifications, markAsRead, markAllAsRead } = useSocket();
    const unreadCount = notifications.filter(n => !n.read).length;

    // User state - reading from localStorage
    const [user] = useState(() => {
        const parsedUser = getUser();
        if (parsedUser) {
            return {
                name: parsedUser.name || parsedUser.fullName || parsedUser.username || 'Kullanıcı',
                role: parsedUser.role || 'student', // Raw role key
                avatar: parsedUser.avatar
            };
        }
        return { name: 'Misafir', role: 'student' };
    });

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Yönetici';
            case 'academic': return 'Akademisyen';
            case 'student': return 'Öğrenci';
            default: return 'Kullanıcı';
        }
    };

    // Listen for new notifications to trigger toast
    const [lastNotifiedId, setLastNotifiedId] = useState(null);
    useEffect(() => {
        const latestUnread = notifications.find(n => !n.read);
        if (latestUnread && latestUnread.id !== lastNotifiedId) {
            setLastNotifiedId(latestUnread.id);
            toast.info(latestUnread.message, {
                icon: latestUnread.type === 'success' ? '📝' : '📢',
            });
            markAsRead(latestUnread.id);
        }
    }, [notifications, lastNotifiedId, markAsRead]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex font-sans overflow-hidden transition-colors duration-300">
            {/* Sidebar Component */}
            <Sidebar isSidebarOpen={isSidebarOpen} user={user} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                {/* Header */}
                <header className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm flex-shrink-0 z-40 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <Menu size={20} />
                        </motion.button>
                        <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-900 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-blue-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-slate-700 transition-all">
                            <Search size={18} className="text-gray-400 dark:text-slate-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Menüde ara..."
                                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            onClick={() => markAllAsRead()}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white dark:border-slate-900"
                                >
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </motion.span>
                            )}
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-800">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getRoleLabel(user.role)}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold border-2 border-white dark:border-slate-800 shadow-md overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0)
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto space-y-8 pb-10">
                        {/* Page Transition Wrapper */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="w-full"
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Global Campus AI Widget */}
            <UbisAiAssistant />
        </div>
    );
}
