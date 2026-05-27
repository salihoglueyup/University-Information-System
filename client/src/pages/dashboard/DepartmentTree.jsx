import { useState } from 'react';
import { Building, ChevronDown, ChevronRight, Edit, GraduationCap, Plus, Trash2 } from 'lucide-react';

// Components

// Mock Data
const initialStructure = [
    {
        id: 'fac-1',
        type: 'faculty',
        name: 'Mühendislik Fakültesi',
        dean: 'Prof. Dr. Mehmet Öz',
        departments: [
            { id: 'dept-1', type: 'department', name: 'Bilgisayar Mühendisliği', head: 'Prof. Dr. Ahmet Yılmaz', studentCount: 450 },
            { id: 'dept-2', type: 'department', name: 'Endüstri Mühendisliği', head: 'Prof. Dr. Ayşe Kaya', studentCount: 320 },
            { id: 'dept-3', type: 'department', name: 'Makine Mühendisliği', head: 'Prof. Dr. Can Demir', studentCount: 380 },
        ]
    },
    {
        id: 'fac-2',
        type: 'faculty',
        name: 'İktisadi ve İdari Bilimler Fakültesi',
        dean: 'Prof. Dr. Selin Çelik',
        departments: [
            { id: 'dept-4', type: 'department', name: 'İşletme', head: 'Doç. Dr. Burak Yılmaz', studentCount: 500 },
            { id: 'dept-5', type: 'department', name: 'Uluslararası İlişkiler', head: 'Dr. Öğr. Üyesi Cemal Tan', studentCount: 250 },
        ]
    },
    {
        id: 'fac-3',
        type: 'faculty',
        name: 'Hukuk Fakültesi',
        dean: 'Prof. Dr. Kemal Arslan',
        departments: [
            { id: 'dept-6', type: 'department', name: 'Hukuk', head: 'Prof. Dr. Kemal Arslan', studentCount: 600 },
        ]
    }
];

const TreeNode = ({ node, level = 0, onEdit, onDelete, onAdd }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.departments && node.departments.length > 0;

    return (
        <div className="select-none">
            <div
                className={`
                    flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer group
                    ${level === 0 ? 'bg-slate-50 hover:bg-slate-100 mb-2' : 'hover:bg-slate-50 ml-6 border-l-2 border-slate-100 pl-4'}
                `}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    {hasChildren && (
                        <div className="text-slate-400">
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                    )}
                    {!hasChildren && <div className="w-[18px]" />}

                    <div className={`p-2 rounded-lg ${level === 0 ? 'bg-blue-100 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {level === 0 ? <Building size={18} /> : <GraduationCap size={16} />}
                    </div>

                    <div>
                        <div className="font-bold text-slate-800 text-sm">{node.name}</div>
                        <div className="text-xs text-slate-500">
                            {level === 0 ? `Dekan: ${node.dean}` : `Bölüm Başkanı: ${node.head}`}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {level === 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={Plus}
                            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                            onClick={(e) => { e.stopPropagation(); onAdd(node.id); }}
                        />
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                        onClick={(e) => { e.stopPropagation(); onEdit(node); }}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
                    />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && node.departments && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {node.departments.map(dept => (
                            <TreeNode
                                key={dept.id}
                                node={dept}
                                level={level + 1}
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

export default function DepartmentTree() {
    const [structure] = useState(initialStructure);

    const handleEdit = (_node) => {
        // TODO: implement edit
    };

    const handleDelete = (_id) => {
        // TODO: implement delete
    };

    const handleAdd = (_parentId) => {
        // TODO: implement add child
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Akademik Birimler</h2>
                    <p className="text-sm text-slate-500">Fakülte ve bölümlerin hiyerarşik yapısı.</p>
                </div>
                <Button variant="primary" icon={Plus}>Yeni Fakülte</Button>
            </div>

            <div className="space-y-1">
                {structure.map(faculty => (
                    <TreeNode
                        key={faculty.id}
                        node={faculty}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAdd={handleAdd}
                    />
                ))}
            </div>
        </Card>
    );
}
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '../../components/ui';
