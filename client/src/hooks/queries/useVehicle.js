import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's current vehicle/sticker (or null).
export const useVehicle = () => {
    return useQuery({
        queryKey: ['vehicle'],
        queryFn: async () => {
            const res = await axiosInstance.get('/vehicle');
            return res.data || null;
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useApplyVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/vehicle', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicle'] }),
    });
};
