import { useState } from 'react';
import { X } from 'lucide-react';

const TagInput = ({ tags = [], onTagsChange, label, placeholder = "Etiket ekle...", className = '' }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                onTagsChange([...tags, input.trim()]);
            }
            setInput('');
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onTagsChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 focus-within:bg-white transition-all min-h-[46px]">
                {tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold animate-in zoom-in duration-200">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="flex-1 bg-transparent min-w-[120px] outline-none text-sm text-slate-700 placeholder:text-slate-400 py-1"
                />
            </div>
            <p className="mt-1 ml-1 text-[10px] text-slate-400">
                Enter'a basarak ekleyin, Backspace ile silin.
            </p>
        </div>
    );
};

export default TagInput;
