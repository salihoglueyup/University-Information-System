import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DepartmentNode = ({ node, level = 0, onAdd, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.subDepartments && node.subDepartments.length > 0;

    return (
        <div className="select-none">
            <motion.div
                layout
                className={`flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group ${level === 0 ? 'bg-gray-50/50 mb-2 border border-gray-100' : 'ml-6 border-l-2 border-gray-100 pl-4'
                    }`}
            >
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <div className={`p-2 rounded-lg ${level === 0 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {level === 0 ? <Building size={18} /> : <Briefcase size={16} />}
                    </div>

                    <div>
                        <h4 className={`font-bold text-gray-800 ${level === 0 ? 'text-base' : 'text-sm'}`}>
                            {node.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            {node.dean && <span>Dekan: {node.dean}</span>}
                            {node.head && <span>Bölüm Başkanı: {node.head}</span>}
                            <div className="flex items-center gap-1">
                                <Users size={12} />
                                <span>{node.studentCount} Öğrenci</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {level === 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onAdd(node.id); }}
                            className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                            title="Alt Birim Ekle"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(node); }}
                        className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                        title="Düzenle"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Sil"
                    >
                        <Trash2 size={16} />
                    </button>
                    {hasChildren && (
                        <div className="ml-2 text-gray-300">
                            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {node.subDepartments.map(subDept => (
                            <DepartmentNode
                                key={subDept.id}
                                node={subDept}
                                level={level + 1}
                                onAdd={onAdd}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function DepartmentTree({ departments, onAdd, onEdit, onDelete }) {
    return (
        <div className="space-y-2">
            {departments.map(dept => (
                <DepartmentNode
                    key={dept.id}
                    node={dept}
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
