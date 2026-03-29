import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

const CommandPalette = ({ isOpen, onClose, items = [] }) => {
    const [query, setQuery] = useState('');

    // Filter items based on query using useMemo
    const filteredItems = useMemo(() => {
        if (!query) return items;
        const lowerQuery = query.toLowerCase();
        return items.filter(item =>
            item.label.toLowerCase().includes(lowerQuery) ||
            (item.description && item.description.toLowerCase().includes(lowerQuery))
        );
    }, [query, items]);



    // Close on Escape & disable scroll
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onClose(); // Toggle logic should be handled by parent if needed, here just close or ensure usage
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                    />

                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[60vh] ring-1 ring-slate-900/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center border-b border-slate-100 px-4">
                                <Search className="text-slate-400 w-5 h-5 mr-3" />
                                <input
                                    type="text"
                                    placeholder="Bir komut veya sayfa arayın..."
                                    className="flex-1 py-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                                    autoFocus
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="flex items-center gap-2">
                                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                                        <span className="text-xs">ESC</span>
                                    </kbd>
                                </div>
                            </div>

                            <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
                                {filteredItems.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredItems.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    item.action && item.action();
                                                    onClose();
                                                }}
                                                className="w-full flex items-center px-3 py-3 text-sm text-left rounded-lg hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition-colors group"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-500 mr-3 group-hover:bg-white group-hover:text-blue-500 sm:group-hover:shadow-sm transition-all border border-slate-100 group-hover:border-blue-100">
                                                    {item.icon || <Command size={16} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.label}</div>
                                                    {item.description && (
                                                        <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
                                                    )}
                                                </div>
                                                {item.shortcut && (
                                                    <span className="text-xs text-slate-400 font-mono">{item.shortcut}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-slate-500">
                                        <p className="text-sm">Sonuç bulunamadı.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CommandPalette;
