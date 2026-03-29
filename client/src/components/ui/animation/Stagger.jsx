
export const StaggerContainer = ({ children, className = '', delay = 0, staggerChildren = 0.1, ...props }) => {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerChildren,
                        delayChildren: delay
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, className = '', ...props }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};
