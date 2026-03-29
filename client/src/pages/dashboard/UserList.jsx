import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2
} from 'lucide-react';

// Components

// Mock Data
const initialUsers = [
    { id: 1, name: "Ali Yılmaz", email: "ali.yilmaz@ogrenci.university.edu.tr", role: "STUDENT", department: "Bilgisayar Mühendisliği", status: "Active", lastLogin: "2026-02-14 10:30" },
    { id: 2, name: "Prof. Dr. Ahmet Yılmaz", email: "ahmet.yilmaz@university.edu.tr", role: "PROFESSOR", department: "Bilgisayar Mühendisliği", status: "Active", lastLogin: "2026-02-14 09:15" },
    { id: 3, name: "Dr. Öğr. Üyesi Ayşe Kaya", email: "ayse.kaya@university.edu.tr", role: "ASST_PROF", department: "Endüstri Mühendisliği", status: "Active", lastLogin: "2026-02-13 16:45" },
    { id: 4, name: "Mehmet Demir", email: "mehmet.demir@idari.university.edu.tr", role: "ADMIN", department: "Bilgi İşlem", status: "Active", lastLogin: "2026-02-14 11:00" },
    { id: 5, name: "Zeynep Çelik", email: "zeynep.celik@ogrenci.university.edu.tr", role: "STUDENT", department: "Mimarlık", status: "Inactive", lastLogin: "2025-12-20 14:20" },
    { id: 6, name: "Arş. Gör. Burak Yıldız", email: "burak.yildiz@university.edu.tr", role: "RES_ASST", department: "Makine Mühendisliği", status: "Active", lastLogin: "2026-02-14 08:30" },
];

const roles = {
    STUDENT: { label: "Öğrenci", color: "bg-blue-100 text-blue-700" },
    PROFESSOR: { label: "Profesör", color: "bg-purple-100 text-purple-700" },
    ASSOC_PROF: { label: "Doçent", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    ASST_PROF: { label: "Dr. Öğr. Üyesi", color: "bg-purple-100 text-purple-700" },
    LECTURER: { label: "Öğr. Gör.", color: "bg-purple-100 text-purple-700" },
    RES_ASST: { label: "Arş. Gör.", color: "bg-indigo-100 text-indigo-700" },
    ADMIN: { label: "Yönetici", color: "bg-red-100 text-red-700" },
    STAFF: { label: "Personel", color: "bg-slate-100 text-slate-700" },
};

export default function UserList() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleSaveUser = (userData) => {
        // Logic to save user (mock)
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
        } else {
            const newUser = { ...userData, id: users.length + 1, lastLogin: 'Never' };
            setUsers([...users, newUser]);
        }
    };

    // Filtering
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // Role Stats
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.status === 'Active').length;
        const students = users.filter(u => u.role === 'STUDENT').length;
        const academic = users.filter(u => ['PROFESSOR', 'ASSOC_PROF', 'ASST_PROF', 'LECTURER', 'RES_ASST'].includes(u.role)).length;
        return { total, active, students, academic };
    }, [users]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            {/* Header / Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Toplam Kullanıcı</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><User size={20} /></div>
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Aktif</p>
                        <h3 className="text-2xl font-bold text-emerald-600">{stats.active}</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle size={20} /></div>
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Öğrenci</p>
                        <h3 className="text-2xl font-bold text-indigo-600">{stats.students}</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><User size={20} /></div>
                </Card>
                <Card className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Akademik</p>
                        <h3 className="text-2xl font-bold text-purple-600">{stats.academic}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Shield size={20} /></div>
                </Card>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="İsim veya e-posta ara..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            className="pl-10 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm appearance-none bg-none"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="ALL">Tüm Roller</option>
                            <option value="STUDENT">Öğrenci</option>
                            <option value="PROFESSOR">Profesör</option>
                            <option value="ADMIN">Yönetici</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {selectedUsers.length > 0 && (
                        <Button variant="danger" icon={Trash2}>Sil ({selectedUsers.length})</Button>
                    )}
                    <Button variant="primary" icon={Plus} onClick={handleAddUser}>Yeni Kullanıcı</Button>
                </div>
            </div>

            {/* Data Grid */}
            <Card className="flex-1 overflow-hidden flex flex-col border-0 shadow-lg">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-bold tracking-wider">
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        onChange={handleSelectAll}
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                    />
                                </th>
                                <th className="p-4">Kullanıcı Adı</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4">Departman</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={user.name} size="sm" />
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${roles[user.role]?.color || 'bg-gray-100 text-gray-600'}`}>
                                            {roles[user.role]?.label || user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-slate-600 font-medium">{user.department}</span>
                                    </td>
                                    <td className="p-4">
                                        {user.status === 'Active' ? (
                                            <Badge variant="success" className="text-[10px]">Aktif</Badge>
                                        ) : (
                                            <Badge variant="danger" className="text-[10px]">Pasif</Badge>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" icon={Edit} className="h-8 w-8 p-0" onClick={() => handleEditUser(user)} />
                                            <Button variant="ghost" size="sm" icon={Trash2} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500 bg-white">
                    <span>Toplam {filteredUsers.length} kayıt gösteriliyor</span>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" disabled>Önceki</Button>
                        <Button variant="secondary" size="sm">Sonraki</Button>
                    </div>
                </div>
            </Card>

            <UserForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingUser}
                onSave={handleSaveUser}
            />
        </div>
    );
}
