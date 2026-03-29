import { useState } from 'react';

const Collapsible = ({ trigger, children, open = false, onOpenChange, className = '' }) => {
    const [isOpenInternal, setIsOpenInternal] = useState(open);

    const isControlled = onOpenChange !== undefined;
    const isOpen = isControlled ? open : isOpenInternal;

    const handleToggle = () => {
        if (isControlled) {
            onOpenChange(!open);
        } else {
            setIsOpenInternal(!isOpenInternal);
        }
    };

    return (
        <div className={className}>
            <div onClick={handleToggle} className="cursor-pointer">
                {trigger}
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Collapsible;
