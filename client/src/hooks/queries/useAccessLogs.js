import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's campus card-access events, normalised with id.
export const useAccessLogs = () => {
    return useQuery({
        queryKey: ['access-logs'],
        queryFn: async () => {
            const res = await axiosInstance.get('/access-logs');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
