import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's graduation eligibility snapshot (single document).
export const useGraduationStatus = () => {
    return useQuery({
        queryKey: ['graduation-status'],
        queryFn: async () => {
            const res = await axiosInstance.get('/graduation-status');
            return res.data || {};
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
