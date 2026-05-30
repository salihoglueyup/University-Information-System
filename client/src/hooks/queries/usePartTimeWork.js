import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's part-time assignment + timesheet (single document).
export const usePartTimeWork = () => {
    return useQuery({
        queryKey: ['part-time-work'],
        queryFn: async () => {
            const res = await axiosInstance.get('/part-time-work');
            return res.data || {};
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useAddShift = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (shift) => {
            const res = await axiosInstance.post('/part-time-work/shifts', shift);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['part-time-work'] }),
    });
};
