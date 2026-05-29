import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Lost & Found board items, normalised for the UI (id + display date).
export const useLostFound = () => {
    return useQuery({
        queryKey: ['lost-found'],
        queryFn: async () => {
            const res = await axiosInstance.get('/lost-found');
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

export const useCreateLostFound = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/lost-found', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lost-found'] }),
    });
};
