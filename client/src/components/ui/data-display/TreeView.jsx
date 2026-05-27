import { useState } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, Folder, File } from 'lucide-react';

const TreeNode = ({ node, onSelect, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const handleSelect = (e) => {
        e.stopPropagation();
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
        onSelect && onSelect(node);
    };

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors ${level > 0 ? 'ml-4' : ''}`}
                onClick={handleSelect}
            >
                <span className="text-slate-400">
                    {hasChildren ? (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                        <span className="w-3.5" /> // Spacer
                    )}
                </span>

                <span className={hasChildren ? 'text-blue-500' : 'text-slate-500'}>
                    {hasChildren ? (isOpen ? <FolderOpen size={16} /> : <Folder size={16} />) : <File size={16} />}
                </span>

                <span className="text-sm text-slate-700">{node.label}</span>
            </div>

            {isOpen && hasChildren && (
                <div>
                    {node.children.map((child, index) => (
                        <TreeNode key={child.id || index} node={child} onSelect={onSelect} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const TreeView = ({ data = [], onSelect, className = '' }) => {
    return (
        <div className={`p-2 ${className}`}>
            {data.map((node, index) => (
                <TreeNode key={node.id || index} node={node} onSelect={onSelect} />
            ))}
        </div>
    );
};

export default TreeView;
