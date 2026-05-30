import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Appointments owned by the current user (advisor view), normalised with id.
export const useAppointments = () => {
    return useQuery({
        queryKey: ['appointments'],
        queryFn: async () => {
            const res = await axiosInstance.get('/appointments');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useUpdateAppointmentStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiosInstance.patch(`/appointments/${id}/status`, { status });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
    });
};

export const useOfficeHours = () => {
    return useQuery({
        queryKey: ['office-hours'],
        queryFn: async () => {
            const res = await axiosInstance.get('/appointments/office-hours');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useCreateOfficeHour = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/appointments/office-hours', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['office-hours'] }),
    });
};

export const useDeleteOfficeHour = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await axiosInstance.delete(`/appointments/office-hours/${id}`);
            return id;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['office-hours'] }),
    });
};
