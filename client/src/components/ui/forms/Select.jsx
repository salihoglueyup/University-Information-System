import { useState, useRef, useEffect } from 'react';

const Select = ({
    label,
    options = [],
    value, // String for single, Array for multiple
    onChange,
    error,
    className = '',
    icon: Icon,
    placeholder = "Seçiniz...",
    searchable = false,
    multiple = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = searchable
        ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : options;

    const handleSelect = (optionValue) => {
        if (multiple) {
            const newValue = Array.isArray(value) ? value : [];
            if (newValue.includes(optionValue)) {
                onChange(newValue.filter(v => v !== optionValue));
            } else {
                onChange([...newValue, optionValue]);
            }
        } else {
            onChange({ target: { value: optionValue } });
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    const getDisplayValue = () => {
        if (multiple) {
            if (!value || value.length === 0) return placeholder;
            return `${value.length} seçildi`;
        } else {
            const selected = options.find(opt => opt.value === value);
            return selected ? selected.label : placeholder;
        }
    };

    const removeItem = (e, valToRemove) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== valToRemove));
    }

    return (
        <div className={`w-full ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
            w-full bg-slate-50 border rounded-xl py-2 px-4 min-h-[42px] text-sm text-left flex items-center justify-between cursor-pointer
            transition-all
            ${isOpen ? 'bg-white border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}
            ${Icon ? 'pl-10' : ''}
          `}
                >
                    {Icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon size={18} />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-1 flex-1">
                        {multiple && Array.isArray(value) && value.length > 0 ? (
                            value.map(val => {
                                const opt = options.find(o => o.value === val);
                                return (
                                    <span key={val} className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                                        {opt ? opt.label : val}
                                        <X size={10} className="hover:text-blue-900 cursor-pointer" onClick={(e) => removeItem(e, val)} />
                                    </span>
                                )
                            })
                        ) : (
                            <span className={(!multiple && value) ? 'text-slate-900' : 'text-slate-400'}>
                                {multiple ? placeholder : getDisplayValue()}
                            </span>
                        )}
                    </div>

                    <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
                    />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.1 }}
                            className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden"
                        >
                            {searchable && (
                                <div className="p-2 border-b border-slate-100">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Ara..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-slate-50 rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
                                {filteredOptions.map((opt) => {
                                    const isSelected = multiple ? value?.includes(opt.value) : value === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSelect(opt.value)}
                                            className={`
                            w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between
                            ${isSelected ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}
                          `}
                                        >
                                            {opt.label}
                                            {isSelected && <Check size={14} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <p className="mt-1 ml-1 text-xs text-red-500 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
