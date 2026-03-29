import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get('/users');
                const data = Array.isArray(res.data) ? res.data : [];

                // Map backend payload to admin table shape.
                const mappedUsers = data.map((u) => ({
                    id: u._id || u.id,
                    name: u.fullName || u.username,
                    email: u.email || u.username,
                    role: u.role,
                    department: u.department || 'Genel Yonetim',
                    status: u.status || 'active'
                }));

                setUsers(mappedUsers);
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        console.log('Edit user:', user);
    };

    const handleDelete = (userId) => {
        if (window.confirm('Bu kullaniciyi silmek istediginize emin misiniz?')) {
            setUsers(users.filter((u) => u.id !== userId));
        }
    };

    const handleStatusChange = (userId, newStatus) => {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <UsersIcon size={24} />
                        </div>
                        Kullanici Yonetimi
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Sistemdeki tum kullanicilari goruntuleyin, duzenleyin ve yonetin.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                        <Download size={18} />
                        Disa Aktar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all">
                        <UserPlus size={18} />
                        Yeni Kullanici
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <UserTable
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                />
            )}
        </motion.div>
    );
}
