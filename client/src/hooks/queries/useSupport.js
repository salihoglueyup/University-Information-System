import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Current user's support tickets (normalised with id + display date).
export const useSupportTickets = () => {
    return useQuery({
        queryKey: ['support'],
        queryFn: async () => {
            const res = await axiosInstance.get('/support');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({
                ...d,
                id: d._id,
                date: d.createdAt ? new Date(d.createdAt).toLocaleDateString('tr-TR') : ''
            }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/support', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support'] }),
    });
};
