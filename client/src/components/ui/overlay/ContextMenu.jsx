import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const ContextMenu = ({ trigger, items = [], className = '' }) => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClick = () => setIsOpen(false);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const handleContextMenu = (e) => {
        e.preventDefault();
        setCoords({ x: e.pageX, y: e.pageY });
        setIsOpen(true);
    };

    return (
        <div onContextMenu={handleContextMenu} className={className}>
            {trigger}
            {isOpen && createPortal(
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        style={{ top: coords.y, left: coords.x }}
                        ref={menuRef}
                        className="fixed z-50 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1"
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {items.map((item, index) => (
                            item.type === 'separator' ? (
                                <div key={index} className="border-t border-slate-100 my-1"></div>
                            ) : (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        item.onClick && item.onClick();
                                        setIsOpen(false);
                                    }}
                                    className={`
                       w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2
                       ${item.danger ? 'text-red-600 hover:bg-red-50' : ''}
                     `}
                                >
                                    {item.icon && <item.icon size={14} />}
                                    {item.label}
                                </button>
                            )
                        ))}
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ContextMenu;
