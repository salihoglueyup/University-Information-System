import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Current user's leave / assignment requests (normalised with id).
export const useLeaveRequests = () => {
    return useQuery({
        queryKey: ['leave'],
        queryFn: async () => {
            const res = await axiosInstance.get('/leave');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useCreateLeave = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/leave', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leave'] }),
    });
};
