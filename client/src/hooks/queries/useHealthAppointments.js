import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's medical-center appointments, normalised with id.
export const useHealthAppointments = () => {
    return useQuery({
        queryKey: ['health-appointments'],
        queryFn: async () => {
            const res = await axiosInstance.get('/health-appointments');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useCreateHealthAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/health-appointments', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['health-appointments'] }),
    });
};
