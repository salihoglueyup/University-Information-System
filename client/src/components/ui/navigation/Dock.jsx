import { motion } from 'framer-motion';

const Dock = ({ items = [], className = '' }) => {
    return (
        <div className={`bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl px-4 py-3 flex gap-4 items-end justify-center mx-auto w-max ${className}`}>
            {items.map((item, index) => (
                <motion.button
                    key={index}
                    whileHover={{ scale: 1.25, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group flex flex-col items-center gap-1"
                    onClick={item.onClick}
                >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {item.icon && <item.icon size={24} />}
                    </div>
                    <span className="absolute -top-10 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {item.label}
                    </span>
                    {item.active && (
                        <span className="w-1 h-1 bg-slate-400 rounded-full mt-1"></span>
                    )}
                </motion.button>
            ))}
        </div>
    );
};

export default Dock;
