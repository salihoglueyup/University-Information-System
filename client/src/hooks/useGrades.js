import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export function useGrades(userId) {
    return useQuery({
        queryKey: ['grades', userId],
        queryFn: async () => {
            const url = userId ? `/grades?userId=${userId}` : '/grades';
            const { data } = await axiosInstance.get(url);
            return data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes - grades change more often
    });
}
