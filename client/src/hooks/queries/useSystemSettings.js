import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// University-wide system configuration.
export const useSystemSettings = () => {
    return useQuery({
        queryKey: ['system-settings'],
        queryFn: async () => {
            const res = await axiosInstance.get('/system-settings');
            return res.data || {};
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useUpdateSystemSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.patch('/system-settings', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system-settings'] }),
    });
};
