import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The user's departmental tasks, normalised with id.
export const useDeptTasks = () => {
    return useQuery({
        queryKey: ['dept-tasks'],
        queryFn: async () => {
            const res = await axiosInstance.get('/dept-tasks');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 60 * 1000,
        retry: 1,
    });
};

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiosInstance.patch(`/dept-tasks/${id}/status`, { status });
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dept-tasks'] }),
    });
};
