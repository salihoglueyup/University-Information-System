import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ title, content, isOpen, onClick }) => {
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-2">
            <button
                onClick={onClick}
                className={`
          w-full flex items-center justify-between px-6 py-4 text-left font-bold transition-colors
          ${isOpen ? 'bg-blue-50 text-blue-700' : 'bg-white text-slate-700 hover:bg-gray-50'}
        `}
            >
                <span>{title}</span>
                <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 py-4 border-t border-gray-100 text-slate-600 text-sm leading-relaxed">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Accordion = ({ items = [], allowMultiple = false, className = '' }) => {
    const [openIndexes, setOpenIndexes] = useState([]);

    const handleClick = (index) => {
        if (allowMultiple) {
            setOpenIndexes(prev =>
                prev.includes(index)
                    ? prev.filter(i => i !== index)
                    : [...prev, index]
            );
        } else {
            setOpenIndexes(prev =>
                prev.includes(index) ? [] : [index]
            );
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {items.map((item, idx) => (
                <AccordionItem
                    key={idx}
                    title={item.title}
                    content={item.content}
                    isOpen={openIndexes.includes(idx)}
                    onClick={() => handleClick(idx)}
                />
            ))}
        </div>
    );
};

export default Accordion;
