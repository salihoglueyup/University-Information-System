import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

// The continuing-education (SEM) catalog, normalised with id.
export const useSemCourses = () => {
    return useQuery({
        queryKey: ['sem-courses'],
        queryFn: async () => {
            const res = await axiosInstance.get('/sem-courses');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.map(d => ({ ...d, id: d._id }));
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};

export const useEnrollSemCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.post(`/sem-courses/${id}/enroll`);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sem-courses'] }),
    });
};
