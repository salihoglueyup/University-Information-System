import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The instructor's pending grading tasks, normalised with id.
export const useGradingQueue = () => {
    return useQuery({
        queryKey: ['grading-queue'],
        queryFn: async () => {
            const res = await axiosInstance.get('/grading-queue');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};
