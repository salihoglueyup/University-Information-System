import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export function useAttendance() {
    return useQuery({
        queryKey: ['attendance'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/attendance');
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
