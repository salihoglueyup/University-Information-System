import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// Current user's health reports (normalised with id).
export const useHealthReports = () => {
    return useQuery({
        queryKey: ['health-reports'],
        queryFn: async () => {
            const res = await axiosInstance.get('/health-reports');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useCreateHealthReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosInstance.post('/health-reports', payload);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['health-reports'] }),
    });
};
