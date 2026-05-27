import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Menubar = ({ menus = [], className = '' }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={`flex bg-white border border-slate-200 rounded-lg p-1 ${className}`}>
            {menus.map((menu, idx) => (
                <div key={idx} className="relative">
                    <button
                        onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                        onMouseEnter={() => activeMenu !== null && setActiveMenu(idx)}
                        className={`
                        px-3 py-1.5 text-sm font-medium rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1
                        ${activeMenu === idx ? 'bg-slate-100' : 'text-slate-700'}
                    `}
                    >
                        {menu.label}
                    </button>
                    <AnimatePresence>
                        {activeMenu === idx && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.1 }}
                                className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1"
                            >
                                {menu.items.map((item, i) => (
                                    item.type === 'separator' ? (
                                        <div key={i} className="border-t border-slate-100 my-1"></div>
                                    ) : (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                item.onClick && item.onClick();
                                                setActiveMenu(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                                        >
                                            <span className="flex items-center gap-2">
                                                {item.icon && <item.icon size={14} className="text-slate-400" />}
                                                {item.label}
                                            </span>
                                            {item.shortcut && <span className="text-xs text-slate-400">{item.shortcut}</span>}
                                        </button>
                                    )
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

export default Menubar;
