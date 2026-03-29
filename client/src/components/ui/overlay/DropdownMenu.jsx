import { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ trigger, items = [], width = "w-48", align = "right" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.1 }}
                        className={`
              absolute z-50 mt-2 ${width} origin-top-${align} rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
              ${align === 'right' ? 'right-0' : 'left-0'}
            `}
                    >
                        <div className="py-1">
                            {items.map((item, index) => (
                                <div key={index}>
                                    {item.type === 'separator' ? (
                                        <div className="border-t border-gray-100 my-1"></div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                item.onClick && item.onClick();
                                                setIsOpen(false);
                                            }}
                                            className={`
                          group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900
                          ${item.className || ''}
                        `}
                                        >
                                            {item.icon && <item.icon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />}
                                            {item.label}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropdownMenu;
