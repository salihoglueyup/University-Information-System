import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, FileText, Mail
} from 'lucide-react';
import { Search, ChevronDown, ChevronRight, Monitor, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../../assets/Istanbul_Aydın_University_logo.svg.png';
import { roleNavigation } from '../../config/navigationConfig';
import { clearAuthSession } from '../../utils/authStorage';

export default function Sidebar({ isSidebarOpen, user }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    const [expandedGroups, setExpandedGroups] = useState({
        'Genel': true,
        'Akademik': true,
        'Yönetim': true
    });

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    // Determine which menu to show based on user role
    let userRole = 'student';
    if (user?.role === 'admin') {
        userRole = 'admin';
    } else if (user?.role === 'academic') {
        userRole = user.academicTitle === 'RES_ASST' ? 'researchAssistant' : 'instructor';
    }
    const menuData = roleNavigation[userRole] || roleNavigation.student;

    // Filter menu items based on search
    const filteredMenu = menuData.map(group => {
        const matchingItems = group.items.filter(item =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matchingItems.length > 0) {
            return { ...group, items: matchingItems };
        }
        return null;
    }).filter(group => group !== null);

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isSidebarOpen && (
                <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 100, damping: 20 }}
                    className="bg-blue-900 dark:bg-slate-900 text-white flex-shrink-0 relative flex flex-col h-screen z-50 shadow-2xl transition-colors duration-300"
                >
                    {/* Sidebar Header */}
                    <div className="h-16 px-6 flex items-center gap-3 bg-blue-950/50 dark:bg-slate-950/50 backdrop-blur-sm border-b border-blue-800/50 dark:border-slate-800/50 transition-colors duration-300">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl p-1 shadow-lg shadow-blue-900/20"
                        >
                            <img src={logo} alt="IAÜ Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="font-bold text-lg tracking-wide">UBIS</h1>
                            <p className="text-[10px] text-blue-200 uppercase tracking-wider">
                                {userRole === 'student' ? 'Öğrenci Bilgi Sistemi' : (userRole === 'academic' ? 'Akademisyen Portalı' : 'Yönetim Paneli')}
                            </p>
                        </motion.div>
                    </div>

                    {/* Search in Sidebar */}
                    <div className="px-4 py-3 bg-blue-900 dark:bg-slate-900 border-b border-blue-800/30 dark:border-slate-800/30 transition-colors duration-300">
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 text-blue-300 dark:text-slate-400 group-focus-within:text-white transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Menüde ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-blue-950/50 dark:bg-slate-800/50 border border-blue-800 dark:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-blue-100 dark:text-slate-200 placeholder-blue-400 dark:placeholder-slate-500 focus:outline-none focus:bg-blue-950 dark:focus:bg-slate-800 focus:border-blue-600 dark:focus:border-slate-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-slate-500 transition-all"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    {/* Scrollable Menu Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent py-4 px-3 space-y-1">

                        {/* Favorites Section (Only show if not searching AND user is student) */}
                        {!searchTerm && userRole === 'student' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mb-6 pb-4 border-b border-blue-800/30 mx-1"
                            >
                                <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Sık Kullanılanlar</h3>
                                <div className="space-y-0.5">
                                    {[
                                        { icon: Calendar, label: "Ders Programı", path: "/dashboard/schedule" },
                                        { icon: FileText, label: "Not Dökümü", path: "/dashboard/grades" },
                                        { icon: Mail, label: "Mesajlar", badge: 3, path: "/dashboard/emails" }
                                    ].map((item, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleNavigation(item.path)}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-white bg-white/5 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={16} className="text-amber-400" />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {filteredMenu.map((group, idx) => (
                            <motion.div
                                key={idx}
                                className="mb-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (idx * 0.1) }}
                            >
                                {!searchTerm && (
                                    <button
                                        onClick={() => toggleGroup(group.title)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-blue-100 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-blue-800/50 dark:hover:bg-slate-800/50 rounded-lg transition-all group"
                                    >
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">{group.title}</span>
                                        {expandedGroups[group.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                )}
                                {searchTerm && (
                                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 opacity-60">{group.title}</div>
                                )}

                                <AnimatePresence>
                                    {(expandedGroups[group.title] || searchTerm) && (
                                        <motion.div
                                            initial={searchTerm ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`space-y-0.5 mt-1 ml-1 ${!searchTerm && 'border-l border-blue-800 dark:border-slate-700 pl-1'}`}>
                                                {group.items.map((item, itemIdx) => (
                                                    <motion.button
                                                        key={itemIdx}
                                                        whileHover={{ x: 4, backgroundColor: "rgba(30, 64, 175, 1)", color: "#ffffff" }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleNavigation(item.path)}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${location.pathname === item.path
                                                            ? 'bg-blue-600 dark:bg-slate-700 text-white shadow-lg shadow-blue-900/50 dark:shadow-slate-900/50'
                                                            : 'text-blue-200 dark:text-slate-400 hover:text-white'
                                                            }`}
                                                    >
                                                        <item.icon size={16} className={`opacity-70 ${searchTerm && 'text-amber-400'} ${location.pathname === item.path && 'opacity-100'}`} />
                                                        <span className="font-medium truncate">
                                                            {item.label}
                                                        </span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}

                        {filteredMenu.length === 0 && (
                            <div className="text-center py-8 text-blue-300 text-sm">
                                Sonuç bulunamadı...
                            </div>
                        )}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 bg-blue-950/30 dark:bg-slate-950/30 border-t border-blue-800/50 dark:border-slate-800/50 space-y-4 transition-colors duration-300">

                        {/* Academic Status Widget (Only for Students) */}
                        {!searchTerm && userRole === 'student' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                                className="bg-blue-800/40 dark:bg-slate-800/40 rounded-xl p-3 border border-blue-700/50 dark:border-slate-700/50"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] uppercase font-bold text-blue-300 dark:text-slate-400">Akademik Durum</span>
                                    <span className="text-xs font-bold text-white bg-blue-600 dark:bg-slate-600 px-1.5 py-0.5 rounded">3.42</span>
                                </div>
                                <div className="w-full bg-blue-950 dark:bg-slate-900 rounded-full h-1.5 mb-1">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '75%' }}
                                        transition={{ delay: 1, duration: 1 }}
                                        className="bg-amber-400 h-1.5 rounded-full"
                                    ></motion.div>
                                </div>
                                <div className="flex justify-between text-[10px] text-blue-300 dark:text-slate-400">
                                    <span>AKTS: 180</span>
                                    <span>240</span>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex items-center gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-800/50 dark:bg-slate-800/50 hover:bg-blue-700 dark:hover:bg-slate-700 text-blue-200 dark:text-slate-300 hover:text-white transition-colors">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-xs font-bold">Canlı Destek</span>
                            </button>
                            <button className="p-2 rounded-lg bg-blue-800/50 dark:bg-slate-800/50 hover:bg-blue-700 dark:hover:bg-slate-700 text-blue-200 dark:text-slate-300 hover:text-white transition-colors">
                                <Monitor size={16} />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                clearAuthSession();
                                navigate('/login');
                            }}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-blue-200 hover:bg-red-500/20 hover:text-red-100 transition-colors group"
                        >
                            <LogOut size={20} className="group-hover:rotate-180 transition-transform" />
                            <span className="font-medium">Oturumu Kapat</span>
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
