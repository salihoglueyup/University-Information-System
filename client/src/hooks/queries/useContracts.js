import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Current user's contracts (normalised with id).
export const useContracts = () => {
    return useQuery({
        queryKey: ['contracts'],
        queryFn: async () => {
            const res = await axiosInstance.get('/contracts');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useSignContract = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.patch(`/contracts/${id}/status`, { status: 'Onaylandı' });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts'] }),
    });
};
