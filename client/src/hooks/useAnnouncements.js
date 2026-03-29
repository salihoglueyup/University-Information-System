import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useAnnouncements = () => {
    return useQuery({
        queryKey: ['announcements'],
        queryFn: async () => {
            const response = await axiosInstance.get('/announcements');
            return response.data;
        },
        // Real-time events handles new announcements via WebSockets,
        // so we can set a longer stale time.
        staleTime: 15 * 60 * 1000, 
    });
};
