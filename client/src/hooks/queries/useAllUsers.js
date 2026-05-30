import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// All users (admin-only), normalised with id/name for management views.
export const useAllUsers = () => {
    return useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const res = await axiosInstance.get('/users');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(u => ({
                ...u,
                id: u.id || u._id,
                name: u.fullName || u.username || '',
                title: u.title || ''
            }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
