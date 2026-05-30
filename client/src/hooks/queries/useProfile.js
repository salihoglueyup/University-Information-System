import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The signed-in user's profile, normalised for the UI (name/studentId/avatar).
export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const d = (await axiosInstance.get('/users/profile')).data || {};
            return {
                ...d,
                id: d.id || d._id || '',
                username: d.username || '',
                name: d.fullName || d.username || '',
                studentId: d.username || '',
                email: d.email || '',
                faculty: d.faculty || '',
                department: d.department || '',
                avatar: d.profilePicture || '',
                gpa: d.gpa ?? '-'
            };
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
